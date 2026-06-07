// app/page.tsx

"use client";

import { useState } from "react";
import { SortableList } from "@/components/SortableList";
import { KanbanBoard } from "@/components/KanbanBoard";
import { FileUploadZone } from "@/components/FileUploadZone";
import { initialColumns, initialSortableItems } from "@/constants/initial-data";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Column, SortableItem } from "@/types";

export default function Home() {
  const [columns, setColumns] = useLocalStorage<Column[]>("kanban-data", initialColumns);
  const [sortableItems, setSortableItems] = useLocalStorage<SortableItem[]>(
    "sortable-list-data",
    initialSortableItems
  );

  const [resetTrigger, setResetTrigger] = useState(0);

  const resetAllData = () => {
    if (confirm("آیا مطمئنی؟ همه داده‌ها به حالت اولیه برمی‌گردد.")) {
      setColumns(initialColumns);
      setSortableItems(initialSortableItems);
      setResetTrigger((prev) => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            🎯 Drag & Drop Playground
          </h1>
          <p className="text-gray-600">
            پیاده‌سازی حرفه‌ای درگ اند درگ با @dnd-kit در Next.js
          </p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              ✅ React 19
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              ✅ Next.js 15
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              ✅ @dnd-kit/core
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              ✅ TypeScript
            </span>
            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
              ✅ TailwindCSS
            </span>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={resetAllData}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-700 text-sm"
          >
            🔄 ریست همه داده‌ها
          </button>
        </div>

        {/* Three Scenarios Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scenario 1: Sortable List */}
          <div>
            <SortableList items={sortableItems} setItems={setSortableItems} />
          </div>

          {/* Scenario 3: File Upload */}
          <div>
            <FileUploadZone />
          </div>

          {/* Scenario 2: Kanban Board - Full width */}
          <div className="lg:col-span-2">
            <KanbanBoard columns={columns} setColumns={setColumns} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>
            ساخته شده با 💙 با استفاده از @dnd-kkit |{" "}
            <a
              href="https://github.com/YOUR_USERNAME/next-dnd-kit-playground"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              مشاهده در گیت‌هاب
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}