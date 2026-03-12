#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  Monorepo Architecture POC — Start All Services & Apps
# ─────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGS="$ROOT/.logs"
PIDS="$ROOT/.pids"

# ── Colours ───────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}[info]${RESET}  $*"; }
success() { echo -e "${GREEN}[ok]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[warn]${RESET}  $*"; }
error()   { echo -e "${RED}[error]${RESET} $*"; }

# ── Helpers ───────────────────────────────────────────────
kill_port() {
  local port=$1
  local pid
  pid=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [[ -n "$pid" ]]; then
    warn "Port $port already in use by PID $pid — stopping it"
    kill -9 "$pid" 2>/dev/null || true
    sleep 0.3
  fi
}

wait_for_port() {
  local name=$1 port=$2 timeout=${3:-30} count=0
  info "Waiting for $name on :$port …"
  while ! curl -sf "http://localhost:$port/health" > /dev/null 2>&1; do
    sleep 1
    count=$(( count + 1 ))
    if (( count >= timeout )); then
      error "$name did not become healthy after ${timeout}s — check .logs/${name}.log"
      exit 1
    fi
  done
  success "$name is up  →  http://localhost:$port"
}

wait_for_http() {
  local name=$1 port=$2 timeout=${3:-60} count=0
  info "Waiting for $name on :$port …"
  while ! curl -sf "http://localhost:$port/" > /dev/null 2>&1; do
    sleep 1
    count=$(( count + 1 ))
    if (( count >= timeout )); then
      error "$name did not respond after ${timeout}s — check .logs/${name}.log"
      exit 1
    fi
  done
  success "$name is up  →  http://localhost:$port"
}

open_url() {
  local url=$1
  if command -v xdg-open &>/dev/null; then
    xdg-open "$url" &>/dev/null &
  elif command -v open &>/dev/null; then
    open "$url"
  else
    warn "Cannot auto-open browser — visit $url manually"
  fi
}

# ── Prepare ───────────────────────────────────────────────
mkdir -p "$LOGS" "$PIDS"

echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  Monorepo Architecture POC${RESET}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# ── Kill anything already on our ports ────────────────────
info "Checking ports …"
for port in 3000 3001 3002 4200 4201 4202; do
  kill_port "$port"
done
sleep 1  # let the OS release the sockets

# ── Start backend services ────────────────────────────────
echo ""
info "Starting backend services …"

(
  cd "$ROOT/services/user-service"
  npx ts-node-dev --respawn --transpile-only src/main.ts \
    > "$LOGS/user-service.log" 2>&1 &
  echo $! > "$PIDS/user-service.pid"
)

(
  cd "$ROOT/services/notification-service"
  npx ts-node-dev --respawn --transpile-only src/main.ts \
    > "$LOGS/notification-service.log" 2>&1 &
  echo $! > "$PIDS/notification-service.pid"
)

(
  cd "$ROOT/services/api-gateway"
  npx ts-node-dev --respawn --transpile-only src/main.ts \
    > "$LOGS/api-gateway.log" 2>&1 &
  echo $! > "$PIDS/api-gateway.pid"
)

# Wait for all three to be healthy
wait_for_port "user-service"        3001
wait_for_port "notification-service" 3002
wait_for_port "api-gateway"         3000

# ── Start frontend apps ───────────────────────────────────
echo ""
info "Starting frontend apps …"

(
  cd "$ROOT/apps/team-react"
  npx vite --port 4201 \
    > "$LOGS/team-react.log" 2>&1 &
  echo $! > "$PIDS/team-react.pid"
)

(
  cd "$ROOT/apps/showcase"
  npx ng serve --port 4200 \
    > "$LOGS/showcase.log" 2>&1 &
  echo $! > "$PIDS/showcase.pid"
)

(
  cd "$ROOT/apps/team-angular"
  npx ng serve --port 4202 \
    > "$LOGS/team-angular.log" 2>&1 &
  echo $! > "$PIDS/team-angular.pid"
)

# Wait for frontends (Angular takes up to 60s first compile)
wait_for_http "team-react"    4201 30
wait_for_http "showcase"      4200 90
wait_for_http "team-angular"  4202 90

# ── Open browsers ─────────────────────────────────────────
echo ""
info "Opening browser tabs …"
open_url "http://localhost:4200"   # showcase
open_url "http://localhost:4201"   # team-react
open_url "http://localhost:4202"   # team-angular

# ── Summary ───────────────────────────────────────────────
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${GREEN}${BOLD}  Everything is running!${RESET}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "  ${BOLD}Backend${RESET}"
echo -e "    API Gateway    →  ${CYAN}http://localhost:3000${RESET}"
echo -e "    User Service   →  ${CYAN}http://localhost:3001${RESET}"
echo -e "    Notifications  →  ${CYAN}http://localhost:3002${RESET}"
echo ""
echo -e "  ${BOLD}Frontend${RESET}"
echo -e "    Showcase       →  ${CYAN}http://localhost:4200${RESET}  (Angular demos)"
echo -e "    Team React     →  ${CYAN}http://localhost:4201${RESET}  (React + Vite)"
echo -e "    Team Angular   →  ${CYAN}http://localhost:4202${RESET}  (Angular admin)"
echo ""
echo -e "  ${BOLD}Logs${RESET}  →  .logs/*.log"
echo -e "  ${BOLD}Stop${RESET}  →  ./stop.sh"
echo ""
echo -e "Press ${BOLD}Ctrl+C${RESET} to stop watching logs (services keep running)."
echo ""

# Tail all logs so the terminal stays useful
tail -f \
  "$LOGS/user-service.log" \
  "$LOGS/notification-service.log" \
  "$LOGS/api-gateway.log" \
  "$LOGS/team-react.log" \
  "$LOGS/showcase.log" \
  "$LOGS/team-angular.log" \
  2>/dev/null
