#!/bin/bash
# Feature Deep Dev — Install Script
# Usage: curl -fsSL https://raw.githubusercontent.com/MichaelZuo-AI/Feature_Deep_Dev/main/install.sh | bash
# Or:    ./install.sh /path/to/your/project

set -e

TARGET="${1:-.}"

if [ ! -d "$TARGET" ]; then
  echo "Error: Directory '$TARGET' does not exist."
  exit 1
fi

# Check for Claude Code
if ! command -v claude &> /dev/null; then
  echo "Claude Code not found."
  echo ""
  echo "Install it first:"
  echo "  npm install -g @anthropic-ai/claude-code"
  echo ""
  echo "More info: https://docs.anthropic.com/en/docs/claude-code"
  exit 1
fi

echo "Claude Code found."

# Check for Superpowers plugin
if [ -d "$HOME/.claude/plugins/cache/claude-plugins-official/superpowers" ]; then
  echo "Superpowers plugin found."
else
  echo "Superpowers plugin not found. Installing..."
  echo ""
  claude plugin install superpowers
  echo ""
  echo "Superpowers installed."
fi

# Create a temporary directory for cloning
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

echo ""
echo "Installing Feature Deep Dev skills..."

# Clone the repo
git clone --quiet --depth 1 https://github.com/MichaelZuo-AI/Feature_Deep_Dev.git "$TMPDIR/repo"

# Copy skills to target project
mkdir -p "$TARGET/.claude/skills"
cp -r "$TMPDIR/repo/.claude/skills/feature-deep-dev" "$TARGET/.claude/skills/"
cp -r "$TMPDIR/repo/.claude/skills/feature-deep-dev-clarify" "$TARGET/.claude/skills/"
cp -r "$TMPDIR/repo/.claude/skills/feature-deep-dev-implement" "$TARGET/.claude/skills/"
cp -r "$TMPDIR/repo/.claude/skills/feature-deep-dev-qa" "$TARGET/.claude/skills/"
cp -r "$TMPDIR/repo/.claude/skills/feature-deep-dev-evaluate" "$TARGET/.claude/skills/"

echo ""
echo "Done! Installed to $TARGET/.claude/skills/"
echo ""
echo "Skills installed:"
ls -1 "$TARGET/.claude/skills/" | grep feature-deep-dev
echo ""
echo "Usage: Open Claude Code in your project and run /feature-deep-dev"
