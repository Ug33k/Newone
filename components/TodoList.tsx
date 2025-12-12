'use client'

import { useState } from 'react'
import { useStore } from '../lib/store'
import TodoItem from './TodoItem'

export default function TodoList() {
  const { todos, addTodo, clearTodos } = useStore()
  const [newTodo, setNewTodo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      addTodo(newTodo.trim())
      setNewTodo('')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Todo List</h2>

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

      <div className="mb-4 space-y-2">
        {todos.map((todo, index) => (
          <TodoItem key={index} todo={todo} index={index} />
        ))}
      </div>

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
