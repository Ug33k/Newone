# Setup Guide

This guide will walk you through setting up the Task Board application for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 (Download from https://nodejs.org/)
- **pnpm** >= 8.0.0 (Install with `npm install -g pnpm`)
- **Docker Desktop** (Download from https://www.docker.com/products/docker-desktop/)
- **Git** (Download from https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the entire monorepo.

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your preferred settings. For local development, the defaults should work fine.

### 4. Start the Database

Start PostgreSQL using Docker Compose:

```bash
pnpm docker:up
```

This will start:

- PostgreSQL on port 5432

Wait for the database to be ready (you should see "database system is ready to accept connections" in the logs).

### 5. Run Database Migrations

Apply the database schema:

```bash
pnpm migration:run
```

### 6. Seed the Database (Optional)

Populate the database with sample data:

```bash
pnpm seed
```

This will create:

- 2 users (admin and regular user)
- 4 permissions
- 1 board with columns, swimlanes, and class services
- 5 sample cards

### 7. Start the Applications

Start both the web app and API in development mode:

```bash
pnpm dev
```

Or start them individually:

```bash
# Terminal 1: Start the API
pnpm dev:api

# Terminal 2: Start the web app
pnpm dev:web
```

The applications will be available at:

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001

## Verification

### Check Database Connection

You can verify the database is running:

```bash
docker ps
```

You should see a container named `taskboard-postgres` running.

### Check API Health

Visit http://localhost:3001 in your browser. You should see a response from the NestJS application.

### Check Web App

Visit http://localhost:3000 in your browser. You should see the Task Board application.

## Troubleshooting

### Port Already in Use

If you get an error about ports already being in use:

**For Database (5432)**:

```bash
# Stop any existing PostgreSQL services
# On macOS:
brew services stop postgresql

# On Linux:
sudo systemctl stop postgresql

# Or change the port in .env and docker-compose.yml
```

**For API (3001)**:

```bash
# Find and kill the process using port 3001
# On macOS/Linux:
lsof -ti:3001 | xargs kill -9

# Or change the port in .env
```

**For Web (3000)**:

```bash
# Find and kill the process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### Database Connection Failed

If the API can't connect to the database:

1. Check that Docker is running: `docker ps`
2. Check the database logs: `pnpm docker:logs`
3. Verify your `.env` file has the correct database credentials
4. Restart the database: `pnpm docker:down && pnpm docker:up`

### Migration Errors

If migrations fail:

1. Ensure the database is running
2. Check that the database exists:
   ```bash
   docker exec -it taskboard-postgres psql -U postgres -c "\\l"
   ```
3. If needed, recreate the database:
   ```bash
   pnpm docker:down -v  # This will delete all data!
   pnpm docker:up
   pnpm migration:run
   ```

### Node Modules Issues

If you encounter issues with dependencies:

```bash
# Remove all node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Build Errors

If you encounter build errors:

```bash
# Clean all build artifacts
rm -rf apps/web/.next apps/api/dist .turbo

# Rebuild
pnpm build
```

## Development Workflow

### Making Database Changes

1. Modify the entity files in `apps/api/src/entities/`
2. Generate a new migration:
   ```bash
   pnpm migration:generate -- src/database/migrations/YourMigrationName
   ```
3. Review the generated migration in `apps/api/src/database/migrations/`
4. Apply the migration:
   ```bash
   pnpm migration:run
   ```

### Code Style

Before committing:

```bash
# Check code style
pnpm lint
pnpm format:check

# Auto-fix issues
pnpm lint:fix
pnpm format
```

### Running Individual Commands

```bash
# Build specific app
pnpm build:web
pnpm build:api

# Start specific app
pnpm dev:web
pnpm dev:api

# Lint specific app
pnpm --filter @project/web lint
pnpm --filter @project/api lint
```

## Docker Development

### Full Stack with Docker

To run everything in Docker:

```bash
docker-compose up --build
```

This will start:

- PostgreSQL
- API (NestJS)
- Web (Next.js)

### View Logs

```bash
# All services
pnpm docker:logs

# Specific service
docker-compose logs -f postgres
docker-compose logs -f api
docker-compose logs -f web
```

### Stop All Services

```bash
pnpm docker:down
```

### Clean Everything (Including Data)

```bash
docker-compose down -v
```

## Production Build

### Build for Production

```bash
pnpm build
```

### Run in Production Mode

```bash
# Start API
pnpm start:api

# Start Web
pnpm start:web
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [pnpm Documentation](https://pnpm.io/)
- [Turborepo Documentation](https://turbo.build/repo/docs)

## Getting Help

If you encounter issues not covered in this guide:

1. Check the main README.md for additional information
2. Review the GitHub Actions CI workflow for examples
3. Check the Docker logs for error messages
4. Verify all prerequisites are correctly installed
