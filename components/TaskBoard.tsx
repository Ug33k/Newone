'use client'

import { useEffect, useState } from 'react'
import { useTaskStore, useTaskStoreInitialized } from '../src/store/taskStore'
import { Task, KanbanStatus, CreateTaskPayload, FilterState } from '../src/types/task'
import TaskModal, { TaskFormData } from './TaskModal'
import KanbanView from './KanbanView'
import EisenhowerMatrix from './EisenhowerMatrix'
import Header from './Header'

type ViewType = 'kanban' | 'matrix'

export default function TaskBoard() {
  const { addTask, updateTask, deleteTask, hydrate } = useTaskStore()
  const initialized = useTaskStoreInitialized()

  const [view, setView] = useState<ViewType>('kanban')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    statuses: [],
    quadrants: [],
  })

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
        <Header
          view={view}
          setView={setView}
          onFilterChange={setFilters}
          onCreateTask={handleCreateTask}
        />

        {view === 'kanban' ? (
          <KanbanView
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            filters={filters}
          />
        ) : (
          <EisenhowerMatrix
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            filters={filters}
          />
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
