import { describe, it, expect } from 'vitest'
import { generateTaskId, serializeTask, deserializeTask, createTask } from './taskUtils'
import { EisenhowerQuadrant, KanbanStatus, CreateTaskPayload } from '../types/task'

describe('Task Utilities', () => {
  describe('generateTaskId', () => {
    it('should generate unique task IDs', () => {
      const id1 = generateTaskId()
      const id2 = generateTaskId()

      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
    })

    it('should generate IDs with task prefix', () => {
      const id = generateTaskId()
      expect(id).toMatch(/^task_/)
    })

    it('should generate IDs with timestamp', () => {
      const before = Date.now()
      const id = generateTaskId()
      const after = Date.now()

      const timestampPart = parseInt(id.split('_')[1])
      expect(timestampPart).toBeGreaterThanOrEqual(before)
      expect(timestampPart).toBeLessThanOrEqual(after)
    })
  })

  describe('serializeTask', () => {
    it('should serialize task with all fields', () => {
      const dueDate = new Date('2024-12-31T10:00:00Z')
      const createdAt = new Date('2024-01-01T10:00:00Z')
      const updatedAt = new Date('2024-01-15T10:00:00Z')

      const task = {
        id: 'task_123',
        title: 'Test Task',
        description: 'Test Description',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
        kanbanStatus: KanbanStatus.IN_PROGRESS,
        dueDate,
        createdAt,
        updatedAt,
        order: 0,
      }

      const serialized = serializeTask(task)

      expect(serialized.id).toBe('task_123')
      expect(serialized.title).toBe('Test Task')
      expect(serialized.dueDate).toBe('2024-12-31T10:00:00.000Z')
      expect(serialized.createdAt).toBe('2024-01-01T10:00:00.000Z')
      expect(serialized.updatedAt).toBe('2024-01-15T10:00:00.000Z')
    })

    it('should serialize task without due date', () => {
      const task = {
        id: 'task_123',
        title: 'Test Task',
        description: 'Test Description',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
        kanbanStatus: KanbanStatus.TODO,
        dueDate: undefined,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
        order: 0,
      }

      const serialized = serializeTask(task)

      expect(serialized.dueDate).toBeUndefined()
      expect(serialized.createdAt).toBeDefined()
      expect(serialized.updatedAt).toBeDefined()
    })
  })

  describe('deserializeTask', () => {
    it('should deserialize task with all fields', () => {
      const serialized = {
        id: 'task_123',
        title: 'Test Task',
        description: 'Test Description',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
        kanbanStatus: KanbanStatus.IN_PROGRESS,
        dueDate: '2024-12-31T10:00:00.000Z',
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
        order: 0,
      }

      const deserialized = deserializeTask(serialized)

      expect(deserialized.id).toBe('task_123')
      expect(deserialized.title).toBe('Test Task')
      expect(deserialized.dueDate).toBeInstanceOf(Date)
      expect(deserialized.dueDate!.toISOString()).toBe('2024-12-31T10:00:00.000Z')
      expect(deserialized.createdAt).toBeInstanceOf(Date)
      expect(deserialized.updatedAt).toBeInstanceOf(Date)
    })

    it('should deserialize task without due date', () => {
      const serialized = {
        id: 'task_123',
        title: 'Test Task',
        description: 'Test Description',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
        kanbanStatus: KanbanStatus.TODO,
        dueDate: undefined,
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-01T10:00:00.000Z',
        order: 0,
      }

      const deserialized = deserializeTask(serialized)

      expect(deserialized.dueDate).toBeUndefined()
    })
  })

  describe('createTask', () => {
    it('should create task with payload and default values', () => {
      const payload: CreateTaskPayload = {
        title: 'New Task',
        description: 'Task Description',
        quadrant: EisenhowerQuadrant.NOT_URGENT_IMPORTANT,
      }

      const task = createTask(payload, 5)

      expect(task.id).toBeDefined()
      expect(task.id).toMatch(/^task_/)
      expect(task.title).toBe('New Task')
      expect(task.description).toBe('Task Description')
      expect(task.quadrant).toBe(EisenhowerQuadrant.NOT_URGENT_IMPORTANT)
      expect(task.kanbanStatus).toBe(KanbanStatus.TODO)
      expect(task.order).toBe(5)
      expect(task.createdAt).toBeInstanceOf(Date)
      expect(task.updatedAt).toBeInstanceOf(Date)
    })

    it('should create task with custom kanban status', () => {
      const payload: CreateTaskPayload = {
        title: 'Task',
        description: 'Desc',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
        kanbanStatus: KanbanStatus.IN_PROGRESS,
      }

      const task = createTask(payload, 0)

      expect(task.kanbanStatus).toBe(KanbanStatus.IN_PROGRESS)
    })

    it('should create task with due date', () => {
      const dueDate = new Date('2024-12-31')
      const payload: CreateTaskPayload = {
        title: 'Task',
        description: 'Desc',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
        dueDate,
      }

      const task = createTask(payload, 0)

      expect(task.dueDate).toEqual(dueDate)
    })

    it('should set createdAt and updatedAt to current time', () => {
      const before = new Date()
      const payload: CreateTaskPayload = {
        title: 'Task',
        description: 'Desc',
        quadrant: EisenhowerQuadrant.URGENT_IMPORTANT,
      }

      const task = createTask(payload, 0)
      const after = new Date()

      expect(task.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(task.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
      expect(task.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(task.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime())
    })
  })

  describe('Round-trip serialization', () => {
    it('should preserve task data through serialize/deserialize cycle', () => {
      const original = {
        id: 'task_123',
        title: 'Test Task',
        description: 'Test Description',
        quadrant: EisenhowerQuadrant.NOT_URGENT_NOT_IMPORTANT,
        kanbanStatus: KanbanStatus.REVIEW,
        dueDate: new Date('2024-06-15T14:30:00Z'),
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-02-01T10:00:00Z'),
        order: 42,
      }

      const serialized = serializeTask(original)
      const deserialized = deserializeTask(serialized)

      expect(deserialized.id).toBe(original.id)
      expect(deserialized.title).toBe(original.title)
      expect(deserialized.description).toBe(original.description)
      expect(deserialized.quadrant).toBe(original.quadrant)
      expect(deserialized.kanbanStatus).toBe(original.kanbanStatus)
      expect(deserialized.dueDate!.toISOString()).toBe(original.dueDate!.toISOString())
      expect(deserialized.createdAt.toISOString()).toBe(original.createdAt.toISOString())
      expect(deserialized.updatedAt.toISOString()).toBe(original.updatedAt.toISOString())
      expect(deserialized.order).toBe(original.order)
    })
  })
})
