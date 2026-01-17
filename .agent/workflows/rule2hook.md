---
description: Convert project rules from CLAUDE.md into code hooks
---

# Convert Rules to Hooks Workflow

This workflow helps convert natural language project rules into automated code hooks.

## Overview
Convert project rules from CLAUDE.md files into hook configurations that automatically enforce those rules.

## Steps

1. **Identify Rules Source**
   - If rules are provided as arguments, analyze those
   - Otherwise, read from:
     - `./CLAUDE.md` (project memory)
     - `./CLAUDE.local.md` (local project memory)
     - `~/.claude/CLAUDE.md` (user memory)

2. **Analyze Each Rule**
   - Determine the appropriate hook event:
     - **PreToolUse**: Before tool execution (validate, check, prevent)
     - **PostToolUse**: After tool completes (format, lint, build)
     - **Stop**: When task finishes (cleanup, summary)
     - **Notification**: When notifications sent (rarely used)
   - Identify tool matcher pattern (exact tool names or regex)
   - Define the command to execute

3. **Generate Hook Configuration**
   - Follow exact JSON structure:
   ```json
   {
     "hooks": {
       "EventName": [{
         "matcher": "ToolName|AnotherTool",
         "hooks": [{
           "type": "command",
           "command": "your-command-here"
         }]
       }]
     }
   }
   ```

4. **Save Configuration**
   - Merge with existing hooks if present
   - Save to appropriate settings file:
     - `~/.claude/settings.json` (User settings)
     - `.claude/settings.json` (Project settings)
     - `~/.claude/settings.local.json` (Local project settings)

5. **Provide Summary**
   - Explain what was configured
   - List all hooks created

## Hook Events Reference

- **PreToolUse**: Runs BEFORE a tool executes (can block execution)
- **PostToolUse**: Runs AFTER a tool completes successfully
- **Stop**: Runs when agent finishes responding
- **Notification**: Runs when agent sends notifications

## Best Practices
- Add error handling: `|| true` or `2>/dev/null`
- Use quiet flags where possible
- Keep commands fast
- Always merge with existing hooks - don't overwrite
