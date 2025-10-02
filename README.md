# Team Resume Builder

## Tech Stack

- React (Vite)
- TypeScript
- React Router

## Styling and Design System

- Tailwind CSS
- Shadcn

## State Management

- Zustand
- Local Storage

## Routing

This project uses a **centralized route management system** built on React Router v7 that keeps all routes, titles, and metadata synchronized across the application.

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
  icon: "⚙️",
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
- `getAllRoutes()` - Get all available routes

This centralized approach ensures your routes stay perfectly synchronized across your entire application.
