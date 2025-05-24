# Preschool UI (SWD392)

A React-based Single Page Application for the **Preschool Enrollment System** frontend, built with Vite and modern libraries:

- **Atomic Design** (atoms → molecules → organisms → templates → pages)  
- **React Router v7** with `ProtectedRoute` for route guarding  
- **Redux Toolkit** for global state management (auth, users, etc.)  
- **TanStack Query** (React Query) + **React Query DevTools** for server-state caching and data fetching  
- **React Hook Form** + **Yup** for forms and validation  
- **react-i18next** for multi-language support (EN/VI)  
- **Tailwind CSS** + **MUI** (Material UI) for styling and theming  
- **Lucide Icons** (lightweight SVG icons)  
- **ESLint + Prettier** for consistent code style and linting  
- **useMemo / useCallback** for performance optimizations  
- **Path aliases** (`@/…`) for cleaner imports

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://your-git-server/preschool-ui-swd392.git
cd preschool-ui-swd392

# 2. Install dependencies
npm install
# or
yarn

# 3. Initialize Tailwind CSS (only once)
npm run tw:init

# 4. Start the development server
npm run dev
# Open http://localhost:5173 in your browser
