# Eisenhower Kanban Task Manager

A state management solution for task management combining the Eisenhower Matrix priority framework with Kanban board workflow stages.

## Features

- **Eisenhower Matrix Integration**: Organize tasks by urgency and importance across four quadrants
  - Q1: Urgent & Important (Do First)
  - Q2: Not Urgent & Important (Schedule)
  - Q3: Urgent & Not Important (Delegate)
  - Q4: Not Urgent & Not Important (Eliminate)

- **Kanban Workflow**: Track task progress through multiple stages
  - TODO
  - IN_PROGRESS
  - REVIEW
  - DONE

- **Zustand-based State Management**: Lightweight and efficient store with:
  - Full CRUD operations
  - Drag-and-drop reordering support
  - Kanban status synchronization with Eisenhower priority
  - localStorage persistence with debounced saves (500ms)
  - Hydration on app load

- **Type-safe**: Built with TypeScript for maximum developer experience

- **Fully Tested**: Comprehensive unit tests with 37+ test cases covering:
  - CRUD operations
  - Reordering logic
  - Filtering and querying
  - Status synchronization
  - localStorage persistence and hydration
  - Edge cases and high-volume scenarios

## Installation

```bash
npm install
```

## Usage

### Basic Setup

```typescript
import { useTaskStore } from './store/taskStore';
import { EisenhowerQuadrant, KanbanStatus } from './types/task';

// Initialize store on app load
const App = () => {
  useEffect(() => {
    useTaskStore.getState().hydrate();
  }, []);

  return <YourApp />;
};
```

### Adding Tasks

```typescript
const store = useTaskStore.getState();

const task = store.addTask({
  title: 'Project Kickoff',
  description: 'Plan project timeline and resources',
  quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
  kanbanStatus: KanbanStatus.IN_PROGRESS,
  dueDate: new Date('2024-12-31'),
});
```

### Updating Tasks

```typescript
const store = useTaskStore.getState();

// Update any field
store.updateTask(taskId, {
  title: 'Updated Title',
  kanbanStatus: KanbanStatus.REVIEW,
});

// Or specifically update kanban status
store.updateKanbanStatus(taskId, KanbanStatus.DONE);
```

### Querying Tasks

```typescript
const store = useTaskStore.getState();

// Get all tasks in a quadrant
const urgentImportant = store.getTasksByQuadrant(EisenhowerQuadrant.URGENT_IMPORTANT);

// Get all tasks with a specific status
const inProgress = store.getTasksByStatus(KanbanStatus.IN_PROGRESS);

// Get all tasks sorted by order
const allTasks = store.getAllTasks();

// Get a specific task
const task = store.getTask(taskId);
```

### Reordering Tasks

```typescript
const store = useTaskStore.getState();

// Move task to a new position
store.reorderTasks(taskId, newOrderIndex);
```

### Persisting and Loading

```typescript
const store = useTaskStore.getState();

// Saves are automatically debounced and triggered on mutations
// Manual persist if needed:
store.persistToStorage();

// Load tasks from localStorage on app start
await store.hydrate();

// Clear all tasks and storage
store.clearStorage();
```

### Using with React Components (Hooks)

The store provides optimized hooks for React components:

```typescript
import React from 'react';
import { useTasksByQuadrant, useTasksByStatus, useAllTasks } from './store/taskStore';
import { EisenhowerQuadrant, KanbanStatus } from './types/task';

function QuadrantView() {
  // These hooks subscribe to specific slices of state
  const q1Tasks = useTasksByQuadrant(EisenhowerQuadrant.URGENT_IMPORTANT);
  const todoTasks = useTasksByStatus(KanbanStatus.TODO);
  const allTasks = useAllTasks();

  return (
    <div>
      <h2>Urgent & Important ({q1Tasks.length})</h2>
      {q1Tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

## Type Definitions

### Task

```typescript
interface Task {
  id: string;                        // Unique identifier
  title: string;                     // Task title
  description: string;               // Task description
  quadrant: EisenhowerQuadrant;     // Eisenhower quadrant
  kanbanStatus: KanbanStatus;        // Current kanban status
  dueDate?: Date;                    // Optional due date
  createdAt: Date;                   // Creation timestamp
  updatedAt: Date;                   // Last update timestamp
  order: number;                     // Position in list for drag-and-drop
}
```

### Enums

#### EisenhowerQuadrant
- `URGENT_IMPORTANT`
- `NOT_URGENT_IMPORTANT`
- `URGENT_NOT_IMPORTANT`
- `NOT_URGENT_NOT_IMPORTANT`

#### KanbanStatus
- `TODO`
- `IN_PROGRESS`
- `REVIEW`
- `DONE`

## API Reference

### Store Methods

#### CRUD Operations
- `addTask(payload: CreateTaskPayload): Task` - Add a new task
- `updateTask(id: string, payload: UpdateTaskPayload): Task | null` - Update a task
- `deleteTask(id: string): boolean` - Delete a task
- `getTask(id: string): Task | null` - Get a specific task

#### Querying
- `getTasksByQuadrant(quadrant: EisenhowerQuadrant): Task[]` - Get tasks in a quadrant
- `getTasksByStatus(status: KanbanStatus): Task[]` - Get tasks with a status
- `getAllTasks(): Task[]` - Get all tasks sorted by order

#### Status
- `updateKanbanStatus(id: string, status: KanbanStatus): Task | null` - Update kanban status

#### Reordering
- `reorderTasks(taskId: string, newOrder: number): void` - Reorder tasks

#### Persistence
- `persistToStorage(): void` - Save tasks to localStorage
- `hydrate(): Promise<void>` - Load tasks from localStorage
- `clearStorage(): void` - Clear localStorage and reset store

#### State Access
- `tasks: Task[]` - Array of all tasks
- `initialized: boolean` - Whether store has been hydrated

## Testing

Run the test suite:

```bash
npm test -- --run
```

Watch mode:

```bash
npm test
```

The project includes 37+ comprehensive tests covering:
- Task CRUD operations (8 tests)
- Task reordering (2 tests)
- Querying and filtering (4 tests)
- Status synchronization (2 tests)
- localStorage persistence (5 tests)
- Edge cases and performance (4 tests)
- Utilities round-trip serialization

## Architecture

### Store Structure

- **TaskStore**: Zustand store managing all task state and operations
- **Persistence**: localStorage with debounced saves (500ms debounce)
- **Serialization**: Automatic Date serialization for storage compatibility

### File Structure

```
src/
├── store/
│   ├── taskStore.ts           # Main Zustand store
│   └── taskStore.test.ts      # Store unit tests
├── types/
│   └── task.ts                # TypeScript type definitions
├── utils/
│   ├── taskUtils.ts           # Utility functions
│   └── taskUtils.test.ts      # Utility tests
└── index.ts                   # Public API exports
```

## Performance Considerations

- **Debounced Persistence**: Saves to localStorage are debounced with a 500ms delay to avoid excessive writes
- **Efficient Querying**: All query methods use simple array filters for optimal performance
- **Zustand Optimization**: Built-in selector hooks minimize re-renders in React components
- **Scalability**: Tested with 1000+ tasks to ensure performance at scale

## License

MIT
