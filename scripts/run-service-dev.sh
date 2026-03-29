#!/usr/bin/env bash
set -euo pipefail

PORT=${1:-}
ENTRY=${2:-src/main.ts}

if [[ -z "$PORT" ]]; then
  echo "Usage: bash scripts/run-service-dev.sh <port> [entry]"
  exit 1
fi

pids=$(lsof -ti tcp:"$PORT" 2>/dev/null || true)
if [[ -n "$pids" ]]; then
  echo "[serve] Releasing occupied port $PORT (PID(s): $(echo "$pids" | tr '\n' ' '))"
  while IFS= read -r pid; do
    [[ -n "$pid" ]] || continue
    kill -9 "$pid" 2>/dev/null || true
  done <<< "$pids"
  sleep 0.2
fi

exec ts-node-dev --exit-child --respawn --transpile-only "$ENTRY"
