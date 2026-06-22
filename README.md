# EduVerse (EMA-X Solution)

Welcome to **EduVerse**, a comprehensive, modern, and highly scalable Educational and Community Management System. This project is designed to bridge the gap between academic management and student social life by providing a unified platform for courses, student data, and interactive communities (clubs).

## 📖 Project Overview

EduVerse is a robust frontend application built to manage the core operations of an educational institution while fostering student engagement through communities and clubs. It serves multiple roles (Admin, Staff, Student) with tailored dashboards and access control.

### Key Capabilities:
- **Academic Management:** Manage courses, schedules, student enrollments, and staff assignments.
- **User Management:** Full CRUD operations for Students and Staff members.
- **Interactive Communities (Clubs):** 
  - Admins can create, manage, and delete clubs.
  - Students can explore, join, and leave clubs.
  - Members can create posts, like, and comment on them.
  - Admins can pin important posts and moderate content.
- **Real-time Dashboards:** Analytics, statistics, and tracking for GPAs, enrollments, and club activities.

---

## 🏗️ Project Architecture: Feature-Sliced Design (FSD)

The project strictly follows the **Feature-Sliced Design (FSD)** architectural pattern. This ensures that the codebase is highly modular, scalable, and easy to maintain. The codebase is divided into three main layers:

1. **`src/app` (App Layer):** 
   - The entry point of the application.
   - Contains global providers, global styles (`index.css`), Router configurations, and layout wrappers (e.g., `AuthLayout`, `DashboardLayout`).
2. **`src/modules` (Modules Layer):** 
   - Contains isolated business domains. Each module is self-contained with its own components, pages, hooks, services, and constants.
   - Example modules: `auth`, `dashboard`, `students`, `staff`, `courses`, `communities`.
3. **`src/shared` (Shared Layer):** 
   - Contains reusable, domain-agnostic code.
   - Includes generic UI components (`Modal`, `Button`, etc.), shared hooks, utility functions, and the core HTTP client.
   - **Rule:** The `shared` layer can never import from `modules` or `app`. Dependencies always flow downwards.

---

## 💻 Technologies Used

- **Core:** React 19, Vite 8
- **Styling:** Tailwind CSS v4 (Using custom CSS variables and a sophisticated design system)
- **Routing:** React Router DOM v7
- **Forms & Validation:** React Hook Form, Yup
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Data Fetching & HTTP:** Custom Axios-like Wrapper over the native `fetch` API.

---

## 🔄 Core User Flows & Features

### 1. Authentication Flow
- **Login:** Users log in using their email and password. The backend returns an `auth_token`.
- **OTP Verification & Password Reset:** Complete flow for forgotten passwords.
- **Session Management:** The `auth_token` is stored in `localStorage`. The custom `httpClient` automatically intercepts requests to attach the `Bearer` token. If a `401 Unauthorized` response is received, the user is automatically logged out and redirected to the login page.

### 2. Communities & Clubs Flow
- **Admin View (`/communities`):** Admins see a comprehensive dashboard of all clubs. They can create new clubs, upload club banners, edit details, and configure privacy permissions.
- **Student View (`/student-communities`):** Students browse available clubs. They can filter, search, and click **Join** or **Leave**.
- **Community Details (`/communities/:clubId`):**
  - **Feed:** Displays posts created by members.
  - **Post Actions:** Create posts (with images), edit posts, delete posts.
  - **Interactions:** Toggle likes, add comments, delete comments.
  - **Admin Actions:** Pin/Unpin posts to the top of the feed.

### 3. User Management Flow
- **Students & Staff (`/students`, `/staff`):** Grid/Table views of all registered users. Supports advanced filtering, searching, and pagination.
- **Modals:** Slide-out panels or modals for adding new users or editing existing user data.

---

## 📂 Code Structure & Best Practices

The project strictly follows the **Feature-Sliced Design (FSD)** methodology. This means the codebase is divided into slices (modules) based on business domains, making it highly scalable and predictable.

### 1. High-Level Folder Structure

```text
src/
├── app/                  # Application layer (Global setup)
│   ├── layouts/          # Global layouts (e.g., DashboardLayout, AuthLayout)
│   ├── providers/        # Context providers and error boundaries
│   ├── router/           # React Router configuration
│   └── styles/           # Global styles and tailwind directives
│
├── modules/              # Slices layer (Business domains)
│   ├── auth/             # Authentication domain
│   ├── communities/      # Clubs and social features domain
│   ├── courses/          # Academic courses domain
│   ├── dashboard/        # Analytics and main views domain
│   ├── staff/            # Staff management domain
│   └── students/         # Student management domain
│
└── shared/               # Shared layer (Reusable, domain-agnostic code)
    ├── services/         # Core API wrappers (e.g., httpClient.js)
    ├── ui/               # Generic UI components (Modals, Inputs, Buttons)
    ├── hooks/            # Generic hooks (e.g., useDebounce, useClickOutside)
    └── utils/            # Helper functions (e.g., formatters, validators)
```

### 2. Deep Dive: Inside a Module (e.g., `src/modules/students`)

Every module is treated as an isolated mini-application. A typical module folder contains:

```text
src/modules/students/
├── components/           # UI components specific ONLY to this module
│   ├── StudentCard.jsx   # e.g., A card displaying student details
│   └── EditStudentModal.jsx
│
├── pages/                # Route-level components that assemble the module's views
│   ├── StudentsPage.jsx
│   └── StudentDetailsPage.jsx
│
├── services/             # API calls isolated from the UI
│   └── studentsService.js # Uses httpClient to fetch student data
│
├── hooks/                # Custom hooks for state management and fetching
│   └── useStudents.js    # Manages loading states, pagination, and fetching logic
│
└── constants/            # Hardcoded values, enums, or mock data
    └── studentsConstants.js
```

### 3. Best Practices & Rules Followed

To maintain a clean and scalable architecture, the following rules are strictly enforced:

1. **Strict Dependency Direction:** 
   - `app` can import from `modules` and `shared`.
   - `modules` can import from `shared` but **NEVER** from `app`.
   - A module (e.g., `students`) should **NOT** directly import components from another module (e.g., `staff`). If logic is shared between two modules, it must be moved to the `shared` layer.
2. **Separation of Concerns (Logic vs. UI):**
   - **Pages and Components** are responsible *only* for rendering UI.
   - **Services (`*Service.js`)** handle all network requests using the `httpClient`.
   - **Custom Hooks (`use*.js`)** bridge the gap by managing state, calling the services, and returning loading/error flags to the UI.
3. **The `httpClient.js` Wrapper:**
   - The project uses a custom HTTP wrapper located at `src/shared/services/httpClient.js`.
   - It dynamically reads the `VITE_API_BASE_URL` from `.env`.
   - Automatically injects the `Authorization` header for protected routes.
   - Centralizes error handling and response formatting. Module services simply call `httpClient.get('/path')` without worrying about repetitive headers or token validation logic.

### UI & Styling Aesthetics
The UI is designed to feel highly premium, dynamic, and modern. 
- Extensive use of **Glassmorphism**, subtle gradients, and rounded corners.
- Micro-animations (hover effects, scaling, pulse effects) enhance user engagement.
- Strict adherence to a tailored color palette defined in `index.css`.

---

## 🚀 How to Run the Project Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory and specify the backend URL:
   ```env
   VITE_API_BASE_URL=https://eduverse-production-bc64.up.railway.app
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 🛡️ Future Enhancements
- Integration of real-time web sockets for live post updates and chat.
- Advanced Role-Based Access Control (RBAC) granular permissions.
- Full offline support via Progressive Web App (PWA) strategies.
