'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Task, EisenhowerQuadrant } from '../src/types/task'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => void
  task?: Task
  mode: 'create' | 'edit'
}

export interface TaskFormData {
  title: string
  description: string
  quadrant: EisenhowerQuadrant
  dueDate?: Date
}

export default function TaskModal({ isOpen, onClose, onSubmit, task, mode }: TaskModalProps) {
  const getInitialFormData = (): TaskFormData => {
    if (task) {
      return {
        title: task.title,
        description: task.description,
        quadrant: task.quadrant,
        dueDate: task.dueDate,
      }
    }
    return {
      title: '',
      description: '',
      quadrant: EisenhowerQuadrant.NOT_URGENT_NOT_IMPORTANT,
      dueDate: undefined,
    }
  }

  const [formData, setFormData] = useState<TaskFormData>(getInitialFormData())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title.trim()) {
      onSubmit(formData)
      setFormData({
        title: '',
        description: '',
        quadrant: EisenhowerQuadrant.NOT_URGENT_NOT_IMPORTANT,
        dueDate: undefined,
      })
      onClose()
    }
  }

  const quadrantOptions = [
    { value: EisenhowerQuadrant.URGENT_IMPORTANT, label: 'Do First (Urgent & Important)' },
    {
      value: EisenhowerQuadrant.NOT_URGENT_IMPORTANT,
      label: 'Schedule (Not Urgent & Important)',
    },
    {
      value: EisenhowerQuadrant.URGENT_NOT_IMPORTANT,
      label: 'Delegate (Urgent & Not Important)',
    },
    {
      value: EisenhowerQuadrant.NOT_URGENT_NOT_IMPORTANT,
      label: 'Eliminate (Not Urgent & Not Important)',
    },
  ]

  if (!isOpen) return null

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          {mode === 'create' ? 'Create New Task' : 'Edit Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority (Eisenhower Quadrant) *
            </label>
            <select
              value={formData.quadrant}
              onChange={(e) =>
                setFormData({ ...formData, quadrant: e.target.value as EisenhowerQuadrant })
              }
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {quadrantOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dueDate: e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined,
                })
              }
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded bg-blue-500 py-2 font-medium text-white hover:bg-blue-600"
            >
              {mode === 'create' ? 'Create Task' : 'Update Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded border border-gray-300 bg-white py-2 font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
