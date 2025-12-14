'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useStore } from '../lib/store'
import TodoItem from './TodoItem'

export default function DragDropTodo() {
  const { todos, addTodo, clearTodos } = useStore()
  const [newTodo, setNewTodo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      addTodo(newTodo.trim())
      setNewTodo('')
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((_, index) => index === active.id)
      const newIndex = todos.findIndex((_, index) => index === over.id)

      // Note: This is a simplified drag reordering
      // In a real app, you'd want to update the store with the new order
      console.log('Drag from index', oldIndex, 'to index', newIndex)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Drag & Drop Todo</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Add
          </button>
        </div>
      </form>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={todos.map((_, index) => index)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mb-4 space-y-2">
            {todos.map((todo, index) => (
              <TodoItem key={index} todo={todo} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {todos.length > 0 && (
        <button
          onClick={clearTodos}
          className="w-full rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
        >
          Clear All
        </button>
      )}
    </div>
  )
}
