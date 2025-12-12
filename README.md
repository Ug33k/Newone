# Eisenhower Matrix & Kanban Board

A modern task management application built with Next.js 14, allowing you to organize tasks using both Kanban board and Eisenhower Matrix methodologies. This project leverages TypeScript, Tailwind CSS, Zustand, and @dnd-kit for a robust and responsive user experience.

## ✨ Features

- **📊 Dual Views** - Seamlessly switch between Kanban Board and Eisenhower Matrix views
- **🔄 Synchronized State** - Tasks are unified; changing status in Kanban or priority in Matrix updates the single task record
- **🔍 Search & Filter** - Powerful filtering by status, priority (quadrant), and text search
- **📱 Fully Responsive** - Optimized layout for desktop, tablet, and mobile devices with collapsible menus and stacked columns
- **👆 Touch Support** - Full drag-and-drop support for touch screens using `@dnd-kit`
- **💾 Local Persistence** - Tasks are automatically saved to your browser's local storage
- **🎨 Dark Mode** - System-aware dark mode support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit (Core, Sortable, Utilities)
- **Date Utilities**: date-fns
- **Icons**: Lucide React
- **Code Quality**: ESLint, Prettier

## 📁 Project Structure

```
project/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── TaskBoard.tsx       # Main container and state manager
│   ├── Header.tsx          # Navigation, search, and filters
│   ├── KanbanView.tsx      # Kanban board view
│   ├── KanbanColumn.tsx    # Individual Kanban column
│   ├── EisenhowerMatrix.tsx# Eisenhower Matrix view
│   ├── EisenhowerQuadrant.tsx # Individual Matrix quadrant
│   ├── TaskModal.tsx       # Create/Edit task modal
│   └── ...
├── src/
│   ├── store/              # Zustand store (taskStore.ts)
│   ├── types/              # TypeScript definitions (task.ts)
│   └── utils/              # Helper functions
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Kanban Board
- **Workflow**: Organize tasks into "To Do", "In Progress", and "Done" columns.
- **Drag & Drop**: Move tasks between columns to update their status.
- **Filtering**: Use the filter menu to view tasks specific to certain priorities (Quadrants).

### Eisenhower Matrix
- **Prioritization**: Categorize tasks by Urgency and Importance.
  1. **Do First** (Urgent & Important)
  2. **Schedule** (Not Urgent & Important)
  3. **Delegate** (Urgent & Not Important)
  4. **Eliminate** (Not Urgent & Not Important)
- **Drag & Drop**: Move tasks between quadrants to update their priority.

### Managing Tasks
- **Create**: Click the "New Task" button.
- **Edit/Delete**: Use the action buttons on individual task cards.
- **Search**: Use the search bar in the filter menu to find tasks by title or description.

## ⚠️ Limitations

- **Persistence**: Data is stored in the browser's `localStorage`. It does not sync across devices or browsers. Clearing your browser cache will delete your tasks.
- **Backend**: There is no server-side database; this is a client-side only application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.
