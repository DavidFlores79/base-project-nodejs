---
description: Explore project and create comprehensive implementation plan
---

# Explore and Plan Workflow

This workflow helps you research the codebase and create a detailed implementation plan before starting development.

## Workflow Phases

### 1. Create Session File
- Create `.claude/sessions/context_session_{feature_name}.md` where the plan will be updated with all future iterations and feedback

### 2. Explore
Explore the relevant files in the repository to understand:
- Current project structure and technology stack
- Existing architectural patterns
- Dependencies and configurations
- Related existing features

### 3. Team Selection
Select which agents are going to be involved based on the technology stack:
- **Backend**: Use `nodejs-backend-architect` persona for Node.js/Express backend development
- **Frontend**: Use `angular-frontend-developer` persona for Angular/TypeScript frontend development
- **QA**: Use `qa-criteria-validator` persona for acceptance criteria and testing
- **UI/UX**: Use `ui-ux-analyzer` persona for design feedback

**Note**: Don't invoke them yet, only identify who you'll consult and for what specific aspects

### 4. Plan
Write up a detailed implementation plan considering:
- Feature requirements and acceptance criteria
- Database schema changes (if needed)
- API endpoint design
- UI/UX components and user flows
- Testing strategy (unit, integration, e2e)
- Documentation requirements
- Performance considerations

**PAUSE HERE** if there are things you don't understand or questions for the user

### 5. Branch Strategy
Plan the development workflow:
- **Branch Name**: Use conventional naming `feat/{feature-name-kebab-case}`
- **Base Branch**: Branch from `develop` (create if doesn't exist)
- **Target Branch**: All PRs target `develop` branch
- **Review Requirements**: 1 reviewer required before merging

### 6. Advice
Consult the selected agent personas (conceptually) to get knowledge and advice:
- Backend architect for API design, database schema, business logic
- Frontend developer for UI components, state management, user experience
- Use web research for unknown patterns or best practices

### 7. Update
Update the context_session file with the final plan including:
- Complete implementation roadmap
- Branch strategy and naming
- Technology-specific architectural decisions
- File structure and component organization

### 8. Clarification
Ask questions about anything unclear, giving possible solutions in A) B) C) format:
- User scenarios and edge cases
- Integration requirements with existing systems
- Performance and scalability needs
- Technology stack preferences (if not clear from repo)
- Dependencies and third-party integrations

**IMPORTANT**: Wait for answers before continuing

### 9. Iterate
Evaluate the plan and iterate until you have the final plan with the complete solution

## Rules
- The target of this workflow is to create a comprehensive plan - DO NOT implement it
- Always use conventional branch naming: `feat/{feature-name}`
- Target branch is always `develop`
- Consider the specific technology stack when selecting agents
- Plan must include proper testing and documentation strategies
