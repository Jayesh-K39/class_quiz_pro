#!/bin/bash
set -e  # stop immediately if any command fails

# --- Safety check: block any .env-like file at any depth ---
ENV_FILES=$(git diff --cached --name-only | grep -E '(^|/)\.env' || true)

if [ -n "$ENV_FILES" ]; then
    echo "❌ Blocked: attempting to commit .env file(s):"
    echo "$ENV_FILES"
    echo "Remove them from staging with: git restore --staged <file>"
    exit 1
fi

git add -A

# Re-check AFTER staging too, in case add -A staged something new
ENV_FILES=$(git diff --cached --name-only | grep -E '(^|/)\.env(\..*)?$' || true)
if [ -n "$ENV_FILES" ]; then
    echo "❌ Blocked: .env file(s) staged after add -A:"
    echo "$ENV_FILES"
    exit 1
fi

git commit -m "${1:-Worked on the project on $(date)}"
git push origin main
