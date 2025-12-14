# Architecture Documentation

## Project Structure

```
project/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utility libraries
│   │   ├── public/            # Static assets
│   │   ├── src/               # Source code
│   │   │   ├── store/        # Zustand state management
│   │   │   ├── types/        # TypeScript type definitions
│   │   │   └── utils/        # Utility functions
│   │   ├── Dockerfile         # Docker configuration for web app
│   │   ├── next.config.ts     # Next.js configuration
│   │   ├── package.json       # Web app dependencies
│   │   └── tsconfig.json      # TypeScript config
│   │
│   └── api/                   # NestJS backend application
│       ├── src/
│       │   ├── config/        # Application configuration
│       │   │   ├── configuration.ts    # Env config loader
│       │   │   └── typeorm.config.ts   # Database config
│       │   ├── database/
│       │   │   ├── migrations/         # Database migrations
│       │   │   └── seed.ts            # Database seeding script
│       │   ├── entities/      # TypeORM entities
│       │   │   ├── board.entity.ts
│       │   │   ├── card.entity.ts
│       │   │   ├── class-service.entity.ts
│       │   │   ├── column.entity.ts
│       │   │   ├── column-history.entity.ts
│       │   │   ├── metric.entity.ts
│       │   │   ├── permission.entity.ts
│       │   │   ├── swimlane.entity.ts
│       │   │   ├── user.entity.ts
│       │   │   └── index.ts
│       │   ├── modules/       # Feature modules (future)
│       │   ├── app.module.ts  # Root application module
│       │   └── main.ts        # Application entry point
│       ├── Dockerfile         # Docker configuration for API
│       ├── nest-cli.json      # NestJS CLI configuration
│       ├── package.json       # API dependencies
│       └── tsconfig.json      # TypeScript config
│
├── packages/                  # Shared packages
│   ├── eslint-config/        # Shared ESLint configurations
│   │   ├── base.js
│   │   └── package.json
│   └── typescript-config/    # Shared TypeScript configurations
│       ├── base.json
│       ├── nextjs.json
│       ├── nestjs.json
│       └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI/CD pipeline
│
├── docker-compose.yml         # Docker Compose configuration
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── turbo.json                 # Turborepo configuration
├── package.json               # Root package.json
├── .env.example               # Environment variables template
├── .prettierrc                # Prettier configuration
├── .prettierignore            # Prettier ignore patterns
├── .gitignore                 # Git ignore patterns
├── README.md                  # Project documentation
├── SETUP.md                   # Setup instructions
├── CHANGELOG.md               # Change history
└── ARCHITECTURE.md            # This file
```

## Technology Stack

### Frontend (apps/web)

- **Framework**: Next.js 16.0.9 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19.2.1
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5.0.9
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **Date Handling**: date-fns 4.1.0
- **Icons**: lucide-react 0.560.0

### Backend (apps/api)

- **Framework**: NestJS 10.3.0
- **Language**: TypeScript 5
- **ORM**: TypeORM 0.3.17
- **Database**: PostgreSQL 15
- **Validation**: class-validator, class-transformer
- **WebSocket**: @nestjs/websockets, @nestjs/platform-socket.io
- **Configuration**: @nestjs/config with dotenv

### DevOps & Tooling

- **Package Manager**: pnpm 8
- **Monorepo Tool**: Turborepo 1.11.2
- **Containerization**: Docker & Docker Compose
- **Linting**: ESLint 9 (web), ESLint 8 (api)
- **Formatting**: Prettier 3.7.4
- **CI/CD**: GitHub Actions

## Database Schema

### Entity Relationship Diagram

```
User (1) ──────< (N) Board (1) ──────< (N) Column
  │                                           │
  │                                           │
  │                                           └── (1) ──────< (N) Card
  │                                                               │
  │                                                               ├── (N) ───> (1) Swimlane
  │                                                               ├── (N) ───> (1) ClassService
  │                                                               ├── (1) ───< (N) Metric
  │                                                               └── (1) ───< (N) ColumnHistory
  │
  └── (N) ──────< (N) Permission
```

### Entities

#### User

- Primary entity for application users
- Supports role-based access control (admin, user, guest)
- Many-to-many relationship with Permissions
- One-to-many relationship with Boards

#### Permission

- Defines access control permissions
- Examples: create_board, edit_board, delete_board, manage_users
- Many-to-many relationship with Users

#### Board

- Main container for kanban organization
- Belongs to a User
- Contains Columns, Swimlanes, and ClassServices

#### Column

- Represents a stage in the workflow (e.g., To Do, In Progress, Done)
- Ordered within a Board
- Contains Cards

#### Swimlane

- Horizontal organizational unit within a Board
- Used for categorizing cards (e.g., Frontend, Backend, DevOps)
- Ordered within a Board

