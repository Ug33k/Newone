'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useStore } from '../lib/store'

interface TodoItemProps {
  todo: string
  index: number
}

export default function TodoItem({ todo, index }: TodoItemProps) {
  const { removeTodo } = useStore()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: index,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex cursor-move items-center gap-3 rounded-md bg-gray-50 p-3 transition-colors select-none hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
    >
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{index + 1}.</div>
      <div className="flex-1 break-words text-gray-900 dark:text-white">{todo}</div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          removeTodo(index)
        }}
        className="rounded p-1 text-red-500 transition-colors hover:text-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
        title="Remove todo"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}
