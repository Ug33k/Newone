/**
 * Eisenhower Matrix Quadrants:
 * 1. URGENT_IMPORTANT: Do First (top-left)
 * 2. NOT_URGENT_IMPORTANT: Schedule (top-right)
 * 3. URGENT_NOT_IMPORTANT: Delegate (bottom-left)
 * 4. NOT_URGENT_NOT_IMPORTANT: Eliminate (bottom-right)
 */
export enum EisenhowerQuadrant {
  URGENT_IMPORTANT = 'urgent_important',
  NOT_URGENT_IMPORTANT = 'not_urgent_important',
  URGENT_NOT_IMPORTANT = 'urgent_not_important',
  NOT_URGENT_NOT_IMPORTANT = 'not_urgent_not_important',
}

/**
 * Kanban statuses corresponding to workflow stages
 */
export enum KanbanStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

/**
 * Core task data model
 */
export interface Task {
  id: string
  title: string
  description: string
  quadrant: EisenhowerQuadrant
  kanbanStatus: KanbanStatus
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  order: number
}

/**
 * Task creation payload (without auto-generated fields)
 */
export interface CreateTaskPayload {
  title: string
  description: string
  quadrant: EisenhowerQuadrant
  kanbanStatus?: KanbanStatus
  dueDate?: Date
}

/**
 * Task update payload (partial)
 */
export interface UpdateTaskPayload {
  title?: string
  description?: string
  quadrant?: EisenhowerQuadrant
  kanbanStatus?: KanbanStatus
  dueDate?: Date
}

/**
 * Serialized task for localStorage
 */
export interface SerializedTask extends Omit<Task, 'dueDate' | 'createdAt' | 'updatedAt'> {
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface FilterState {
  search: string
  statuses: KanbanStatus[]
  quadrants: EisenhowerQuadrant[]
}
