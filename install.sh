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

# Check for Superpowers plugin
SUPERPOWERS_INSTALLED=false
if [ -d "$HOME/.claude/plugins/cache/claude-plugins-official/superpowers" ]; then
  SUPERPOWERS_INSTALLED=true
fi

if [ "$SUPERPOWERS_INSTALLED" = false ]; then
  echo "Superpowers plugin not found."
  echo ""
  echo "Feature Deep Dev depends on Superpowers for:"
  echo "  - brainstorming (Phase 1 conversational style)"
  echo "  - writing-plans (Phase 2 plan generation)"
  echo "  - subagent-driven-development (Phase 2 task execution)"
  echo "  - using-git-worktrees (isolated workspaces)"
  echo "  - finishing-a-development-branch (merge/PR workflow)"
  echo ""
  echo "Install Superpowers first — open Claude Code and run:"
  echo '  /install-plugin https://github.com/anthropics/claude-code-superpowers'
  echo ""
  read -p "Continue installing Feature Deep Dev anyway? (y/N) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted. Install Superpowers first, then re-run this script."
    exit 1
  fi
fi

# Create a temporary directory for cloning
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

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
if [ "$SUPERPOWERS_INSTALLED" = true ]; then
  echo "Usage: Open Claude Code in your project and run /feature-deep-dev"
else
  echo "Next steps:"
  echo "  1. Open Claude Code and run: /install-plugin https://github.com/anthropics/claude-code-superpowers"
  echo "  2. Then run: /feature-deep-dev"
fi
