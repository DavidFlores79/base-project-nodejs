---
description: Run comprehensive test suite for backend and/or frontend
---

# Run Tests Workflow

This workflow runs tests for the Node.js backend and/or Angular frontend.

## Test Scope Options
- `all` - Run all test types (default)
- `unit` - Run only unit tests
- `integration` - Run only integration tests
- `e2e` - Run only end-to-end tests
- `coverage` - Run tests with detailed coverage report
- `backend` - Run only backend tests
- `frontend` - Run only frontend tests

## Backend Tests (Node.js/Express)

### Available Commands
// turbo
```bash
# Test OpenAI thread optimization
npm run test:threads

# Run specific test files
node test-agent-notification.js
node test-analysis-languages.js
node test-assignment.js
node test-import-export.js
node test-summary-languages.js
```

### Backend Test Structure
```
/
├── test-*.js              # Root-level test scripts
├── src/
│   ├── services/          # Business logic (testable)
│   ├── controllers/       # Route handlers (integration tests)
│   ├── models/            # Mongoose schemas
│   └── middleware/        # Express middleware
```

## Frontend Tests (Angular)

### Available Commands
// turbo
```bash
# Navigate to frontend directory
cd frontend

# Unit Tests (Jasmine/Karma)
npm test
ng test --watch=false --browsers=ChromeHeadless

# Coverage Report
ng test --code-coverage --watch=false --browsers=ChromeHeadless

# Lint
ng lint
```

### Frontend Test Structure
```
frontend/src/
├── app/
│   ├── components/**/*.spec.ts    # Component tests
│   ├── services/**/*.spec.ts      # Service tests
│   └── pipes/**/*.spec.ts         # Pipe tests
```

## Execution Steps

1. **Detect Project Type**
   - Check for Express backend: `package.json` has express
   - Check for Angular frontend: `frontend/angular.json` exists

2. **Run Tests by Scope**
   - `all` or empty: Run both backend and frontend tests
   - `backend`: Run only Node.js tests
   - `frontend`: Run only Angular tests in `frontend/`
   - `unit`: Run quick unit tests only
   - `integration`: Run integration/API tests
   - `e2e`: Run end-to-end tests

3. **Generate Coverage Summary**
   ```
   📊 TEST COVERAGE SUMMARY
   ========================
   
   🎯 Node.js Backend:
   ├── Thread Tests:       ✅ passed
   ├── Assignment Tests:   ✅ passed
   ├── Notification Tests: ✅ passed
   └── Duration:           X.Xs
   
   🎯 Angular Frontend:
   ├── Unit Tests:        XX passed
   ├── Component Tests:   XX passed
   ├── Coverage:          XX% (target: >80%)
   └── Duration:          X.Xs
   
   📈 OVERALL RESULT: ✅ PASS / ❌ FAIL
   ```

## Success Criteria
- [ ] All tests passing
- [ ] Coverage >80% for frontend (when measured)
- [ ] No linting errors
- [ ] Build successful

## Quality Standards
- **Speed**: Unit tests complete quickly
- **Coverage**: Target 80% for frontend
- **Reliability**: Tests must be deterministic
- **Maintainability**: Clear test naming

## Notes
- Frontend tests require `cd frontend` first
- Backend tests are JavaScript files in project root
- Some tests may require MongoDB connection
- Run `npm run dev` before integration tests if they need the server running
