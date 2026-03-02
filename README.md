# Course Registration System

A full-stack course registration system for university students and faculty.

## Project Structure

```
.
├── backend/          # Backend API (Node.js + Express + Prisma + PostgreSQL)
├── frontend/         # Frontend Application (React + TypeScript + Vite)
└── docs/            # Documentation files
```

## Team

- **Backend Development**: Pranjal
- **Frontend Development**: Mohit Sharma

## Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your DATABASE_URL in .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Configure VITE_API_URL in .env
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Development Workflow

### For Backend Changes (Pranjal)

1. Pull latest changes: `git pull origin main`
2. Create a feature branch: `git checkout -b backend/feature-name`
3. Make your changes in the `backend/` directory
4. Test your changes
5. Commit: `git add backend/ && git commit -m "feat(backend): description"`
6. Push: `git push origin backend/feature-name`
7. Create a Pull Request

### For Frontend Changes (Mohit)

1. Pull latest changes: `git pull origin main`
2. Create a feature branch: `git checkout -b frontend/feature-name`
3. Make your changes in the `frontend/` directory
4. Test your changes
5. Commit: `git add frontend/ && git commit -m "feat(frontend): description"`
6. Push: `git push origin frontend/feature-name`
7. Create a Pull Request

## Commit Convention

Use conventional commits:
- `feat(backend):` - New backend feature
- `feat(frontend):` - New frontend feature
- `fix(backend):` - Backend bug fix
- `fix(frontend):` - Frontend bug fix
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks

## API Documentation

Backend API runs on port 5000. See `backend/README.md` for detailed API documentation.

## Database

- PostgreSQL database
- Prisma ORM
- Migrations in `backend/prisma/migrations/`

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

- Backend: Deploy to your preferred Node.js hosting (Railway, Render, etc.)
- Frontend: Deploy to Vercel, Netlify, or similar
- Database: PostgreSQL on Railway, Supabase, or similar

## License

See LICENSE file for details.
