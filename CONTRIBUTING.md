# Contributing Guidelines

## Branch Strategy

- `main` - Production-ready code
- `backend/*` - Backend feature branches
- `frontend/*` - Frontend feature branches

## Workflow

1. **Always pull before starting work**
   ```bash
   git pull origin main
   ```

2. **Create a feature branch**
   ```bash
   # For backend work
   git checkout -b backend/your-feature-name
   
   # For frontend work
   git checkout -b frontend/your-feature-name
   ```

3. **Make your changes**
   - Backend developers work in `backend/` directory only
   - Frontend developers work in `frontend/` directory only

4. **Test your changes**
   - Run tests before committing
   - Ensure your code doesn't break existing functionality

5. **Commit with clear messages**
   ```bash
   git add .
   git commit -m "feat(backend): add new endpoint for course registration"
   ```

6. **Push your branch**
   ```bash
   git push origin your-branch-name
   ```

7. **Create a Pull Request**
   - Go to GitHub
   - Create PR from your branch to `main`
   - Add description of changes
   - Request review from team member

8. **Code Review**
   - Wait for review and approval
   - Make requested changes if needed
   - Once approved, merge to main

## Avoiding Conflicts

### Backend Developer (Pranjal)
- Only modify files in `backend/` directory
- Don't touch `frontend/` directory
- Pull frequently to stay updated

### Frontend Developer (Mohit)
- Only modify files in `frontend/` directory
- Don't touch `backend/` directory
- Pull frequently to stay updated

## Communication

- Discuss major changes before implementing
- Update API documentation when changing endpoints
- Notify team member if you need to modify shared files

## Code Standards

### Backend
- Use TypeScript
- Follow existing code structure
- Add comments for complex logic
- Update API tests

### Frontend
- Use TypeScript
- Follow React best practices
- Use existing UI components
- Maintain responsive design

## Testing

- Write tests for new features
- Ensure all tests pass before pushing
- Update tests when modifying existing features

## Documentation

- Update README when adding new features
- Document API endpoints in backend/README.md
- Add comments for complex code
