'use client'

import {
  DndContext,
  DragEndEvent,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useTaskStore, useTasksByQuadrant } from '../src/store/taskStore'
import { Task, EisenhowerQuadrant as QuadrantType, FilterState } from '../src/types/task'
import EisenhowerQuadrant from './EisenhowerQuadrant'

interface EisenhowerMatrixProps {
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  filters: FilterState
}

export default function EisenhowerMatrix({
  onEditTask,
  onDeleteTask,
  filters,
}: EisenhowerMatrixProps) {
  const { updateTask, tasks } = useTaskStore()

  const filterTasks = (taskList: Task[]) => {
    return taskList.filter((task) => {
      // Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (
          !task.title.toLowerCase().includes(searchLower) &&
          !task.description.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      // Status Filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(task.kanbanStatus)) {
        return false
      }

      // Quadrant Filter
      if (filters.quadrants.length > 0 && !filters.quadrants.includes(task.quadrant)) {
        return false
      }

      return true
    })
  }

  // We can use the store selectors, but we need to pass them to quadrants.
  // Or we can filter them here.
  // Using hooks here for each quadrant:
  const urgentImportantTasks = filterTasks(useTasksByQuadrant(QuadrantType.URGENT_IMPORTANT))
  const notUrgentImportantTasks = filterTasks(useTasksByQuadrant(QuadrantType.NOT_URGENT_IMPORTANT))
  const urgentNotImportantTasks = filterTasks(useTasksByQuadrant(QuadrantType.URGENT_NOT_IMPORTANT))
  const notUrgentNotImportantTasks = filterTasks(
    useTasksByQuadrant(QuadrantType.NOT_URGENT_NOT_IMPORTANT)
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const activeTaskId = active.id as string
    const overId = over.id as string

    // Check if dropping on a quadrant ID
    if (Object.values(QuadrantType).includes(overId as QuadrantType)) {
      updateTask(activeTaskId, { quadrant: overId as QuadrantType })
    } else if (overId.startsWith('task_') || tasks.find((t) => t.id === overId)) {
      // If dropping on another task, find that task and get its quadrant
      const targetTask = tasks.find((t) => t.id === overId)
      if (targetTask) {
        updateTask(activeTaskId, { quadrant: targetTask.quadrant })
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:h-[calc(100vh-12rem)]">
        <EisenhowerQuadrant
          title="Urgent & Important"
          quadrant={QuadrantType.URGENT_IMPORTANT}
          tasks={urgentImportantTasks}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          className="bg-red-50/50 dark:bg-red-900/10"
        />
        <EisenhowerQuadrant
          title="Not Urgent & Important"
          quadrant={QuadrantType.NOT_URGENT_IMPORTANT}
          tasks={notUrgentImportantTasks}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          className="bg-blue-50/50 dark:bg-blue-900/10"
        />
        <EisenhowerQuadrant
          title="Urgent & Not Important"
          quadrant={QuadrantType.URGENT_NOT_IMPORTANT}
          tasks={urgentNotImportantTasks}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          className="bg-yellow-50/50 dark:bg-yellow-900/10"
        />
        <EisenhowerQuadrant
          title="Not Urgent & Not Important"
          quadrant={QuadrantType.NOT_URGENT_NOT_IMPORTANT}
          tasks={notUrgentNotImportantTasks}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          className="bg-gray-50/50 dark:bg-gray-800/50"
        />
      </div>
    </DndContext>
  )
}
