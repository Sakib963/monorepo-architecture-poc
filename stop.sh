#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  Monorepo Architecture POC — Stop All Services & Apps
# ─────────────────────────────────────────────────────────
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIDS="$ROOT/.pids"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RESET='\033[0m'

stopped=0

# Kill by saved PIDs
if [[ -d "$PIDS" ]]; then
  for pidfile in "$PIDS"/*.pid; do
    [[ -f "$pidfile" ]] || continue
    pid=$(cat "$pidfile")
    name=$(basename "$pidfile" .pid)
    if kill -0 "$pid" 2>/dev/null; then
      kill -TERM "$pid" 2>/dev/null || true
      echo -e "${GREEN}[stopped]${RESET} $name (PID $pid)"
      (( stopped++ ))
    fi
    rm -f "$pidfile"
  done
fi

# Fallback: kill anything still on our ports
for port in 3000 3001 3002 4200 4201 4202; do
  pid=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [[ -n "$pid" ]]; then
    kill -9 "$pid" 2>/dev/null || true
    echo -e "${YELLOW}[killed]${RESET}  port $port (PID $pid)"
    (( stopped++ ))
  fi
done

if (( stopped == 0 )); then
  echo "Nothing was running."
else
  echo ""
  echo "All stopped."
fi
