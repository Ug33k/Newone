import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  todos: string[];
  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  addTodo: (todo: string) => void;
  removeTodo: (index: number) => void;
  clearTodos: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'light',
      todos: [],
      
      setUser: (user) => set({ user }),
      
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      
      addTodo: (todo) =>
        set((state) => ({
          todos: [...state.todos, todo],
        })),
      
      removeTodo: (index) =>
        set((state) => ({
          todos: state.todos.filter((_, i) => i !== index),
        })),
      
      clearTodos: () => set({ todos: [] }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        todos: state.todos,
      }),
    }
  )
);