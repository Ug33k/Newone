'use client'

import { useEffect, useState } from 'react'
import { Plus, LayoutGrid, Columns } from 'lucide-react'
import { useTaskStore, useTaskStoreInitialized } from '../src/store/taskStore'
import { Task, KanbanStatus, CreateTaskPayload } from '../src/types/task'
import TaskModal, { TaskFormData } from './TaskModal'
import KanbanView from './KanbanView'
import EisenhowerMatrix from './EisenhowerMatrix'

type ViewType = 'kanban' | 'matrix'

export default function TaskBoard() {
  const { addTask, updateTask, deleteTask, hydrate } = useTaskStore()
  const initialized = useTaskStoreInitialized()

  const [view, setView] = useState<ViewType>('kanban')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

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
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {view === 'kanban' ? 'Kanban Board' : 'Eisenhower Matrix'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {view === 'kanban'
                ? 'Organize your tasks by status'
                : 'Prioritize tasks by urgency and importance'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg bg-white p-1 shadow-sm dark:bg-gray-800">
              <button
                onClick={() => setView('kanban')}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  view === 'kanban'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <Columns size={18} />
                Kanban
              </button>
              <button
                onClick={() => setView('matrix')}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  view === 'matrix'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <LayoutGrid size={18} />
                Matrix
              </button>
            </div>

            <button
              onClick={handleCreateTask}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
            >
              <Plus size={20} />
              New Task
            </button>
          </div>
        </div>

        {view === 'kanban' ? (
          <KanbanView onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} />
        ) : (
          <EisenhowerMatrix onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} />
        )}
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
