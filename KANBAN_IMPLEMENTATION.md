# Kanban Board Implementation

## Overview
This document describes the implementation of the Kanban board UI component with drag-and-drop functionality, CRUD operations, and persistence.

## Components

### KanbanBoard.tsx
Main component that orchestrates the entire Kanban board application.

**Features:**
- Three columns: To Do, In Progress, Done
- Drag-and-drop between columns with status persistence
- Create, edit, delete task operations
- Hydration from localStorage on mount
- Loading state during initialization

**Key Functionality:**
- `handleCreateTask()` - Opens modal for creating new tasks
- `handleEditTask()` - Opens modal for editing existing tasks
- `handleDeleteTask()` - Deletes task with confirmation
- `handleDragEnd()` - Updates task status when dropped in different column
- `handleModalSubmit()` - Processes form submission for create/edit

### TaskModal.tsx
Modal dialog for creating and editing tasks.

**Features:**
- Title input (required)
- Description textarea
- Priority selector (Eisenhower quadrant mapping)
- Due date picker
- Form validation
- Dark mode support

**Eisenhower Quadrant Options:**
- Do First (Urgent & Important)
- Schedule (Not Urgent & Important)
- Delegate (Urgent & Not Important)
- Eliminate (Not Urgent & Not Important)

### KanbanColumn.tsx
Individual column component that displays tasks for a specific status.

**Features:**
- Column header with task count
- Droppable zone for drag-and-drop
- Vertical scrolling for overflow
- Empty state with helpful message
- Loading skeleton for initial load

**Statuses Supported:**
- KanbanStatus.TODO
- KanbanStatus.IN_PROGRESS
- KanbanStatus.DONE

### TaskCard.tsx
Individual task card component with draggable functionality.

**Features:**
- Task title
- Priority badge with color coding
- Description preview
- Due date display (formatted with date-fns)
- Edit and delete action buttons
- Drag handle styling

**Priority Color Coding:**
- Do First: Red
- Schedule: Blue
- Delegate: Yellow
- Eliminate: Gray

## State Management

The implementation uses the Zustand task store (src/store/taskStore.ts) which provides:

- **CRUD Operations:**
  - `addTask()` - Create new task
  - `updateTask()` - Update existing task
  - `deleteTask()` - Delete task
  - `getTask()` - Retrieve single task

- **Status Management:**
  - `updateKanbanStatus()` - Change task status
  - `getTasksByStatus()` - Filter tasks by status
  - `getAllTasks()` - Get all tasks sorted by order

- **Persistence:**
  - `hydrate()` - Load tasks from localStorage
  - `persistToStorage()` - Save tasks to localStorage
  - Debounced persistence (500ms) to avoid excessive writes

## Task Model

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  quadrant: EisenhowerQuadrant;
  kanbanStatus: KanbanStatus;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}
```

## Drag-and-Drop Implementation

The implementation uses @dnd-kit library:

- **Collision Detection:** closestCorners - Detects drop target based on proximity
- **Sensors:** PointerSensor with 8px activation distance
- **Sorting Strategy:** verticalListSortingStrategy for column sorting

**Drop Targets:**
1. Column area (status) - Updates task status directly
2. Another task - Inherits the status of the target task

## Features

✅ Three-column Kanban board (To Do, In Progress, Done)
✅ Drag-and-drop between columns
✅ Create tasks via modal
✅ Edit tasks via modal
✅ Delete tasks with confirmation
✅ Priority tagging with Eisenhower quadrants
✅ Due date management
✅ Persistent storage with localStorage
✅ Empty states for columns with no tasks
✅ Loading skeletons during initialization
✅ Dark mode support
✅ Responsive design with Tailwind CSS
✅ TypeScript for type safety
✅ ESLint and Prettier configured

## Styling

- **Framework:** Tailwind CSS v4
- **Icons:** lucide-react
- **Date Formatting:** date-fns
- **Dark Mode:** Supported via Tailwind dark mode utilities

## Browser Storage

Tasks are persisted to localStorage with the key 'eisenhower-kanban-tasks' using debounced writes (500ms delay) to optimize performance.
