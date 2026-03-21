#!/bin/bash
# Update documentation screenshots from gomode.
#
# Usage: ./scripts/update-screenshots.sh [--android]
#
# Options:
#   --android   Also generate Android screenshots (requires emulator + APK, see
#               gomode/scripts/gen-android-screenshots.sh for prerequisites)
#
# This script:
#   1. Clones gomode into a sibling directory (../gomode) if not already present
#   2. Runs Playwright screenshot generation in gomode
#   3. Optionally runs Android screenshot generation in gomode
#   4. Copies all AVIF screenshots into docs/public/screenshots/

set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCS_DIR="$(dirname "$SCRIPT_DIR")"
CAIC_DIR="$(dirname "$DOCS_DIR")/gomode"
SRC="$CAIC_DIR/e2e/screenshots"
DST="$DOCS_DIR/public/screenshots"

ANDROID=false
for arg in "$@"; do
	case "$arg" in
	--android) ANDROID=true ;;
	esac
done

# Clone gomode if not present.
if [ ! -d "$CAIC_DIR" ]; then
	echo "Cloning gomode into $CAIC_DIR..."
	git clone https://github.com/gomodedev/gomode.git "$CAIC_DIR"
fi

# Install dependencies.
echo "Installing gomode dependencies..."
cd "$CAIC_DIR"
pnpm install --frozen-lockfile
pnpm exec playwright install chromium

# Generate web UI screenshots.
echo "Generating web UI screenshots..."
pnpm exec playwright test --config e2e/playwright.config.ts gen-screenshots

# Generate Android screenshots.
if [ "$ANDROID" = true ]; then
	echo "Generating Android screenshots..."
	"$CAIC_DIR/scripts/gen-android-screenshots.sh"
fi

# Copy AVIF screenshots to docs.
if [ ! -d "$SRC" ] || [ -z "$(ls -A "$SRC"/*.avif 2>/dev/null)" ]; then
	echo "No AVIF screenshots found in $SRC" >&2
	exit 1
fi

mkdir -p "$DST"
cp "$SRC"/*.avif "$DST"/
echo "Copied $(ls "$SRC"/*.avif | wc -l) screenshots to $DST"
