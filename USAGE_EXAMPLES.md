# Usage Examples

Comprehensive examples demonstrating how to use the Eisenhower Kanban task management store.

## React Component Examples

### Initialize Store on App Load

```typescript
import React, { useEffect } from 'react';
import { useTaskStore } from './store/taskStore';

function App() {
  useEffect(() => {
    // Load persisted tasks from localStorage
    useTaskStore.getState().hydrate();
  }, []);

  return <TaskBoard />;
}
```

### Add Task Component

```typescript
import React, { useState } from 'react';
import { useTaskStore } from './store/taskStore';
import { EisenhowerQuadrant } from './types/task';

function AddTaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quadrant, setQuadrant] = useState(EisenhowerQuadrant.URGENT_IMPORTANT);
  const [dueDate, setDueDate] = useState('');

  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTask({
      title,
      description,
      quadrant: quadrant as EisenhowerQuadrant,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={quadrant} onChange={(e) => setQuadrant(e.target.value)}>
        <option value={EisenhowerQuadrant.URGENT_IMPORTANT}>
          Q1: Urgent & Important
        </option>
        <option value={EisenhowerQuadrant.NOT_URGENT_IMPORTANT}>
          Q2: Not Urgent & Important
        </option>
        <option value={EisenhowerQuadrant.URGENT_NOT_IMPORTANT}>
          Q3: Urgent & Not Important
        </option>
        <option value={EisenhowerQuadrant.NOT_URGENT_NOT_IMPORTANT}>
          Q4: Not Urgent & Not Important
        </option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}
```

### Eisenhower Matrix View

```typescript
import React from 'react';
import { useTaskStore } from './store/taskStore';
import { EisenhowerQuadrant } from './types/task';

const QUADRANTS = [
  { key: EisenhowerQuadrant.URGENT_IMPORTANT, label: 'Do First', color: 'red' },
  { key: EisenhowerQuadrant.NOT_URGENT_IMPORTANT, label: 'Schedule', color: 'blue' },
  { key: EisenhowerQuadrant.URGENT_NOT_IMPORTANT, label: 'Delegate', color: 'yellow' },
  { key: EisenhowerQuadrant.NOT_URGENT_NOT_IMPORTANT, label: 'Eliminate', color: 'gray' },
];

function EisenhowerMatrix() {
  const getTasksByQuadrant = useTaskStore((state) => state.getTasksByQuadrant);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {QUADRANTS.map(({ key, label, color }) => {
        const tasks = getTasksByQuadrant(key);
        return (
          <div key={key} style={{ border: `2px solid ${color}`, padding: '20px' }}>
            <h2>{label}</h2>
            <p>{tasks.length} tasks</p>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
```

### Kanban Board View

```typescript
import React from 'react';
import { useTaskStore } from './store/taskStore';
import { KanbanStatus } from './types/task';

const STATUSES = [
  KanbanStatus.TODO,
  KanbanStatus.IN_PROGRESS,
  KanbanStatus.REVIEW,
  KanbanStatus.DONE,
];

function KanbanBoard() {
  const getTasksByStatus = useTaskStore((state) => state.getTasksByStatus);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
      {STATUSES.map((status) => {
        const tasks = getTasksByStatus(status);
        return (
          <div key={status} style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
            <h3>{status.toUpperCase()}</h3>
            <div style={{ minHeight: '400px' }}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} draggable />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### Task Card Component

```typescript
import React from 'react';
import { Task, KanbanStatus } from './types/task';
import { useTaskStore } from './store/taskStore';

interface TaskCardProps {
  task: Task;
  draggable?: boolean;
}

function TaskCard({ task, draggable = false }: TaskCardProps) {
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleStatusChange = (newStatus: KanbanStatus) => {
    updateTask(task.id, { kanbanStatus: newStatus });
  };

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      deleteTask(task.id);
    }
  };

  return (
    <div
      draggable={draggable}
      style={{
        padding: '12px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '8px',
        cursor: draggable ? 'grab' : 'default',
      }}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      
      {task.dueDate && (
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          Due: {task.dueDate.toLocaleDateString()}
        </p>
      )}

      <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
        <select value={task.kanbanStatus} onChange={(e) => handleStatusChange(e.target.value as KanbanStatus)}>
          <option value={KanbanStatus.TODO}>To Do</option>
          <option value={KanbanStatus.IN_PROGRESS}>In Progress</option>
          <option value={KanbanStatus.REVIEW}>Review</option>
          <option value={KanbanStatus.DONE}>Done</option>
        </select>

        <button onClick={handleDelete} style={{ backgroundColor: '#ff6b6b', color: 'white' }}>
          Delete
        </button>
      </div>
    </div>
  );
}
```

### Task List with Reordering

```typescript
import React, { useState } from 'react';
import { useTaskStore } from './store/taskStore';
import { EisenhowerQuadrant } from './types/task';

function ReorderableTaskList() {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const tasks = useTaskStore((state) => state.getTasksByQuadrant(EisenhowerQuadrant.URGENT_IMPORTANT));
  const reorderTasks = useTaskStore((state) => state.reorderTasks);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedTask) {
      reorderTasks(draggedTask, dropIndex);
      setDraggedTask(null);
    }
  };

  return (
    <div>
      <h2>Urgent & Important (Reorderable)</h2>
      {tasks.map((task, index) => (
        <div
          key={task.id}
          draggable
          onDragStart={() => handleDragStart(task.id)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          style={{
            padding: '12px',
            margin: '5px 0',
            backgroundColor: draggedTask === task.id ? '#e8f5e9' : 'white',
            border: '1px solid #ddd',
            cursor: 'grab',
          }}
        >
          {task.title}
        </div>
      ))}
    </div>
  );
}
```

### Task Statistics Component

```typescript
import React from 'react';
import { useTaskStore } from './store/taskStore';
import { EisenhowerQuadrant, KanbanStatus } from './types/task';

