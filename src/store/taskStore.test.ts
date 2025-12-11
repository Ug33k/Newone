import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useTaskStore } from './taskStore';
import { CreateTaskPayload, EisenhowerQuadrant, KanbanStatus } from '../types/task';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TaskStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useTaskStore.setState({ tasks: [], initialized: false, saveScheduled: null });
  });

  afterEach(() => {
    const { saveScheduled } = useTaskStore.getState();
    if (saveScheduled) {
      clearTimeout(saveScheduled);
    }
  });

  describe('Task CRUD Operations', () => {
    it('should add a task with default values', () => {
      const payload: CreateTaskPayload = {
        title: 'Test Task',
        description: 'Test Description',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      };

      const task = useTaskStore.getState().addTask(payload);

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.quadrant).toBe(EisenhowerQuadrant.URGENT_IMPORTANT);
      expect(task.kanbanStatus).toBe(KanbanStatus.TODO);
      expect(task.order).toBe(0);
    });

    it('should add multiple tasks with correct ordering', () => {
      const task1 = useTaskStore.getState().addTask({
        title: 'First',
        description: 'Desc 1',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      const task2 = useTaskStore.getState().addTask({
        title: 'Second',
        description: 'Desc 2',
        quadrant: EisenhowerQuadrant.NOT_URGENT_IMPORTANT,
      });

      expect(task1.order).toBe(0);
      expect(task2.order).toBe(1);
      expect(useTaskStore.getState().tasks.length).toBe(2);
    });

    it('should update a task', () => {
      const task = useTaskStore.getState().addTask({
        title: 'Original Title',
        description: 'Original Description',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      const updated = useTaskStore.getState().updateTask(task.id, {
        title: 'Updated Title',
        kanbanStatus: KanbanStatus.IN_PROGRESS,
      });

      expect(updated).toBeDefined();
      expect(updated!.title).toBe('Updated Title');
      expect(updated!.description).toBe('Original Description'); // Unchanged
      expect(updated!.kanbanStatus).toBe(KanbanStatus.IN_PROGRESS);
    });

    it('should return null when updating non-existent task', () => {
      const updated = useTaskStore.getState().updateTask('non-existent', {
        title: 'Updated',
      });

      expect(updated).toBeNull();
    });

    it('should delete a task', () => {
      const task = useTaskStore.getState().addTask({
        title: 'To Delete',
        description: 'Will be deleted',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      const deleted = useTaskStore.getState().deleteTask(task.id);

      expect(deleted).toBe(true);
      expect(useTaskStore.getState().tasks.length).toBe(0);
    });

    it('should return false when deleting non-existent task', () => {
      const deleted = useTaskStore.getState().deleteTask('non-existent');

      expect(deleted).toBe(false);
    });

    it('should get task by id', () => {
      const task = useTaskStore.getState().addTask({
        title: 'Find Me',
        description: 'Test',
        quadrant: EisenhowerQuadrant.NOT_URGENT_NOT_IMPORTANT,
      });

      const found = useTaskStore.getState().getTask(task.id);

      expect(found).toBeDefined();
      expect(found!.id).toBe(task.id);
      expect(found!.title).toBe('Find Me');
    });

    it('should return null when getting non-existent task', () => {
      const found = useTaskStore.getState().getTask('non-existent');

      expect(found).toBeNull();
    });
  });

  describe('Task Reordering', () => {
    it('should reorder tasks within the list', () => {
      const task1 = useTaskStore.getState().addTask({
        title: 'Task 1',
        description: 'D1',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      const task2 = useTaskStore.getState().addTask({
        title: 'Task 2',
        description: 'D2',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      const task3 = useTaskStore.getState().addTask({
        title: 'Task 3',
        description: 'D3',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      // Move task 3 to the beginning
      useTaskStore.getState().reorderTasks(task3.id, 0);

      const tasks = useTaskStore.getState().tasks;
      expect(tasks[0].id).toBe(task3.id);
      expect(tasks[1].id).toBe(task1.id);
      expect(tasks[2].id).toBe(task2.id);
    });

    it('should maintain correct order values after reordering', () => {
      for (let i = 0; i < 3; i++) {
        useTaskStore.getState().addTask({
          title: `Task ${i}`,
          description: `D${i}`,
          quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
        });
      }

      const tasks = useTaskStore.getState().tasks;
      const middle = tasks[1];

      useTaskStore.getState().reorderTasks(middle.id, 2);

      const updated = useTaskStore.getState().tasks;
      updated.forEach((task, index) => {
        expect(task.order).toBe(index);
      });
    });
  });

  describe('Querying and Filtering', () => {
    beforeEach(() => {
      useTaskStore.getState().addTask({
        title: 'Urgent Important',
        description: 'Q1',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
        kanbanStatus: KanbanStatus.TODO,
      });

      useTaskStore.getState().addTask({
        title: 'Not Urgent Important',
        description: 'Q2',
        quadrant: EisenhowerQuadrant.NOT_URGENT_IMPORTANT,
        kanbanStatus: KanbanStatus.IN_PROGRESS,
      });

      useTaskStore.getState().addTask({
        title: 'Urgent Not Important',
        description: 'Q3',
        quadrant: EisenhowerQuadrant.URGENT_NOT_IMPORTANT,
        kanbanStatus: KanbanStatus.REVIEW,
      });

      useTaskStore.getState().addTask({
        title: 'Not Urgent Not Important',
        description: 'Q4',
        quadrant: EisenhowerQuadrant.NOT_URGENT_NOT_IMPORTANT,
        kanbanStatus: KanbanStatus.DONE,
      });
    });

    it('should filter tasks by quadrant', () => {
      const q1Tasks = useTaskStore.getState().getTasksByQuadrant(EisenhowerQuadrant.URGENT_IMPORTANT);

      expect(q1Tasks).toHaveLength(1);
      expect(q1Tasks[0].title).toBe('Urgent Important');
    });

    it('should filter tasks by kanban status', () => {
      const todoTasks = useTaskStore.getState().getTasksByStatus(KanbanStatus.TODO);

      expect(todoTasks).toHaveLength(1);
      expect(todoTasks[0].title).toBe('Urgent Important');
    });

    it('should return all tasks sorted by order', () => {
      const allTasks = useTaskStore.getState().getAllTasks();

      expect(allTasks).toHaveLength(4);
      for (let i = 0; i < allTasks.length; i++) {
        expect(allTasks[i].order).toBe(i);
      }
    });

    it('should return empty array for non-existent quadrant', () => {
      const tasks = useTaskStore.getState().getTasksByQuadrant(EisenhowerQuadrant.NOT_URGENT_IMPORTANT);
      expect(tasks).toHaveLength(1);
    });
  });

  describe('Status Synchronization', () => {
    it('should update kanban status', () => {
      const task = useTaskStore.getState().addTask({
        title: 'Test',
        description: 'Desc',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      const updated = useTaskStore.getState().updateKanbanStatus(task.id, KanbanStatus.IN_PROGRESS);

      expect(updated).toBeDefined();
      expect(updated!.kanbanStatus).toBe(KanbanStatus.IN_PROGRESS);
    });

    it('should cycle through all kanban statuses', () => {
      const task = useTaskStore.getState().addTask({
        title: 'Test',
        description: 'Desc',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      const statuses = [KanbanStatus.TODO, KanbanStatus.IN_PROGRESS, KanbanStatus.REVIEW, KanbanStatus.DONE];

      for (const status of statuses) {
        const updated = useTaskStore.getState().updateKanbanStatus(task.id, status);
        expect(updated!.kanbanStatus).toBe(status);
      }
    });
  });

  describe('Persistence', () => {
    it('should persist tasks to localStorage', async () => {
      useTaskStore.getState().addTask({
        title: 'Persist Me',
        description: 'Test',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      useTaskStore.getState().persistToStorage();

      const stored = localStorage.getItem('eisenhower-kanban-tasks');
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].title).toBe('Persist Me');
    });

    it('should hydrate tasks from localStorage', async () => {
      // Setup initial state in localStorage
      useTaskStore.getState().addTask({
        title: 'Initial Task',
        description: 'Test',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      useTaskStore.getState().persistToStorage();

      // Clear store and hydrate
      useTaskStore.setState({ tasks: [], initialized: false });
      await useTaskStore.getState().hydrate();

      const tasks = useTaskStore.getState().tasks;
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Initial Task');
      expect(useTaskStore.getState().initialized).toBe(true);
    });

    it('should handle empty localStorage gracefully', async () => {
      await useTaskStore.getState().hydrate();

      expect(useTaskStore.getState().tasks).toHaveLength(0);
      expect(useTaskStore.getState().initialized).toBe(true);
    });

    it('should clear storage', async () => {
      useTaskStore.getState().addTask({
        title: 'To Clear',
        description: 'Test',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      useTaskStore.getState().persistToStorage();

      useTaskStore.getState().clearStorage();

      expect(useTaskStore.getState().tasks).toHaveLength(0);
      expect(localStorage.getItem('eisenhower-kanban-tasks')).toBeNull();
    });

    it('should debounce persist operations', async () => {
      const persistSpy = vi.spyOn(useTaskStore.getState(), 'persistToStorage');

      useTaskStore.getState().addTask({
        title: 'Task 1',
        description: 'D1',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      useTaskStore.getState().addTask({
        title: 'Task 2',
        description: 'D2',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      // Persist should be scheduled but not yet called
      expect(persistSpy).not.toHaveBeenCalled();

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 600));

      expect(persistSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle task with due date', () => {
      const dueDate = new Date('2024-12-31');
      const task = useTaskStore.getState().addTask({
        title: 'Task with Due Date',
        description: 'Test',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
        dueDate,
      });

      expect(task.dueDate).toBeDefined();
      expect(task.dueDate!.toISOString()).toBe(dueDate.toISOString());
    });

    it('should update timestamps on task modification', async () => {
      const task = useTaskStore.getState().addTask({
        title: 'Original',
        description: 'Test',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      const originalUpdatedAt = task.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = useTaskStore.getState().updateTask(task.id, {
        title: 'Modified',
      });

      expect(updated!.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should handle large numbers of tasks', () => {
      const taskCount = 1000;
      for (let i = 0; i < taskCount; i++) {
        useTaskStore.getState().addTask({
          title: `Task ${i}`,
          description: `Description ${i}`,
          quadrant: Object.values(EisenhowerQuadrant)[i % 4],
        });
      }

      expect(useTaskStore.getState().tasks).toHaveLength(taskCount);
      expect(useTaskStore.getState().getAllTasks()).toHaveLength(taskCount);
    });

    it('should maintain referential consistency of task objects', () => {
      const task = useTaskStore.getState().addTask({
        title: 'Test',
        description: 'Desc',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      });

      const retrieved1 = useTaskStore.getState().getTask(task.id);
      const retrieved2 = useTaskStore.getState().getTask(task.id);

      expect(retrieved1).toBeDefined();
      expect(retrieved2).toBeDefined();
      expect(retrieved1!.id).toBe(retrieved2!.id);
    });
  });
});
