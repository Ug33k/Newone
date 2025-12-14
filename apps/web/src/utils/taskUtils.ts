import { Task, SerializedTask, CreateTaskPayload, KanbanStatus } from '../types/task'

/**
 * Generate a unique ID for a task
 */
export function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Serialize a task for storage
 */
export function serializeTask(task: Task): SerializedTask {
  return {
    ...task,
    dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }
}

/**
 * Deserialize a task from storage
 */
export function deserializeTask(data: SerializedTask): Task {
  return {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  }
}

/**
 * Create a new task from payload with default values
 */
export function createTask(payload: CreateTaskPayload, order: number): Task {
  const now = new Date()
  return {
    id: generateTaskId(),
    ...payload,
    kanbanStatus: payload.kanbanStatus || KanbanStatus.TODO,
    createdAt: now,
    updatedAt: now,
    order,
  }
}
