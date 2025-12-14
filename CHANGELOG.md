# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2024-12-14

### Added

#### Monorepo Structure

- Converted project to pnpm workspace monorepo
- Created `apps/web` for Next.js frontend
- Created `apps/api` for NestJS backend
- Added shared TypeScript configurations in `packages/typescript-config`
- Added shared ESLint configurations in `packages/eslint-config`
- Configured Turborepo for optimized builds

#### Backend (NestJS)

- Implemented NestJS backend with TypeORM
- Created configuration module with environment variable support
- Implemented full relational database schema:
  - User entity with role-based permissions
  - Permission entity for access control
  - Board entity for project boards
  - Column entity for kanban columns
  - Swimlane entity for horizontal organization
  - ClassService entity for card categorization
  - Card entity for tasks/items
  - ColumnHistory entity for audit trail
  - Metric entity for custom card metrics
- Created initial database migration
- Implemented seed script with sample data
- Added TypeORM CLI commands for migrations
- Configured PostgreSQL database connection

#### Infrastructure

- Added docker-compose.yml for local development
- Created Dockerfiles for both web and API
- Configured PostgreSQL service in Docker
- Added health checks for database service

#### CI/CD

- Created GitHub Actions workflow for CI
- Added linting and formatting checks
- Added build verification for both apps
- Implemented database migration testing
- Configured test database in CI environment

#### Documentation

- Comprehensive README with setup instructions
- Environment variable documentation in .env.example
- Docker setup and usage instructions
- Database migration guide
- Development workflow documentation
- API and frontend feature documentation

#### Configuration

- pnpm workspace configuration
- Turborepo pipeline setup
- Shared Prettier configuration
- ESLint configuration for both apps
- TypeScript configurations for Next.js and NestJS
- Environment variable templates

### Changed

- Moved existing Next.js application to `apps/web`
- Updated all import paths for new structure
- Configured Next.js for standalone output
- Updated .gitignore for monorepo structure

### Technical Details

- **Frontend**: Next.js 16.0.9, React 19.2.1, TypeScript 5, Tailwind CSS 4
- **Backend**: NestJS 10.3.0, TypeORM 0.3.17, PostgreSQL
- **Package Manager**: pnpm 8
- **Build Tool**: Turborepo 1.11.2
- **Database**: PostgreSQL 15
- **Node Version**: >= 18.0.0
