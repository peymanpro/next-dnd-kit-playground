# 🎯 next-dnd-kit-playground
A complete and professional project showcasing Drag and Drop capabilities using @dnd-kit/core in Next.js 15.

 Features
Sortable List – Drag and reorder items in a vertical list

Kanban Board – Move tasks between columns + reorder within each column

 File Upload – Drag-and-drop zone for image uploads with validation

Touch Support – Fully responsive and compatible with mobile and tablets

Auto-Save – All data is persisted to localStorage

TypeScript – Full type definitions for better development

Smooth Animations – Great UX with DragOverlay

Technologies
Next.js 15 (App Router)

React 19

@dnd-kit/core v6

@dnd-kit/sortable

TypeScript

TailwindCSS

Installation & Running
bash
git clone https://github.com/YOUR_USERNAME/next-dnd-kit-playground.git
cd next-dnd-kit-playground
npm install
npm run dev

 Project Structure
text
next-dnd-kit-playground/
├── app/                 # Main page and layout
├── components/          # React components
│   ├── ui/             # Base UI components
│   ├── SortableList.tsx
│   ├── KanbanBoard.tsx
│   └── FileUploadZone.tsx
├── hooks/              # Custom hooks
├── types/              # TypeScript types
├── constants/          # Initial data
└── utils/              # Helper functions

Key @dnd-kit Concepts
DndContext – The main provider for drag-and-drop functionality

useSortable – For sortable items

useDroppable – For drop zones

SortableContext – Manages sortable items

DragOverlay – Displays a preview while dragging

