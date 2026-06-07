/**
 * KanbanBoard Component
 * 
 * A fully interactive Kanban board implementation using @dnd-kit for drag-and-drop functionality.
 * 
 * @description This component provides a complete Kanban board experience with:
 * - Drag-and-drop reordering of tasks within the same column
 * - Drag-and-drop movement of tasks between different columns
 * - Visual drag overlay showing the task being dragged
 * - Keyboard accessibility for drag operations
 * - Smooth drop animations with opacity feedback
 * - Column-based sorting contexts for vertical list organization
 * 
 * @dependencies
 * - @dnd-kit/core for core drag-and-drop functionality
 * - @dnd-kit/sortable for list sorting capabilities
 * - KanbanColumn component for rendering individual columns
 * - KanbanTask component for rendering individual tasks
 * - Card component for consistent styling
 * 
 * @props
 * - columns: Array of ColumnType objects containing tasks
 * - setColumns: State setter function to update columns
 * 
 * @state
 * - activeTask: Currently dragged task for overlay display
 * - activeColumnId: Source column ID of the dragged task
 * 
 * @drag-and-drop logic
 * - DragStart: Captures the task being dragged and its source column
 * - DragOver: Handles real-time task movement between columns
 * - DragEnd: Finalizes reordering within the same column
 * - PointerSensor with activationConstraint (8px distance) prevents accidental drags
 * 
 * @performance
 * - Uses useCallback for event handlers to prevent unnecessary re-renders
 * - DragOverlay only renders when a task is actively being dragged
 * 
 * @accessibility
 * - KeyboardSensor enables keyboard-based drag-and-drop
 * - Visual feedback during drag operations (opacity: 0.5 on source)
 * - Rotate effect on overlay for better visual distinction
 */

"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useState, useCallback } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { Task, Column as ColumnType } from "@/types";
import { Card } from "./ui/Card";
import { KanbanTask } from "./KanbanTask";

interface KanbanBoardProps {
  columns: ColumnType[];
  setColumns: (columns: ColumnType[]) => void;
}

export function KanbanBoard({ columns, setColumns }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskData = active.data.current as { task?: Task; columnId?: string };
    if (taskData?.task) {
      setActiveTask(taskData.task);
      setActiveColumnId(taskData.columnId || null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // پیدا کردن تسک فعال
    let activeTaskData = null;
    let sourceColumnId = null;

    for (const column of columns) {
      const found = column.tasks.find((t) => t.id === activeId);
      if (found) {
        activeTaskData = found;
        sourceColumnId = column.id;
        break;
      }
    }

    if (!activeTaskData || !sourceColumnId) return;

    // پیدا کردن ستون مقصد
    let destinationColumnId = null;

    // آیا روی ستون رها شده؟
    const overColumn = columns.find((c) => c.id === overId);
    if (overColumn) {
      destinationColumnId = overColumn.id;
    } else {
      // آیا روی تسک دیگری رها شده؟
      for (const column of columns) {
        const found = column.tasks.find((t) => t.id === overId);
        if (found) {
          destinationColumnId = column.id;
          break;
        }
      }
    }

    if (!destinationColumnId || sourceColumnId === destinationColumnId) return;

    // انتقال تسک بین ستون‌ها
    const sourceColumn = columns.find((c) => c.id === sourceColumnId);
    const destColumn = columns.find((c) => c.id === destinationColumnId);

    if (sourceColumn && destColumn) {
      const taskToMove = sourceColumn.tasks.find((t) => t.id === activeId);
      if (taskToMove) {
        const newColumns = columns.map((col) => {
          if (col.id === sourceColumnId) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== activeId) };
          }
          if (col.id === destinationColumnId) {
            return { ...col, tasks: [...col.tasks, taskToMove] };
          }
          return col;
        });
        setColumns(newColumns);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);
    setActiveColumnId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // مرتب‌سازی داخل یک ستون
    let columnId = null;
    let tasksInColumn = null;

    for (const column of columns) {
      const found = column.tasks.find((t) => t.id === activeId);
      if (found) {
        columnId = column.id;
        tasksInColumn = [...column.tasks];
        break;
      }
    }

    if (columnId && tasksInColumn) {
      const oldIndex = tasksInColumn.findIndex((t) => t.id === activeId);
      let newIndex = tasksInColumn.findIndex((t) => t.id === overId);

      // اگر روی ستون رها شده
      if (newIndex === -1 && columns.some((c) => c.id === overId)) {
        return; // انتقال بین ستون‌ها قبلاً در dragOver انجام شده
      }

      if (newIndex !== -1 && oldIndex !== newIndex) {
        const newTasks = arrayMove(tasksInColumn, oldIndex, newIndex);
        const newColumns = columns.map((col) =>
          col.id === columnId ? { ...col, tasks: newTasks } : col
        );
        setColumns(newColumns);
      }
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <Card className="p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🎯 تخته کانبان</h2>
      <p className="text-sm text-gray-500 mb-4">تسک‌ها را بین ستون‌ها بکشید و داخل هر ستون مرتب کنید</p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 pb-4">
          {columns.map((column) => (
            <SortableContext
              key={column.id}
              items={column.tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn column={column} tasks={column.tasks} />
            </SortableContext>
          ))}
        </div>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? (
            <div className="p-3 bg-white rounded-lg shadow-lg border-2 border-blue-400 rotate-3">
              <KanbanTask task={activeTask} columnId={activeColumnId || ""} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}