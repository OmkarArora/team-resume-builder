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
- [shadcn/ui Chart](https://ui.shadcn.com/docs/components/radix/chart) (Recharts-based: `ChartContainer`, tooltips, legends)
- @react-pdf/renderer (PDF Generation)
- Vitest, React Testing Library (tests)

## Features

- **Resume Management**: Create, view, and edit resumes
- **PDF Export**: Generate and download professional PDF resumes
- **PDF Preview**: Preview PDFs in new browser tabs
- **Team Management**: Organize team members and link resumes
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Form State Management**: Efficient state handling with useReducer
- **TypeScript**: Full type safety throughout the application
- **Insights & analytics**: Dashboard KPIs and activity chart; `/insights` for tables and demo pipeline totals; per-resume insights (completion, word counts, activity log); team comparison chart (derived + illustrative pipeline metrics)

## State Management

- **Global State**: Zustand store with localStorage persistence
- **Form State**: useReducer for efficient form state management
- **Data Persistence**: Automatic localStorage caching with Zustand middleware
- **Resume activity log**: Appended on create/update and section edits (capped list) for timelines on the resume view
- **Analytics**: Derived client-side in `src/lib/resume-analytics.ts` (word counts, completion score, weekly activity buckets, team rows)

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

- `/` - Dashboard (displays all resumes, summary KPIs, activity chart)
- `/team` - Team management and collaboration
- `/insights` - Resume and team analytics

#### Resume Routes

- `/resume/new` - Create a new resume
- `/resume/:id` - View a specific resume
- `/resume/:id/edit` - Edit a specific resume

#### Team Routes

- `/team` - Team management and collaboration
- `/team/:id` - View individual team member

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

## Testing

```bash
pnpm run test        # single run (CI)
pnpm run test:watch  # watch mode
```

Unit tests cover analytics helpers in `src/lib/resume-analytics.test.ts`.

## CI

GitHub Actions runs lint, build, and tests on push and pull requests (see `.github/workflows/ci.yml`).

## Zustand Store

The application uses **Zustand** for global state management with **localStorage persistence** for data caching.

### 🏪 **Store Features**

- **Persistent Storage**: Automatic localStorage caching with Zustand middleware
- **Type Safety**: Full TypeScript support with typed actions
- **Performance**: Optimized selectors and minimal re-renders
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Nested Updates**: Support for updating work experience, education, and skills
- **Activity log**: Each resume can store a short chronological log of edits (used in Insights card)

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
- **ResumeNew** (`/pages/ResumeNew.tsx`) - Create new resume form
- **ResumeView** (`/pages/ResumeView.tsx`) - Shows detailed resume information with PDF export
- **ResumeEdit** (`/pages/ResumeEdit.tsx`) - Edit resume using the ResumeForm component
- **Team** (`/pages/Team.tsx`) - Team management and collaboration
- **TeamMember** (`/pages/TeamMember.tsx`) - Individual team member view
- **Insights** (`/pages/Insights.tsx`) - Org-wide stats, per-resume table, demo pipeline chart

### Forms

- **ResumeForm** (`/components/resume/ResumeForm.tsx`) - Comprehensive form for creating/editing resumes
  - Uses useReducer for efficient state management
  - Supports work experience, education, and skills sections
  - Real-time form validation and error handling

### PDF Components

- **ResumePDFDocument** (`/components/resume/pdf/ResumePDFDocument.tsx`) - PDF document template
  - Professional two-column layout
  - Built-in Helvetica font for reliability
  - Responsive design for A4 format
  - Clean, modern styling

### Team Components

- **AddMemberDialog** (`/components/team/AddMemberDialog.tsx`) - Add new team members
- **TeamComparisonChart** (`/components/team/TeamComparisonChart.tsx`) - Bar chart comparing members
- **ResumeList** (`/components/resume/ResumeList.tsx`) - Resume grid display with actions
- **ResumeInsightsCard** (`/components/resume/ResumeInsightsCard.tsx`) - Completion, word counts, activity on resume view
- **DashboardSummaryStrip** / **DashboardActivityChart** (`/components/dashboard/`) - Dashboard analytics

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
│   │   ├── ResumeForm.tsx
│   │   ├── ResumeList.tsx
│   │   ├── ResumeInsightsCard.tsx
│   │   └── pdf/
│   │       └── ResumePDFDocument.tsx
│   ├── team/
│   │   ├── AddMemberDialog.tsx
│   │   └── TeamComparisonChart.tsx
│   ├── dashboard/
│   │   ├── DashboardSummaryStrip.tsx
│   │   └── DashboardActivityChart.tsx
│   ├── ui/                     # Reusable UI components
│   └── ...
├── pages/
│   ├── Dashboard.tsx           # Main dashboard
│   ├── ResumeNew.tsx          # Create new resume
│   ├── ResumeView.tsx         # Resume viewing with PDF export
│   ├── ResumeEdit.tsx         # Resume editing page
│   ├── Team.tsx               # Team management
│   ├── TeamMember.tsx         # Individual team member view
│   └── Insights.tsx           # Analytics page
├── lib/
│   ├── resume-analytics.ts    # Word count, completion, aggregates
│   ├── store.ts                # Zustand store configuration
│   ├── hooks.ts                # Custom hooks for store operations
│   ├── pdfExport.tsx           # PDF generation utilities
│   ├── routes.tsx              # Route configuration
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Utility functions
└── ...
```

## PDF Export Features

The application includes comprehensive PDF export functionality:

### PDF Generation

- **Professional Layout**: Two-column design with clean typography
- **Built-in Fonts**: Uses Helvetica for reliable rendering across all systems
- **Responsive Design**: Optimized for A4 paper format
- **Complete Data**: Includes all resume sections (experience, education, skills)

### PDF Actions

- **Preview**: Opens PDF in new browser tab for review
- **Download**: Direct download with formatted filename
- **Error Handling**: Graceful fallbacks for popup blockers and generation errors

### Technical Implementation

- **@react-pdf/renderer**: Industry-standard PDF generation library
- **Blob URLs**: Efficient memory management with automatic cleanup
- **Type Safety**: Full TypeScript support for PDF components

## Future Enhancements

- [x] PDF export functionality ✅
- [ ] Add resume templates
- [ ] Resume sharing capabilities
- [ ] User authentication
- [ ] Resume analytics
- [ ] Collaborative editing
- [ ] Multiple PDF themes
- [ ] Batch PDF generation
