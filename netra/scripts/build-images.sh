#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"

docker build -t netra-frontend "$ROOT_DIR/frontend"
docker build -t netra-backend "$ROOT_DIR/backend"
docker build -t netra-ai-service "$ROOT_DIR/ai-service"
