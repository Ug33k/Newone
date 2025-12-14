# Quick Start Guide

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (install with `npm install -g pnpm`)
- Docker Desktop

## 5-Minute Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

### 3. Start Database

```bash
pnpm docker:up
```

### 4. Run Migrations

```bash
pnpm migration:run
```

### 5. Seed Data (Optional)

```bash
pnpm seed
```

### 6. Start Development

```bash
pnpm dev
```

**Done!** Visit:

- 🌐 Web App: http://localhost:3000
- 🔧 API: http://localhost:3001

## Common Commands

### Development

```bash
pnpm dev           # Start all apps
pnpm dev:web       # Start web only
pnpm dev:api       # Start API only
```

### Building

```bash
pnpm build         # Build all apps
pnpm build:web     # Build web only
pnpm build:api     # Build API only
```

### Code Quality

```bash
pnpm lint          # Check linting
pnpm lint:fix      # Fix linting issues
pnpm format        # Format code
pnpm format:check  # Check formatting
```

### Database

```bash
pnpm migration:run      # Apply migrations
pnpm migration:revert   # Revert last migration
pnpm seed               # Seed database
```

### Docker

```bash
pnpm docker:up     # Start services
pnpm docker:down   # Stop services
pnpm docker:logs   # View logs
```

## Troubleshooting

### Port Already in Use

Change ports in `.env`:

```env
PORT=3001          # API port
# Web app uses 3000 by default
DB_PORT=5432       # Database port
```

### Database Connection Failed

```bash
pnpm docker:down
pnpm docker:up
pnpm migration:run
```

### Build Errors

```bash
rm -rf node_modules apps/*/node_modules
pnpm install
pnpm build
```

## Project Structure

```
project/
├── apps/
│   ├── web/      # Next.js frontend
│   └── api/      # NestJS backend
├── packages/     # Shared configs
├── .env          # Environment variables
└── docker-compose.yml
```

## Environment Variables

### Required

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=taskboard

# API
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Web
NEXT_PUBLIC_API_URL=http://localhost:3001
```

See `.env.example` for all options.

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [SETUP.md](SETUP.md) for detailed setup
- See [ARCHITECTURE.md](ARCHITECTURE.md) for architecture details
- Review [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) if migrating

## Getting Help

- Setup issues: See [SETUP.md](SETUP.md)
- Architecture questions: See [ARCHITECTURE.md](ARCHITECTURE.md)
- Migration: See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
