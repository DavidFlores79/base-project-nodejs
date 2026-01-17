---
description: Handle PR review feedback in an iterative loop until merge
---

# Update PR Feedback Workflow

This workflow manages the review feedback loop for pull requests until they are merged.

## Input
PR number to handle

## Step 1: Check PR Status

1. **Get Comprehensive PR Details**
   ```bash
   gh pr view $PR_NUMBER --json reviews,comments,state,statusCheckRollup,mergeable,url,headRefName
   ```

2. **Analyze Current State**
   - **PR Status**: Open, Closed, Merged, Draft
   - **Review Status**: Approved, Changes Requested, Pending
   - **CI/CD Status**: Success, Failure, Pending
   - **Merge Conflicts**: Present or Clean
   - **Comments**: Review comments, suggestions, and requested changes

3. **Determine Action Required**
   - ✅ **Ready to Merge**: All approvals + CI green + no conflicts
   - 🔄 **Needs Fixes**: Review comments or failing CI
   - ⏳ **Waiting**: Pending reviews or CI checks
   - ❌ **Blocked**: Merge conflicts or critical failures

## Step 2: Categorize Feedback

Organize feedback into categories:

### 🔧 Code Changes Required
- Logic fixes or improvements
- Performance optimizations
- Security vulnerabilities
- Code style and formatting
- Architecture or design pattern issues

### 📝 Documentation Updates
- Missing or incomplete documentation
- API documentation updates
- README or setup instruction changes
- Code comments and inline documentation

### 🧪 Testing Requirements
- Missing test cases
- Test coverage improvements
- Integration test additions
- E2E test scenarios
- Mock or fixture updates

### 🏗️ Build/CI Issues
- Build failures
- Linting errors
- Type checking issues
- Dependency conflicts
- Security scan violations

## Step 3: Create Implementation Plan

For each feedback item:
1. **Assess Impact**: Determine scope and complexity
2. **Prioritize**: Order by importance and dependencies
3. **Technology Selection**: Choose appropriate agent persona:
   - **Backend Changes**: Channel `nodejs-backend-architect` patterns
   - **Frontend Changes**: Channel `angular-frontend-developer` patterns
4. **Estimate Effort**: Quick fixes vs. major refactoring

## Step 4: Implement Changes

### Code Implementation
1. **Make Changes**: Implement the requested modifications
   - Follow architectural patterns from CLAUDE.md
   - Maintain SOLID principles
   - Use appropriate design patterns
   - Ensure consistent code style

2. **Add Tests**: Ensure >80% test coverage
   ```bash
   # Run tests to verify changes
   npm test
   ```

3. **Update Documentation**
   - Update inline comments
   - Modify README if needed
   - Update API documentation

### Quality Assurance
1. **Run Full Test Suite**
   ```bash
   npm run test # Check all tests
   npm run lint # Fix linting issues (if available)
   npm run build # Ensure build passes
   ```

2. **Manual Testing**: Test the specific functionality mentioned in feedback

## Step 5: Commit and Push Updates

1. **Commit Changes**: Use descriptive commit messages
   ```bash
   git add .
   git commit -m "fix: address PR feedback - [specific change description]"
   ```

2. **Push Updates**
   ```bash
   git push origin $BRANCH_NAME
   ```

## Step 6: Respond to Reviewers

1. **Comment on Resolved Items**
   - Mark conversations as resolved
   - Explain the changes made
   - Provide context for decisions

2. **Request Re-review**
   ```bash
   gh pr comment $PR_NUMBER --body "✅ All feedback addressed. Ready for re-review:
   
   **Changes Made:**
   - [List specific changes]
   - [Include test coverage updates]
   - [Mention documentation updates]
   
   **Verification:**
   - ✅ All tests passing
   - ✅ Build successful
   - ✅ Linting clean
   - ✅ Manual testing completed
   
   Please re-review when ready. Thanks! 🙏"
   ```

## Step 7: Feedback Resolution Loop

Based on PR status, take appropriate action:

### 🔄 If Changes Requested or CI Failing:
1. Implement fixes as outlined above
2. Run tests: `run-tests coverage`
3. Push updates (automatically updates PR)
4. Re-run `update-feedback <pr-number>` until resolved

### ⏳ If Waiting for Reviews:
- Monitor PR status
- Notify reviewers if needed
- Check back periodically

### ✅ If Ready to Merge:
- Proceed to merge process
- Clean up branch and issue

## Step 8: Iterative Workflow Cycle

**This workflow will loop until PR is merged:**

```bash
# Cycle continues until success
while [PR not merged]; do
    # Check PR status
    update-feedback <pr-number>
    
    # If issues found:
    if [feedback exists]; then
        # Implement fixes
        # Re-test to validate
        # Loop again
        continue
    fi
    
    # If approved and CI green:
    if [approved && ci_green]; then
        # Merge and complete
        break
    fi
done
```

## Step 9: Completion Criteria

Loop continues until ALL criteria met:
- [ ] ✅ **PR Approved**: At least 1 reviewer has approved
- [ ] ✅ **CI/CD Green**: All automated checks passing
- [ ] ✅ **No Conflicts**: Clean merge with develop branch
- [ ] ✅ **Quality Standards**: Meets Definition of Done
- [ ] ✅ **All Feedback Addressed**: No outstanding review comments

## Step 10: Final Merge Process

Once all criteria satisfied:
1. **Merge PR**: `gh pr merge <pr-number> --squash` or via GitHub UI
2. **Delete Branch**: `git branch -d <branch-name>`
3. **Update Issue**: Mark GitHub issue as completed
4. **Clean Session**: Archive session file
5. **Success**: Feature complete and merged to develop! 🎉

## Notes
- **Iterative Process**: This workflow may need to be run multiple times for complex PRs
- **Communication**: Always explain reasoning for implementation decisions
- **Quality Focus**: Better to take time and get it right than rush incomplete fixes
- **Learn and Improve**: Use feedback as learning opportunities for future development