function TaskStats() {
  const allTasks = useTaskStore((state) => state.getAllTasks());

  const stats = {
    total: allTasks.length,
    q1: allTasks.filter((t) => t.quadrant === EisenhowerQuadrant.URGENT_IMPORTANT).length,
    q2: allTasks.filter((t) => t.quadrant === EisenhowerQuadrant.NOT_URGENT_IMPORTANT).length,
    todo: allTasks.filter((t) => t.kanbanStatus === KanbanStatus.TODO).length,
    done: allTasks.filter((t) => t.kanbanStatus === KanbanStatus.DONE).length,
    overdue: allTasks.filter((t) => t.dueDate && t.dueDate < new Date()).length,
  };

  return (
    <div>
      <h3>Task Statistics</h3>
      <ul>
        <li>Total Tasks: {stats.total}</li>
        <li>Urgent & Important: {stats.q1}</li>
        <li>Important (Not Urgent): {stats.q2}</li>
        <li>To Do: {stats.todo}</li>
        <li>Completed: {stats.done}</li>
        <li>Overdue: {stats.overdue}</li>
      </ul>
    </div>
  );
}
```

## Non-React Usage Examples

The store can also be used in non-React contexts (Node.js, vanilla JS, etc.) by directly accessing store methods:

### Create and Save Tasks

```typescript
import { useTaskStore } from './store/taskStore';
import { EisenhowerQuadrant } from './types/task';

async function setupTasks() {
  const store = useTaskStore.getState();

  // Create some tasks
  store.addTask({
    title: 'Fix critical bug',
    description: 'Production error affecting users',
    quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
  });

  store.addTask({
    title: 'Learn new framework',
    description: 'Complete course on new tech',
    quadrant: EisenhowerQuadrant.NOT_URGENT_IMPORTANT,
  });

  // Persist to localStorage
  store.persistToStorage();

  // Load later
  await store.hydrate();
}
```

### Bulk Operations

```typescript
import { useTaskStore } from './store/taskStore';
import { EisenhowerQuadrant, KanbanStatus } from './types/task';

function migrateTasksToNewStatus(
  fromStatus: KanbanStatus,
  toStatus: KanbanStatus
) {
  const store = useTaskStore.getState();
  const tasksToUpdate = store.getTasksByStatus(fromStatus);

  tasksToUpdate.forEach((task) => {
    store.updateTask(task.id, { kanbanStatus: toStatus });
  });

  console.log(`Migrated ${tasksToUpdate.length} tasks`);
}
```

### Export Tasks

```typescript
import { useTaskStore } from './store/taskStore';
import { serializeTask } from './utils/taskUtils';

function exportTasksAsJSON() {
  const store = useTaskStore.getState();
  const tasks = store.getAllTasks();
  const serialized = tasks.map(serializeTask);

  const json = JSON.stringify(serialized, null, 2);
  console.log(json);

  return json;
}
```

### Import Tasks

```typescript
import { useTaskStore } from './store/taskStore';
import { deserializeTask } from './utils/taskUtils';
import type { SerializedTask } from './types/task';

function importTasksFromJSON(jsonString: string) {
  const store = useTaskStore.getState();
  const serialized: SerializedTask[] = JSON.parse(jsonString);

  serialized.forEach((serializedTask) => {
    const task = deserializeTask(serializedTask);
    // Since addTask generates new IDs, manually set them here if needed
    store.addTask({
      title: task.title,
      description: task.description,
      quadrant: task.quadrant,
      kanbanStatus: task.kanbanStatus,
      dueDate: task.dueDate,
    });
  });

  store.persistToStorage();
}
```

## Advanced Patterns

### Custom Subscription

```typescript
import { useTaskStore } from './store/taskStore';

// Subscribe to store changes
const unsubscribe = useTaskStore.subscribe(
  (state) => state.tasks,
  (tasks) => {
    console.log('Tasks updated:', tasks.length);
  }
);

// Later, cleanup
unsubscribe();
```

### Filtered Selector

```typescript
import { useTaskStore } from './store/taskStore';
import { EisenhowerQuadrant, KanbanStatus } from './types/task';

// Create a custom selector for a specific combination
const urgentInProgress = useTaskStore((state) => {
  return state.tasks.filter(
    (task) =>
      task.quadrant === EisenhowerQuadrant.URGENT_IMPORTANT &&
      task.kanbanStatus === KanbanStatus.IN_PROGRESS
  );
});

console.log('Tasks that need immediate attention:', urgentInProgress);
```

### Time-based Actions

```typescript
import { useTaskStore } from './store/taskStore';

// Mark tasks without due dates as immediate priority
function assignDefaultDueDates() {
  const store = useTaskStore.getState();
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  store.tasks.forEach((task) => {
    if (!task.dueDate && task.kanbanStatus !== 'done') {
      store.updateTask(task.id, { dueDate: nextWeek });
    }
  });
}
```
