'use client'

import { useState } from 'react'
import { Plus, LayoutGrid, Columns, Search, Filter } from 'lucide-react'
import { KanbanStatus, EisenhowerQuadrant, FilterState } from '../src/types/task'

type ViewType = 'kanban' | 'matrix'

interface HeaderProps {
  view: ViewType
  setView: (view: ViewType) => void
  onFilterChange: (filters: FilterState) => void
  onCreateTask: () => void
}

export default function Header({ view, setView, onFilterChange, onCreateTask }: HeaderProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<KanbanStatus[]>([])
  const [selectedQuadrants, setSelectedQuadrants] = useState<EisenhowerQuadrant[]>([])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    onFilterChange({ search: value, statuses: selectedStatuses, quadrants: selectedQuadrants })
  }

  const toggleStatus = (status: KanbanStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]
    setSelectedStatuses(newStatuses)
    onFilterChange({ search, statuses: newStatuses, quadrants: selectedQuadrants })
  }

  const toggleQuadrant = (quadrant: EisenhowerQuadrant) => {
    const newQuadrants = selectedQuadrants.includes(quadrant)
      ? selectedQuadrants.filter((q) => q !== quadrant)
      : [...selectedQuadrants, quadrant]
    setSelectedQuadrants(newQuadrants)
    onFilterChange({ search, statuses: selectedStatuses, quadrants: newQuadrants })
  }

  const formatQuadrant = (q: string) => {
    return q
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            {view === 'kanban' ? 'Kanban Board' : 'Eisenhower Matrix'}
          </h1>
          <p className="mt-2 text-sm text-gray-600 md:text-base dark:text-gray-400">
            {view === 'kanban'
              ? 'Organize your tasks by status'
              : 'Prioritize tasks by urgency and importance'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <div className="flex rounded-lg bg-white p-1 shadow-sm dark:bg-gray-800">
            <button
              onClick={() => setView('kanban')}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                view === 'kanban'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              <Columns size={18} />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setView('matrix')}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                view === 'matrix'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutGrid size={18} />
              <span className="hidden sm:inline">Matrix</span>
            </button>
          </div>

          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              isFiltersOpen
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <button
            onClick={onCreateTask}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {isFiltersOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-9 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</h3>
              <div className="flex flex-wrap gap-2">
                {Object.values(KanbanStatus).map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedStatuses.includes(status)
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Quadrant</h3>
              <div className="flex flex-wrap gap-2">
                {Object.values(EisenhowerQuadrant).map((quadrant) => (
                  <button
                    key={quadrant}
                    onClick={() => toggleQuadrant(quadrant)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedQuadrants.includes(quadrant)
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {formatQuadrant(quadrant)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
