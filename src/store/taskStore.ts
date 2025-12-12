import { create } from 'zustand'
import {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  SerializedTask,
  KanbanStatus,
  EisenhowerQuadrant,
} from '../types/task'
import { createTask, serializeTask, deserializeTask } from '../utils/taskUtils'

const STORAGE_KEY = 'eisenhower-kanban-tasks'
const DEBOUNCE_DELAY = 500

interface TaskStore {
  tasks: Task[]
  initialized: boolean
  saveScheduled: NodeJS.Timeout | null

  // CRUD operations
  addTask: (payload: CreateTaskPayload) => Task
  updateTask: (id: string, payload: UpdateTaskPayload) => Task | null
  deleteTask: (id: string) => boolean
  getTask: (id: string) => Task | null

  // Reordering and querying
  reorderTasks: (taskId: string, newOrder: number) => void
  getTasksByQuadrant: (quadrant: EisenhowerQuadrant) => Task[]
  getTasksByStatus: (status: KanbanStatus) => Task[]
  getAllTasks: () => Task[]

  // Status synchronization
  updateKanbanStatus: (id: string, status: KanbanStatus) => Task | null

  // Persistence
  hydrate: () => Promise<void>
  persistToStorage: () => void
  clearStorage: () => void

  // Internal helper
  _schedulePersist: () => void
}

export const useTaskStore = create<TaskStore>((set, get) => {
  let debounceTimer: NodeJS.Timeout | null = null

  const schedulePersist = () => {
    if (debounceTimer) clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      const { persistToStorage } = get()
      persistToStorage()
      debounceTimer = null
    }, DEBOUNCE_DELAY)

    set({ saveScheduled: debounceTimer })
  }

  return {
    tasks: [],
    initialized: false,
    saveScheduled: null,

    addTask: (payload: CreateTaskPayload) => {
      const state = get()
      const order = Math.max(...state.tasks.map((t) => t.order), -1) + 1
      const newTask = createTask(payload, order)

      set((state) => ({
        tasks: [...state.tasks, newTask],
      }))

      get()._schedulePersist()
      return newTask
    },

    updateTask: (id: string, payload: UpdateTaskPayload) => {
      let updatedTask: Task | null = null

      set((state) => {
        const taskIndex = state.tasks.findIndex((t) => t.id === id)
        if (taskIndex === -1) return state

        const task = state.tasks[taskIndex]
        updatedTask = {
          ...task,
          ...payload,
          updatedAt: new Date(),
        }

        const newTasks = [...state.tasks]
        newTasks[taskIndex] = updatedTask

        return { tasks: newTasks }
      })

      if (updatedTask) {
        get()._schedulePersist()
      }

      return updatedTask
    },

    deleteTask: (id: string) => {
      let deleted = false

      set((state) => {
        const taskIndex = state.tasks.findIndex((t) => t.id === id)
        if (taskIndex === -1) return state

        deleted = true
        const newTasks = state.tasks.filter((_, index) => index !== taskIndex)

        // Reorder remaining tasks
        newTasks.forEach((task, index) => {
          task.order = index
        })

        return { tasks: newTasks }
      })

      if (deleted) {
        get()._schedulePersist()
      }

      return deleted
    },

    getTask: (id: string) => {
      return get().tasks.find((t) => t.id === id) || null
    },

    reorderTasks: (taskId: string, newOrder: number) => {
      set((state) => {
        const taskIndex = state.tasks.findIndex((t) => t.id === taskId)
        if (taskIndex === -1) return state

        const newTasks = [...state.tasks]
        const task = newTasks[taskIndex]
        newTasks.splice(taskIndex, 1)
        newTasks.splice(Math.max(0, newOrder), 0, task)

        // Reindex all orders
        newTasks.forEach((t, index) => {
          t.order = index
        })

        return { tasks: newTasks }
      })

      get()._schedulePersist()
    },

    getTasksByQuadrant: (quadrant: EisenhowerQuadrant) => {
      return get()
        .tasks.filter((t) => t.quadrant === quadrant)
        .sort((a, b) => a.order - b.order)
    },

    getTasksByStatus: (status: KanbanStatus) => {
      return get()
        .tasks.filter((t) => t.kanbanStatus === status)
        .sort((a, b) => a.order - b.order)
    },

    getAllTasks: () => {
      return get().tasks.sort((a, b) => a.order - b.order)
    },

    updateKanbanStatus: (id: string, status: KanbanStatus) => {
      return get().updateTask(id, { kanbanStatus: status })
    },

    persistToStorage: () => {
      try {
        const { tasks } = get()
        const serialized = tasks.map(serializeTask)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
      } catch (error) {
        console.error('Failed to persist tasks to localStorage:', error)
      }
    },

    clearStorage: () => {
      try {
        localStorage.removeItem(STORAGE_KEY)
        set({ tasks: [], initialized: true })
      } catch (error) {
        console.error('Failed to clear localStorage:', error)
      }
    },

    hydrate: async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const serialized: SerializedTask[] = JSON.parse(stored)
          const tasks = serialized.map(deserializeTask).sort((a, b) => a.order - b.order)
          set({ tasks, initialized: true })
        } else {
          set({ initialized: true })
        }
      } catch (error) {
        console.error('Failed to hydrate tasks from localStorage:', error)
        set({ initialized: true })
      }
    },

    _schedulePersist: () => {
      schedulePersist()
    },
  }
})

/**
 * Selector hooks for optimized component subscriptions
 */
export const useTaskCount = () => useTaskStore((state) => state.tasks.length)

export const useTasksByQuadrant = (quadrant: EisenhowerQuadrant) =>
  useTaskStore((state) => state.getTasksByQuadrant(quadrant))

export const useTasksByStatus = (status: KanbanStatus) =>
  useTaskStore((state) => state.getTasksByStatus(status))

export const useAllTasks = () => useTaskStore((state) => state.getAllTasks())

export const useTask = (id: string) => useTaskStore((state) => state.getTask(id))

export const useTaskStoreInitialized = () => useTaskStore((state) => state.initialized)
