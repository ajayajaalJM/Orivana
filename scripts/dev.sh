#!/usr/bin/env bash
# Orivana dev startup — kills stale servers, clears cache, starts live reload dev server.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3000}"
cd "$ROOT"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ORIVANA — Development Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── 1. Stop anything already running for this project ──────────────────────
echo "→ Stopping existing dev servers..."

# Kill Next.js processes tied to this project directory
pkill -f "${ROOT}/node_modules/.bin/next" 2>/dev/null || true
pkill -f "${ROOT}/node_modules/next/dist" 2>/dev/null || true

# Free the port(s) we might use
for p in "$PORT" 3001; do
  if lsof -ti ":$p" >/dev/null 2>&1; then
    lsof -ti ":$p" | xargs kill -9 2>/dev/null || true
    echo "  Freed port $p"
  fi
done

sleep 0.5
echo "  Done."
echo ""

# ── 2. Ensure env file exists ───────────────────────────────────────────────
if [[ ! -f "$ROOT/.env.local" ]]; then
  if [[ -f "$ROOT/.env.example" ]]; then
    cp "$ROOT/.env.example" "$ROOT/.env.local"
    echo "→ Created .env.local from .env.example"
    echo ""
  fi
fi

# ── 3. Clear stale build cache (prevents refresh / 500 errors) ─────────────
echo "→ Clearing .next cache..."
rm -rf "$ROOT/.next"
echo "  Done."
echo ""

# ── 4. Install dependencies if needed ───────────────────────────────────────
if [[ ! -d "$ROOT/node_modules" ]]; then
  echo "→ Installing dependencies..."
  npm install
  echo ""
fi

# ── 5. Start dev server with live reload ────────────────────────────────────
echo "→ Starting dev server on http://localhost:${PORT}"
echo ""
echo "  Live reload is ON — save any file to see changes instantly."
echo "  Press Ctrl+C to stop."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://localhost:${PORT}}"
export NEXTAUTH_URL="${NEXTAUTH_URL:-$NEXT_PUBLIC_SITE_URL}"
exec npx next dev --port "$PORT"
