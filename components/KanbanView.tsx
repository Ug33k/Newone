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
import { useTaskStore, useTasksByStatus } from '../src/store/taskStore'
import { Task, KanbanStatus } from '../src/types/task'
import KanbanColumn from './KanbanColumn'

interface KanbanViewProps {
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export default function KanbanView({ onEditTask, onDeleteTask }: KanbanViewProps) {
  const { updateKanbanStatus, tasks } = useTaskStore()

  const todoTasks = useTasksByStatus(KanbanStatus.TODO)
  const inProgressTasks = useTasksByStatus(KanbanStatus.IN_PROGRESS)
  const doneTasks = useTasksByStatus(KanbanStatus.DONE)

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
    const overStatus = over.id as KanbanStatus | string

    // Check if dropping on a column (status)
    if (Object.values(KanbanStatus).includes(overStatus as KanbanStatus)) {
      updateKanbanStatus(activeTaskId, overStatus as KanbanStatus)
    } else if (typeof over.id === 'string' && (over.id.startsWith('task_') || tasks.find(t => t.id === over.id))) {
      // If dropping on another task, get its status and update
      // We look up the task in the store tasks to be safe
      const targetTask = tasks.find((t) => t.id === over.id)
      if (targetTask) {
        updateKanbanStatus(activeTaskId, targetTask.kanbanStatus)
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <KanbanColumn
          title="To Do"
          status={KanbanStatus.TODO}
          tasks={todoTasks}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          isLoading={false}
        />
        <KanbanColumn
          title="In Progress"
          status={KanbanStatus.IN_PROGRESS}
          tasks={inProgressTasks}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          isLoading={false}
        />
        <KanbanColumn
          title="Done"
          status={KanbanStatus.DONE}
          tasks={doneTasks}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          isLoading={false}
        />
      </div>
    </DndContext>
  )
}
