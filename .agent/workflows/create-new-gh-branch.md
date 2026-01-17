---
description: Create a new GitHub feature branch following conventions
---

# Create New GitHub Branch Workflow

This workflow creates a properly named feature branch for new development.

## Prerequisites
- Ensure you have a planning session file at `.claude/sessions/context_session_{feature_name}.md` (created by explore-plan workflow)
- Understand the feature requirements

## Steps

1. **Determine Branch Name**
   - **Priority 1**: Use user-provided branch name if specified
   - **Priority 2**: Generate by convention:
     - `feat/` - New features or enhancements
     - `fix/` - Bug fixes
     - `docs/` - Documentation changes
     - `refactor/` - Code refactoring
     - `test/` - Test additions or updates
     - `chore/` - Build process or auxiliary tool changes
   - Convert description to kebab-case: lowercase, hyphens, no special characters
   - Example: "User authentication with JWT" → `feat/user-authentication-with-jwt`

2. **Ensure Clean State**
   ```bash
   git fetch origin
   git checkout develop 2>/dev/null || git checkout -b develop
   git pull origin develop 2>/dev/null || echo "No remote develop branch, continuing with local"
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b $BRANCH_NAME develop
   echo "✅ Created branch: $BRANCH_NAME"
   ```

4. **Save Branch Info**
   - Update session file with branch name for next workflow step

5. **Next Steps**
   - Run `start-working-on-branch-new <branch-name>` to begin implementation
   - Note: David will manually create GitHub issues and PRs as needed

## Quality Checklist
- ✅ Branch name determined (user's preference or by convention)
- ✅ Branch created from develop
- ✅ Branch name follows convention (feat/fix/docs/refactor/test/chore)
- ✅ Session file updated with branch information
- ✅ Implementation plan available in session file
