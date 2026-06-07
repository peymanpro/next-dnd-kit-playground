/**
 * SortableList Component
 * 
 * A fully interactive sortable list component that allows drag-and-drop reordering of items.
 * 
 * @description This component provides a complete sortable list experience with:
 * - Drag-and-drop reordering of list items using @dnd-kit/core and @dnd-kit/sortable
 * - Keyboard accessibility for drag-and-drop operations
 * - Visual feedback during drag with activation constraints (8px movement required)
 * - Automatic array reordering using arrayMove utility
 * - Vertical list sorting strategy for natural list behavior
 * - Memoized sensor configuration for performance optimization
 * - Wrapped in Card component for consistent UI styling
 * 
 * @dependencies
 * - @dnd-kit/core for core drag-and-drop functionality
 * - @dnd-kit/sortable for sortable list capabilities (arrayMove, SortableContext, verticalListSortingStrategy)
 * - SortableItem component for rendering individual draggable items
 * - Card component for consistent container styling
 * 
 * @props
 * - items: Array of SortableItemType objects containing id and title properties
 * - setItems: State setter function to update the items array after reordering
 * 
 * @drag-and-drop behavior
 * - PointerSensor with activationConstraint.distance: 8px prevents accidental drags on click/tap
 * - KeyboardSensor enables accessible drag-and-drop via keyboard navigation
 * - closestCenter collision detection determines the closest droppable area
 * - handleDragEnd compares active.id with over.id to determine if reordering is needed
 * - arrayMove utility efficiently reorders items without mutating original array
 * - SortableContext uses verticalListSortingStrategy for vertical list layout
 * 
 * @accessibility
 * - KeyboardSensor provides full keyboard accessibility for drag-and-drop
 * - Distance activation constraint improves touch device usability
 * 
 * @performance
 * - useSensors hook memoizes sensor configuration
 * - Efficient re-renders using proper key props on SortableItem components
 * - arrayMove creates new array reference only when order actually changes
 * 
 * @styling
 * - Card component provides consistent container styling (padding, shadows, rounded corners)
 * - space-y-2 adds consistent spacing between sortable items
 * - Title and description provide clear user instructions in Persian
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
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { SortableItem as SortableItemType } from "@/types";
import { Card } from "./ui/Card";

interface SortableListProps {
  items: SortableItemType[];
  setItems: (items: SortableItemType[]) => void;
}

export function SortableList({ items, setItems }: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to activate drag (prevents accidental drag on click)
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">📋 مرتب‌سازی لیست با درگ</h2>
      <p className="text-sm text-gray-500 mb-4">آیتم‌ها را بکشید و جابجا کنید</p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item, index) => (
              <SortableItem key={item.id} id={item.id} title={item.title} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Card>
  );
}