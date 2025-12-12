'use client'

import { Task, EisenhowerQuadrant } from '../src/types/task'
import { format } from 'date-fns'
import { Trash2, Edit2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

const quadrantConfig = {
  [EisenhowerQuadrant.URGENT_IMPORTANT]: {
    label: 'Do First',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  [EisenhowerQuadrant.NOT_URGENT_IMPORTANT]: {
    label: 'Schedule',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  [EisenhowerQuadrant.URGENT_NOT_IMPORTANT]: {
    label: 'Delegate',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  [EisenhowerQuadrant.NOT_URGENT_NOT_IMPORTANT]: {
    label: 'Eliminate',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  },
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const quadrant = quadrantConfig[task.quadrant]

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="flex-1 font-semibold text-gray-900 dark:text-white">{task.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded p-1 text-gray-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
      )}

      <div className="mb-3 flex items-center gap-2">
        <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${quadrant.color}`}>
          {quadrant.label}
        </span>
      </div>

      {task.dueDate && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Due: {format(task.dueDate, 'MMM dd, yyyy')}
        </div>
      )}
    </div>
  )
}
