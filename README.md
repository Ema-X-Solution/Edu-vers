# EduVerse 🎓 (إديو فيرس)

EduVerse is a premium, Figma-compliant, and state-of-the-art school management administrative platform. It provides an intuitive workspace for administrative controllers to monitor student lists, manage academic staff, track registrations, review grade entries, and inspect core dashboard overview charts.

The application is engineered with **Feature-Sliced Design (FSD)** architecture and uses the cutting-edge **Tailwind CSS v4** layout engine, **React 19**, and **Vite 8**.

---

## 📖 Complete Technical Documentation
For an in-depth exploration of the project's folder layout, Feature-Sliced Design layers, custom UI atoms, services configuration, form validation patterns, routing matrices, dynamic charts, and design tokens, please refer to our dedicated technical guide:

👉 **[TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)**

---

## 🚀 Key Architectural Strengths
* **Strict Feature-Sliced Design (FSD)**: Guarantees decoupled dependencies across `app`, `modules`, and `shared` layers.
* **Tailwind CSS v4 Engine**: Pre-configured variables inside `@theme` in `src/index.css` for Cairo, Inter fonts, emerald teal (`#15B392`) brand colors, and dynamic keyframe animations.
* **Dynamic Analytics Panel**: Highly interactive charts and metrics cards styled directly from Figma layouts.
* **Robust CRUD Operations**: Student registries complete with search debounce handlers and pagination logic.
* **Application Resilience**: Pre-configured `ErrorBoundary` system to capture JS errors during rendering cycles.

---

## 🛠️ Quick Start Guide

### 1. Installation
Install project dependencies from the repository root:
```bash
npm install
```

### 2. Environment Variables Configuration
Setup your backend API URL. Create a `.env` or `.env.local` file:
```env
VITE_API_BASE_URL=https://api.eduverse.com/v1
```

### 3. Running Locally
Run the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### 4. Compiling Production Build
Build optimized production assets inside the `/dist` directory:
```bash
npm run build
```

---

## 📂 Project Layers Overview

* **`src/app/`**: Global initialization (routing entry `AppRouter.jsx`, global layouts, mounting script `main.jsx`, styling `index.css`).
* **`src/modules/`**: Discrete feature components (`auth` for registration/login flows, `dashboard` for visual analytics charts, `students` for register tables).
* **`src/shared/`**: Generic atomic components, custom hooks (`useDebounce`, `useLocalStorage`), network layers (`httpClient.js` fetch wrapper), and global path constants (`appConstants.js`).
