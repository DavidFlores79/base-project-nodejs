---
description: Start working on a feature branch with implementation
---

# Start Working on Branch Workflow

This workflow starts actual implementation work on a feature branch.

## Prerequisites
- Branch must exist (created via create-new-gh-branch)
- Session file must exist: `.claude/sessions/context_session_{feature_name}.md`

## Input
Branch name to work on

## Setup Phase

1. **Validate and Checkout Branch**
   ```bash
   git fetch origin
   git checkout $BRANCH_NAME || echo "Branch not found locally, checking remote..."
   git checkout -b $BRANCH_NAME origin/$BRANCH_NAME 2>/dev/null || echo "Using existing local branch"
   ```

2. **Load Session Context**
   - Find and load the related session file: `.claude/sessions/context_session_*.md`
   - Match branch name with session feature name
   - Load implementation plan and selected agent personas

3. **Verify Planning**
   - Confirm technology agents selected (Node.js/Angular)
   - Verify detailed implementation plan exists
   - Review architecture guidelines from session

## Implementation Phase

1. **Adopt Agent Personas**
   - **Node.js Backend**: Channel `nodejs-backend-architect` patterns for API development
   - **Angular Frontend**: Channel `angular-frontend-developer` patterns for UI components
   - Follow the specific patterns and best practices from those personas

2. **Follow Test-Driven Development (TDD)**
   - Write tests first (unit, integration, e2e as appropriate)
   - Run test suite constantly: `npm test`
   - Implement feature code to make tests pass
   - Ensure >80% test coverage requirement

3. **Follow Session Plan**
   - Execute the detailed implementation plan from session file
   - Implement proper architecture layers (Controllers, Services, Models for backend; Components, Services for frontend)
   - Use SOLID principles and framework-specific patterns
   - Reference CLAUDE.md for consistency

4. **Development Process**
   ```bash
   # Commit changes with conventional commit messages
   git commit -m "feat: add user authentication"
   
   # Push branch to remote
   git push origin $BRANCH_NAME
   
   # Create PR targeting develop branch or update existing one
   gh pr create --base develop --head $BRANCH_NAME --title "..." --body "..."
   ```

5. **Report Status of Completeness**
   ```
   <results>
   
   # Summary of requirements implemented:
   - req 1
   - req 2
   - ...
   
   # Requirements pending:
   - req 1
   - req 2
   - ...
   
   # Tests implemented and their run status:
   ok    test-assignment.js       1.604s
   ok    frontend unit tests      31.604s
   
   # Proof that all builds pass:
   ok    backend build       5.604s
   ok    frontend build      90.604s
   
   # Overall status: [Needs More Work/All Completed]
   # PR: github-pr-url
   </result>
   ```

## PR Management Phase

1. Monitor PR status:
   ```bash
   gh pr view $PR_NUMBER --json statusCheckRollup,state,mergeable,url
   ```

2. **Address Issues**
   - Fix any CI/CD failures or merge conflicts immediately
   - Respond to reviewer comments promptly using `update-feedback` workflow
   - Ensure all status checks pass before requesting final review

3. **PR Requirements**
   - PR targets `develop` branch
   - Requires 1 approving review before merge

## Completion Criteria
- ✅ All requirements from the GitHub issue are implemented
- ✅ Unit tests are written and passing (>80% coverage)
- ✅ Integration tests cover main user flows
- ✅ Code follows project architectural patterns and conventions
- ✅ Documentation is updated (README, API docs, component docs)
- ✅ All CI/CD checks pass (build, test, lint, security)
- ✅ PR has been reviewed and approved
- ✅ No merge conflicts with develop branch

## Final Checks

After creating the PR, verify pipeline validations:
```bash
# Check PR status
gh pr view {pr_number} --json statusCheckRollup,state,mergeable,url

# If validations are pending, wait until they complete
# If validations fail, review the issues
# Implement fixes and push again
# Continue in loop until all validations are green
```

Once all is green:
- Update the issue with a comment of what was implemented
- Your work is finished

## Important Notes
- **Conventional Branches**: Always use `feat/feature-name` format
- **Target Branch**: All PRs must target `develop`, never `main`
- **Review Required**: 1 reviewer approval needed before merge
- **Test Coverage**: Minimum 80% coverage required
- **Status**: "All Completed" only when ALL criteria above are met
- Use `update-feedback` workflow when reviewers request changes
- Keep detailed records of all actions as PR/issue comments
