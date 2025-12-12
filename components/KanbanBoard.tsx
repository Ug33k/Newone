'use client'

import { useEffect, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { useTaskStore, useTasksByStatus, useTaskStoreInitialized } from '../src/store/taskStore'
import { Task, KanbanStatus, CreateTaskPayload } from '../src/types/task'
import KanbanColumn from './KanbanColumn'
import TaskModal, { TaskFormData } from './TaskModal'

export default function KanbanBoard() {
  const { addTask, updateTask, deleteTask, updateKanbanStatus, hydrate } = useTaskStore()
  const initialized = useTaskStoreInitialized()

  const todoTasks = useTasksByStatus(KanbanStatus.TODO)
  const inProgressTasks = useTasksByStatus(KanbanStatus.IN_PROGRESS)
  const doneTasks = useTasksByStatus(KanbanStatus.DONE)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const handleCreateTask = () => {
    setModalMode('create')
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setModalMode('edit')
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId)
    }
  }

  const handleModalSubmit = (formData: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, {
        title: formData.title,
        description: formData.description,
        quadrant: formData.quadrant,
        dueDate: formData.dueDate,
      })
    } else {
      const payload: CreateTaskPayload = {
        title: formData.title,
        description: formData.description,
        quadrant: formData.quadrant,
        dueDate: formData.dueDate,
        kanbanStatus: KanbanStatus.TODO,
      }
      addTask(payload)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const activeTaskId = active.id as string
    const overStatus = over.id as KanbanStatus | string

    // Check if dropping on a column (status)
    if (Object.values(KanbanStatus).includes(overStatus as KanbanStatus)) {
      updateKanbanStatus(activeTaskId, overStatus as KanbanStatus)
    } else if (typeof over.id === 'string' && over.id.startsWith('task_')) {
      // If dropping on another task, get its status and update
      const allTasks = [...todoTasks, ...inProgressTasks, ...doneTasks]
      const targetTask = allTasks.find((t) => t.id === over.id)
      if (targetTask) {
        updateKanbanStatus(activeTaskId, targetTask.kanbanStatus)
      }
    }
  }

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Organize your tasks with drag and drop
            </p>
          </div>
          <button
            onClick={handleCreateTask}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
          >
            <Plus size={20} />
            New Task
          </button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <KanbanColumn
              title="To Do"
              status={KanbanStatus.TODO}
              tasks={todoTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              isLoading={false}
            />
            <KanbanColumn
              title="In Progress"
              status={KanbanStatus.IN_PROGRESS}
              tasks={inProgressTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              isLoading={false}
            />
            <KanbanColumn
              title="Done"
              status={KanbanStatus.DONE}
              tasks={doneTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              isLoading={false}
            />
          </div>
        </DndContext>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleModalSubmit}
        task={editingTask || undefined}
        mode={modalMode}
      />
    </div>
  )
}
