'use client'

import { Task, EisenhowerQuadrant as QuadrantType } from '../src/types/task'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

interface EisenhowerQuadrantProps {
  title: string
  quadrant: QuadrantType
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  isLoading?: boolean
  className?: string
}

export default function EisenhowerQuadrant({
  title,
  quadrant,
  tasks,
  onEdit,
  onDelete,
  isLoading = false,
  className = '',
}: EisenhowerQuadrantProps) {
  const { setNodeRef } = useDroppable({ id: quadrant })

  return (
    <div className={`flex flex-col rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          {title}
          {!isLoading && (
            <span className="ml-2 inline-block rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {tasks.length}
            </span>
          )}
        </h2>
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-8 text-center dark:border-gray-600">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-sm">No tasks</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Drag tasks here
              </p>
            </div>
          </div>
        ) : (
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}
