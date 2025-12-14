# Migration Guide

This document explains the changes made to restructure the project into a fullstack monorepo.

## What Changed

### Repository Structure

**Before:**

```
project/
├── app/
├── components/
├── lib/
├── public/
├── src/
├── package.json
├── tsconfig.json
└── ...
```

**After:**

```
project/
├── apps/
│   ├── web/          # Frontend (Next.js) - moved from root
│   └── api/          # Backend (NestJS) - NEW
├── packages/
│   ├── eslint-config/
│   └── typescript-config/
├── docker-compose.yml
├── pnpm-workspace.yaml
└── ...
```

### Key Changes

1. **Monorepo Setup**
   - Converted to pnpm workspace
   - Root package.json now manages workspace
   - Individual apps have their own package.json files

2. **Frontend (apps/web)**
   - All existing Next.js code moved to `apps/web`
   - No functional changes to the application
   - Still uses Zustand, Tailwind, @dnd-kit, etc.
   - Package name changed to `@project/web`

3. **Backend (apps/api) - NEW**
   - Brand new NestJS backend
   - TypeORM with PostgreSQL
   - Full database schema with 9 entities
   - Migrations and seed scripts
   - Configuration module for environment variables

4. **Shared Packages**
   - `packages/typescript-config`: Shared TypeScript configurations
   - `packages/eslint-config`: Shared ESLint rules

5. **Infrastructure**
   - Docker Compose for local development
   - PostgreSQL database service
   - Separate Dockerfiles for web and API
   - GitHub Actions CI/CD pipeline

## Breaking Changes

### Command Changes

| Old Command     | New Command          | Description                   |
| --------------- | -------------------- | ----------------------------- |
| `npm install`   | `pnpm install`       | Changed package manager       |
| `npm run dev`   | `pnpm dev`           | Start all apps                |
| -               | `pnpm dev:web`       | Start only web app            |
| -               | `pnpm dev:api`       | Start only API                |
| `npm run build` | `pnpm build`         | Build all apps                |
| -               | `pnpm build:web`     | Build only web app            |
| -               | `pnpm build:api`     | Build only API                |
| `npm run lint`  | `pnpm lint`          | Lint all apps                 |
| -               | `pnpm migration:run` | Run database migrations (NEW) |
| -               | `pnpm seed`          | Seed database (NEW)           |
| -               | `pnpm docker:up`     | Start Docker services (NEW)   |

### File Path Changes

| Old Path         | New Path                  | Description       |
| ---------------- | ------------------------- | ----------------- |
| `/app`           | `/apps/web/app`           | Next.js App Route |
| `/components`    | `/apps/web/components`    | React components  |
| `/lib`           | `/apps/web/lib`           | Utilities         |
| `/public`        | `/apps/web/public`        | Static assets     |
| `/src`           | `/apps/web/src`           | Source code       |
| `/package.json`  | `/apps/web/package.json`  | Web dependencies  |
| `/tsconfig.json` | `/apps/web/tsconfig.json` | Web TypeScript    |

### Import Path Changes

No import path changes are needed! All internal imports in the web app remain the same since the relative paths haven't changed.

### Environment Variables

New environment variables are required for the backend:

```env
# Required for API
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=taskboard
PORT=3001

# Optional for Supabase integration
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_JWT_SECRET=
```

See `.env.example` for a complete list.

## Migration Steps

### For Developers

1. **Install pnpm** (if not already installed):

   ```bash
   npm install -g pnpm@8
   ```

2. **Remove old dependencies**:

   ```bash
   rm -rf node_modules package-lock.json
   ```

3. **Install new dependencies**:

   ```bash
   pnpm install
   ```

4. **Start database** (for full-stack development):

   ```bash
   pnpm docker:up
   ```

5. **Run migrations**:

   ```bash
   pnpm migration:run
   ```

6. **Seed database** (optional):

   ```bash
   pnpm seed
   ```

7. **Start development**:
   ```bash
   pnpm dev
   ```

### For CI/CD

1. **Update build pipeline** to use pnpm:

   ```yaml
   - name: Setup pnpm
     uses: pnpm/action-setup@v2
     with:
       version: 8

   - name: Install dependencies
     run: pnpm install --frozen-lockfile

   - name: Build
     run: pnpm build
   ```

2. **Add database service** for migration tests:

   ```yaml
   services:
     postgres:
       image: postgres:15-alpine
       env:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
         POSTGRES_DB: taskboard_test
   ```

3. **Run migrations** in CI:
   ```bash
   pnpm migration:run
   ```

### For Deployment

1. **Update deployment scripts** to:
   - Use pnpm instead of npm
   - Build both web and API: `pnpm build`
   - Set up PostgreSQL database
   - Run migrations: `pnpm migration:run`
   - Start services separately:
     - API: `pnpm start:api`
     - Web: `pnpm start:web`

2. **Use Docker Compose** for easier deployment:
   ```bash
   docker-compose up --build
   ```

## Compatibility

### Node.js Version

- **Minimum**: Node.js 18.0.0
- **Recommended**: Node.js 20.x
- **Tested on**: 18.x and 20.x

### Package Manager

- **Required**: pnpm >= 8.0.0
- npm and yarn are **not supported** in this workspace

### Database

- **Required**: PostgreSQL 15+ (or use Docker)
- Other databases are not supported with current TypeORM configuration

## What Stayed the Same

### Frontend Application

- All existing features work exactly as before
- UI/UX is unchanged
- Component structure is preserved
- State management (Zustand) works the same
- Tailwind CSS configuration is unchanged
- All existing dependencies are maintained

### Development Experience

- Hot reload still works
- ESLint and Prettier still work
- TypeScript checking still works
- Build process produces the same output

## New Features

### Backend API (Future)

The new NestJS backend provides a foundation for:

- RESTful API endpoints
- WebSocket support for real-time updates
- Database persistence
- User authentication
- Multi-user collaboration
- Advanced analytics and reporting

### Database Schema

The new database includes:

- User management with roles and permissions
- Board and column management
- Card tracking with history
- Swimlanes and class of service
- Custom metrics

### Development Tools

- Docker Compose for easy local development
- Database migration system
- Seed scripts for test data
- Shared configurations across apps

## Troubleshooting

### "pnpm: command not found"

Install pnpm globally:

```bash
npm install -g pnpm@8
```

### "Cannot find module" errors

Reinstall dependencies:

```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Port conflicts

The application now uses multiple ports:

- 3000: Web app
- 3001: API
- 5432: PostgreSQL

Make sure these ports are available or change them in `.env`.

### Database connection errors

1. Ensure Docker is running
2. Start the database: `pnpm docker:up`
3. Check logs: `pnpm docker:logs`
4. Verify connection settings in `.env`

### Build errors

Clean and rebuild:

```bash
rm -rf apps/web/.next apps/api/dist .turbo
pnpm build
```

## Getting Help

- **Setup issues**: See SETUP.md
- **Architecture questions**: See ARCHITECTURE.md
- **General documentation**: See README.md
- **Change history**: See CHANGELOG.md

## Rollback

If you need to revert to the old structure:

1. Checkout the previous commit before this migration
2. Run `npm install`
3. Continue using npm commands

Note: The database and backend features will not be available in the old structure.
