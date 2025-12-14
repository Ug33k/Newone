# Task Board - Fullstack Monorepo

A modern, fullstack task management application built with Next.js, NestJS, and PostgreSQL in a pnpm workspace monorepo.

## 🏗️ Architecture

This project is structured as a monorepo with:

- **apps/web**: Next.js 14+ frontend with TypeScript, Tailwind CSS, and Zustand
- **apps/api**: NestJS backend with TypeORM, PostgreSQL, and WebSocket support
- **packages/typescript-config**: Shared TypeScript configurations
- **packages/eslint-config**: Shared ESLint configurations

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose (for local development)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd project
```

2. Install dependencies:

```bash
pnpm install
```

3. Copy the environment file and configure it:

```bash
cp .env.example .env
```

4. Start the database:

```bash
pnpm docker:up
```

5. Run database migrations:

```bash
pnpm migration:run
```

6. Seed the database (optional):

```bash
pnpm seed
```

### Development

Start both applications in development mode:

```bash
pnpm dev
```

Or start them individually:

```bash
# Start only the web app
pnpm dev:web

# Start only the API
pnpm dev:api
```

The applications will be available at:

- Web App: http://localhost:3000
- API: http://localhost:3001

## 📦 Database Schema

The application includes the following entities:

- **User**: Application users with roles and permissions
- **Permission**: Role-based access control
- **Board**: Main kanban board container
- **Column**: Board columns (To Do, In Progress, Done, etc.)
- **Swimlane**: Horizontal lanes for organizing cards
- **ClassService**: Card categories (Bug, Feature, etc.)
- **Card**: Individual tasks/items
- **ColumnHistory**: Audit trail for card movements
- **Metric**: Custom metrics for cards

## 🛠️ Available Scripts

### Root Level

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all apps
- `pnpm format` - Format all files with Prettier
- `pnpm migration:generate` - Generate a new migration
- `pnpm migration:run` - Run pending migrations
- `pnpm migration:revert` - Revert last migration
- `pnpm seed` - Seed the database with sample data
- `pnpm docker:up` - Start Docker services
- `pnpm docker:down` - Stop Docker services
- `pnpm docker:logs` - View Docker logs

### Web App (apps/web)

- `pnpm dev:web` - Start in development mode
- `pnpm build:web` - Build for production
- `pnpm start:web` - Start production server

### API (apps/api)

- `pnpm dev:api` - Start in development mode
- `pnpm build:api` - Build for production
- `pnpm start:api` - Start production server

## 🔧 Environment Variables

### Required Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=taskboard

# API
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Web App
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Optional Variables

```env
# Supabase (if using)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret

# WebSocket
SOCKET_HOST=localhost
SOCKET_PORT=3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

See `.env.example` for a complete list.

## 🐳 Docker

### Development with Docker

Start all services including the database:

```bash
docker-compose up -d
```

View logs:

```bash
docker-compose logs -f
```

Stop all services:

```bash
docker-compose down
```

### Production Build

Build and run in production mode:

```bash
docker-compose -f docker-compose.yml up --build
```

## 📊 Database Migrations

### Creating a New Migration

After modifying entities, generate a migration:

```bash
pnpm migration:generate -- src/database/migrations/MigrationName
```

### Running Migrations

Apply pending migrations:

```bash
pnpm migration:run
```

### Reverting Migrations

Revert the last migration:

```bash
pnpm migration:revert
```

## 🧪 Testing

The project uses GitHub Actions for CI/CD, which includes:

- Linting and formatting checks
- TypeScript compilation
- Building both applications
- Running database migrations in a test environment

## 🔐 Authentication

The backend is configured to work with Supabase for authentication, with support for:

- JWT token validation
- Role-based access control
- Permission management

## 🌐 API Endpoints

The API will expose RESTful endpoints for:

- User management
- Board operations (CRUD)
- Card management
- Column operations
- Swimlane management
- Class of service operations
- Metrics tracking

## 🎨 Frontend Features

- **Kanban Board View**: Drag-and-drop task management
- **Eisenhower Matrix**: Priority-based task organization
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Full dark mode support
- **Real-time Updates**: WebSocket support for live collaboration
- **Filters & Search**: Advanced filtering and search capabilities

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Run linting and formatting: `pnpm lint:fix && pnpm format`
4. Commit your changes: `git commit -m 'feat: add some feature'`
5. Push to the branch: `git push origin feat/your-feature`
6. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NestJS team for the powerful backend framework
- TypeORM for the excellent ORM
- All open-source contributors
