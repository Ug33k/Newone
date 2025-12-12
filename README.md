# Next.js 14 Starter

A modern Next.js 14 application with TypeScript, ESLint, Prettier, and essential dependencies for rapid development.

## ✨ Features

- **🚀 Next.js 14** - Latest App Router with Turbopack support
- **🎨 TypeScript** - Full type safety and better development experience
- **📝 ESLint & Prettier** - Code linting and formatting for consistency
- **🔧 State Management** - Zustand for lightweight and powerful state management
- **🖱️ Drag & Drop** - @dnd-kit for accessible drag and drop functionality
- **📅 Date Handling** - date-fns for modern date manipulation
- **🎭 Icons** - Lucide React for beautiful, customizable icons
- **🌙 Dark Mode** - Built-in dark mode support with CSS variables
- **📱 Responsive** - Mobile-first responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Date Utilities**: date-fns
- **Icons**: Lucide React
- **Code Quality**: ESLint, Prettier

## 📁 Project Structure

```
project/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles and CSS variables
├── components/            # Reusable React components
│   ├── TodoList.tsx      # Todo list with basic CRUD
│   ├── DragDropTodo.tsx  # Drag & drop todo component
│   └── TodoItem.tsx      # Individual todo item
├── lib/                   # Utility functions and stores
│   └── store.ts          # Zustand store for state management
├── public/               # Static assets
├── .prettierrc          # Prettier configuration
├── eslint.config.mjs    # ESLint configuration
└── tailwind.config.ts   # Tailwind CSS configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm (recommended)

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

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📖 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for linting errors
- `npm run lint:fix` - Run ESLint with automatic fixes
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier

## 🎯 Demo Components

The homepage includes two demo components showcasing the installed libraries:

### TodoList

A basic todo list implementation using Zustand for state management, demonstrating:

- Adding/removing todos
- Local storage persistence
- Dark mode styling

### DragDropTodo

A drag and drop todo list using @dnd-kit, demonstrating:

- Accessible drag and drop functionality
- Integration with Zustand state
- Custom drag handles and animations

## 🎨 Styling & Theming

The project uses a comprehensive color system with CSS variables in `globals.css`:

- **Primary Colors**: Blue theme with proper contrast ratios
- **Dark Mode**: Automatic dark mode support with CSS media queries
- **Responsive Typography**: Mobile-first responsive text sizing
- **Custom Properties**: Extensible design system with consistent spacing and colors

## 🔧 Configuration

### ESLint

Configured with Next.js recommended rules and TypeScript support in `eslint.config.mjs`.

### Prettier

Configured with Tailwind CSS plugin for consistent code formatting in `.prettierrc`.

### Tailwind CSS

Using Tailwind CSS 4 with custom color variables and responsive design utilities.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Import your project to [Vercel](https://vercel.com/new)
3. Deploy with automatic CI/CD

### Other Platforms

The project is configured to work with any platform that supports Node.js:

- Netlify
- Railway
- Render
- AWS Amplify
- Digital Ocean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) - State management solution
- [@dnd-kit](https://dndkit.com/) - Accessible drag and drop library
- [date-fns](https://date-fns.org/) - Modern date utility library
- [Lucide](https://lucide.dev/) - Beautiful & consistent icons
