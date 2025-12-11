import TodoList from '../components/TodoList';
import DragDropTodo from '../components/DragDropTodo';
import { format } from 'date-fns';

export default function Home() {
  const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js 14 Starter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            A modern Next.js application with TypeScript, ESLint, and Prettier
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentDate}
          </p>
        </header>

        {/* Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Regular Todo List */}
          <div className="order-2 lg:order-1">
            <TodoList />
          </div>

          {/* Drag & Drop Todo */}
          <div className="order-1 lg:order-2">
            <DragDropTodo />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Features Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🚀 Next.js 14
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Latest App Router with Turbopack and modern React features
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🎨 TypeScript
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Full TypeScript support for better development experience
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🔧 State Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Zustand for lightweight and powerful state management
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🖱️ Drag & Drop
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                @dnd-kit for accessible drag and drop functionality
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                📅 Date Handling
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                date-fns for modern and powerful date manipulation
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                📝 Code Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                ESLint and Prettier configured for consistent code style
              </p>
            </div>
          </div>
        </div>

        {/* Scripts Section */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Available Scripts
          </h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-left">
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">npm run dev</span>
                <span className="text-gray-900 dark:text-white">Start development server</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">npm run build</span>
                <span className="text-gray-900 dark:text-white">Build for production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">npm run lint</span>
                <span className="text-gray-900 dark:text-white">Run ESLint</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">npm run format</span>
                <span className="text-gray-900 dark:text-white">Format with Prettier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
