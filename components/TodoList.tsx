'use client';

import { useState } from 'react';
import { useStore } from '../lib/store';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { todos, addTodo, clearTodos } = useStore();
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Todo List
      </h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2 mb-4">
        {todos.map((todo, index) => (
          <TodoItem key={index} todo={todo} index={index} />
        ))}
      </div>

      {todos.length > 0 && (
        <button
          onClick={clearTodos}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}