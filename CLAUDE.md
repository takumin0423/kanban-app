# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Kanban board application built with:
- Next.js 15.3.3 (App Router)
- React 19 with TypeScript
- PostgreSQL with Prisma ORM
- Tailwind CSS v4 with shadcn/ui components
- @dnd-kit/sortable for drag-and-drop functionality

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Database commands
docker-compose up -d  # Start PostgreSQL container
npx prisma generate   # Generate Prisma client
npx prisma migrate dev # Run migrations
npx prisma studio     # Open Prisma Studio GUI
```

## Architecture

### Data Model
The application uses Prisma with PostgreSQL for data persistence:
- **Board**: Container for columns (title, description)
- **Column**: Container for tasks with position and color (belongs to Board)
- **Task**: Individual items with priority, due date, and completion status (belongs to Column)

Relationships use cascade delete for data integrity. Position fields enable drag-and-drop ordering.

### Project Structure
- `/app`: Next.js App Router pages and layouts
- `/components`: Reusable UI components (to be created)
- `/lib`: Utilities and shared functions
- `/prisma`: Database schema and migrations
- `@/` path alias points to the root directory

### Key Technologies
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Icons**: lucide-react
- **State**: React hooks (no external state management)
- **Drag & Drop**: @dnd-kit/sortable library
- **Type Safety**: TypeScript with strict mode

## Development Guidelines

### Component Development
- Use shadcn/ui components when possible (already configured)
- Utilize the `cn()` utility from `@/lib/utils` for className merging
- Follow the existing TypeScript strict mode requirements

### Database Operations
- Use Prisma Client for all database operations
- Implement server actions or API routes for data mutations
- Position fields must be managed carefully for drag-and-drop functionality

### Environment Setup
Required environment variables:
```
DATABASE_URL=postgresql://user:password@localhost:5432/kanban-app
```

The Docker Compose setup provides a local PostgreSQL instance with these credentials.