#### ClassService

- Category/type for cards (e.g., Bug, Feature, Improvement)
- Can have a color for visual distinction
- Associated with a Board

#### Card

- Individual task/item in the kanban board
- Belongs to a Column
- Optionally belongs to a Swimlane and ClassService
- Has position for ordering within a column
- Tracks creation and update timestamps

#### ColumnHistory

- Audit trail for card movements
- Records: card, from column, to column, moved by user, timestamp
- Used for analytics and compliance

#### Metric

- Custom metrics associated with cards
- Stores name-value pairs with timestamps
- Used for tracking KPIs, story points, time estimates, etc.

## API Architecture

### Configuration Module

- Centralized environment variable management
- Type-safe configuration access
- Support for multiple environments (development, production, test)

### Database Connection

- TypeORM for database abstraction
- Connection pooling
- Migration system for schema changes
- Seed scripts for development data

### Future Modules (Not Yet Implemented)

- **Auth Module**: JWT authentication, Supabase integration
- **Boards Module**: CRUD operations for boards
- **Cards Module**: Card management with real-time updates
- **Users Module**: User management and permissions
- **WebSocket Gateway**: Real-time collaboration features

## Frontend Architecture

### State Management

- Zustand for global state
- localStorage persistence
- Type-safe state access

### Component Structure

- **TaskBoard**: Main container component
- **Header**: Navigation and controls
- **KanbanView**: Drag-and-drop kanban interface
- **EisenhowerMatrix**: Priority-based task view
- **TaskModal**: Task creation and editing

### Routing

- App Router for file-based routing
- Server and Client Components
- Streaming and Suspense support

## CI/CD Pipeline

### GitHub Actions Workflow

1. **Lint & Typecheck**
   - Runs on Node 18.x and 20.x
   - ESLint checks
   - Prettier formatting checks

2. **Build**
   - Builds both web and API
   - Verifies production builds work

3. **Test Migrations**
   - Starts PostgreSQL service
   - Runs migrations
   - Seeds database
   - Verifies schema integrity

### Workflow Triggers

- Push to main, develop, or feat-\* branches
- Pull requests to main or develop

## Docker Architecture

### Services

1. **postgres**: PostgreSQL 15 Alpine
   - Persistent volume for data
   - Health checks
   - Exposed on port 5432

2. **api**: NestJS backend
   - Multi-stage build for optimization
   - Health depends on postgres
   - Exposed on port 3001

3. **web**: Next.js frontend
   - Multi-stage build with standalone output
   - Depends on api
   - Exposed on port 3000

### Docker Compose Features

- Service dependencies
- Health checks
- Volume mounting for development
- Environment variable support
- Network isolation

## Development Workflow

### Local Development

1. Start database: `pnpm docker:up`
2. Run migrations: `pnpm migration:run`
3. Seed data: `pnpm seed`
4. Start apps: `pnpm dev`

### Making Changes

1. Create feature branch
2. Make changes
3. Run linting: `pnpm lint:fix`
4. Format code: `pnpm format`
5. Build: `pnpm build`
6. Commit and push

### Database Changes

1. Modify entities
2. Generate migration: `pnpm migration:generate`
3. Review migration
4. Apply migration: `pnpm migration:run`

## Security Considerations

### Environment Variables

- Sensitive data in .env (not committed)
- .env.example for documentation
- Different configs per environment

### Database

- Parameterized queries via TypeORM
- Connection pooling
- SSL support (configurable)

### API

- CORS configuration
- JWT authentication (planned)
- Input validation with class-validator
- Rate limiting (planned)

### Frontend

- XSS protection via React
- CSRF protection (planned)
- Secure cookie handling (planned)

## Performance Optimizations

### Frontend

- Next.js static generation where possible
- Image optimization
- Code splitting
- Lazy loading

### Backend

- Database indexes on foreign keys
- Connection pooling
- Caching layer (planned)
- Query optimization

### Build System

- Turborepo for incremental builds
- Docker layer caching
- pnpm for fast, efficient package management

## Monitoring & Observability

### Planned Features

- Structured logging
- Error tracking
- Performance metrics
- Health check endpoints
- Database query logging

## Scalability

### Horizontal Scaling

- Stateless API design
- Database connection pooling
- Load balancing ready
- Session management via database

### Vertical Scaling

- Efficient database queries
- Optimized bundle sizes
- Resource limits in Docker

## Future Enhancements

### Short Term

- REST API endpoints for all entities
- WebSocket support for real-time updates
- Authentication and authorization
- Unit and integration tests

### Medium Term

- GraphQL API option
- Advanced analytics and reporting
- Email notifications
- File attachments for cards

### Long Term

- Multi-board support
- Team collaboration features
- Mobile app
- Third-party integrations
