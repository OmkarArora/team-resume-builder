# Team Resume Builder

A modern React application for creating, viewing, and editing resumes with a clean, professional interface.

## Tech Stack

- React (Vite)
- TypeScript
- React Router
- Tailwind CSS
- Shadcn/ui
- Lucide React
- Zustand (State Management)

## Features

- **Resume Management**: Create, view, and edit resumes
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Form State Management**: Efficient state handling with useReducer
- **TypeScript**: Full type safety throughout the application

## State Management

- **Global State**: Zustand store with localStorage persistence
- **Form State**: useReducer for efficient form state management
- **Data Persistence**: Automatic localStorage caching with Zustand middleware

## Routing

This project uses a **centralized route management system** built on React Router that keeps all routes, titles, and metadata synchronized across the application.

### 🏗️ **Architecture**

The routing system is built around a single source of truth configuration file (`src/lib/routes.tsx`) that defines:

- **Route paths** - URL paths for navigation
- **Page titles** - Display names for headers and navigation
- **React components** - Components to render for each route
- **Metadata** - Icons, descriptions, and other route information

### 📁 **Key Files**

- `src/lib/routes.tsx` - Central route configuration
- `src/main.tsx` - React Router setup and route rendering
- `src/components/site-header.tsx` - Dynamic page titles
- `src/components/app-sidebar.tsx` - Navigation menu generation

### 🎯 **Current Routes**

#### Main Routes

- `/` - Dashboard (displays all resumes)
- `/team` - Team management and collaboration

#### Resume Routes

- `/resume/:id` - View a specific resume
- `/resume/:id/edit` - Edit a specific resume

### 🔧 **How It Works**

1. **Route Configuration**: All routes are defined in `routeConfig` array
2. **Automatic Synchronization**: Changes propagate to all components automatically
3. **Type Safety**: TypeScript ensures consistency across the application
4. **Utility Functions**: Helper functions for working with routes

### ✨ **Benefits**

- **Single Source of Truth**: Add routes in one place, they appear everywhere
- **Type Safety**: TypeScript prevents route-related errors
- **Easy Maintenance**: No manual updates across multiple files
- **Consistent Naming**: Titles and paths stay synchronized
- **Developer Experience**: Clean, maintainable code structure

### 🚀 **Adding New Routes**

To add a new route, simply update the `routeConfig` array in `src/lib/routes.tsx`:

```typescript
{
  path: "/settings",
  title: "Settings",
  element: <SettingsComponent />,
  icon: <IconSettings />,
  description: "Application settings"
}
```

The route will automatically appear in:

- ✅ Sidebar navigation
- ✅ Page header title
- ✅ React Router routing

### 🎯 **Route Management**

The system provides utility functions for working with routes:

- `getRouteTitle(path)` - Get display title for a route
- `getRouteByPath(path)` - Get full route configuration

This centralized approach ensures your routes stay perfectly synchronized across your entire application.

## Zustand Store

The application uses **Zustand** for global state management with **localStorage persistence** for data caching.

### 🏪 **Store Features**

- **Persistent Storage**: Automatic localStorage caching with Zustand middleware
- **Type Safety**: Full TypeScript support with typed actions
- **Performance**: Optimized selectors and minimal re-renders
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Nested Updates**: Support for updating work experience, education, and skills

### 📁 **Store Files**

- `src/lib/store.ts` - Main Zustand store configuration
- `src/lib/hooks.ts` - Custom hooks for store operations and utilities

### 🔧 **Store Actions**

```typescript
// Resume CRUD
addResume(resumeData);
updateResume(id, resumeData);
deleteResume(id);
getResume(id);

// Work Experience
addWorkExperience(resumeId, experience);
updateWorkExperience(resumeId, experienceId, experience);
removeWorkExperience(resumeId, experienceId);

// Education
addEducation(resumeId, education);
updateEducation(resumeId, educationId, education);
removeEducation(resumeId, educationId);

// Skills
addSkill(resumeId, skill);
updateSkill(resumeId, skillId, skill);
removeSkill(resumeId, skillId);
```

### 🔄 **Data Persistence**

- **Automatic**: Data is automatically saved to localStorage
- **Selective**: Only resumes and currentResume are persisted (not loading/error states)
- **Export/Import**: Built-in utilities for data backup and restore

## Components

### Pages

- **Dashboard** (`/pages/Dashboard.tsx`) - Main landing page showing resume list
- **ResumeList** (`/pages/ResumeList.tsx`) - Displays all resumes in a grid layout
- **ResumeView** (`/pages/ResumeView.tsx`) - Shows detailed resume information
- **ResumeEdit** (`/pages/ResumeEdit.tsx`) - Edit resume using the ResumeForm component

### Forms

- **ResumeForm** (`/components/resume/ResumeForm.tsx`) - Comprehensive form for creating/editing resumes
  - Uses useReducer for efficient state management
  - Supports work experience, education, and skills sections
  - Real-time form validation and error handling

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5174` (or the port shown in terminal)

## Project Structure

```
src/
├── components/
│   ├── resume/
│   │   └── ResumeForm.tsx      # Main resume form component
│   ├── ui/                     # Reusable UI components
│   └── ...
├── pages/
│   ├── Dashboard.tsx           # Main dashboard
│   ├── ResumeList.tsx          # Resume listing page
│   ├── ResumeView.tsx          # Resume viewing page
│   └── ResumeEdit.tsx          # Resume editing page
├── lib/
│   ├── store.ts                # Zustand store configuration
│   ├── hooks.ts                # Custom hooks for store operations
│   ├── routes.tsx              # Route configuration
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Utility functions
└── ...
```

## Future Enhancements

- [ ] Add resume templates
- [ ] PDF export functionality
- [ ] Resume sharing capabilities
- [ ] User authentication
- [ ] Resume analytics
- [ ] Collaborative editing
