"use client"

import { createContext, useContext, type ComponentProps, type CSSProperties, type ReactNode } from "react"
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, type DraggableAttributes } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { toast } from "sonner"
import { TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useCMSStore, type ResourceKey } from "@/lib/store"

type HandleContext = {
  attributes: DraggableAttributes
  listeners: ReturnType<typeof useSortable>["listeners"]
  setActivatorNodeRef: ReturnType<typeof useSortable>["setActivatorNodeRef"]
  disabled: boolean
}

const SortHandleContext = createContext<HandleContext | null>(null)

export function SortableList({ resource, ids, enabled = true, grid = false, children }: {
  resource: ResourceKey
  ids: number[]
  enabled?: boolean
  grid?: boolean
  children: ReactNode
}) {
  const reorder = useCMSStore((state) => state.reorderResource)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const onDragEnd = ({ active: source, over }: DragEndEvent) => {
    if (!enabled || !over || source.id === over.id) return
    void reorder(resource, Number(source.id), Number(over.id))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Could not save the new order"))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={grid ? rectSortingStrategy : verticalListSortingStrategy} disabled={!enabled}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

function useItem(id: number, disabled: boolean) {
  const sortable = useSortable({ id, disabled, transition: { duration: 220, easing: "cubic-bezier(0.2, 0, 0, 1)" } })
  const style: CSSProperties = {
    transform: CSS.Translate.toString(sortable.transform),
    transition: sortable.transition,
    position: "relative",
    zIndex: sortable.isDragging ? 2 : undefined,
    opacity: sortable.isDragging ? 0.8 : undefined,
  }
  const handle = { attributes: sortable.attributes, listeners: sortable.listeners, setActivatorNodeRef: sortable.setActivatorNodeRef, disabled }
  return { setNodeRef: sortable.setNodeRef, style, handle, isDragging: sortable.isDragging }
}

export function SortableTableRow({ itemId, disabled = false, className, style, children, ...props }: ComponentProps<"tr"> & { itemId: number; disabled?: boolean }) {
  const item = useItem(itemId, disabled)
  return (
    <SortHandleContext.Provider value={item.handle}>
      <TableRow ref={item.setNodeRef} style={{ ...style, ...item.style }} className={cn(className, item.isDragging && "bg-background shadow-lg")} {...props}>
        {children}
      </TableRow>
    </SortHandleContext.Provider>
  )
}

export function SortableCard({ itemId, disabled = false, className, style, children, ...props }: ComponentProps<"div"> & { itemId: number; disabled?: boolean }) {
  const item = useItem(itemId, disabled)
  return (
    <SortHandleContext.Provider value={item.handle}>
      <div ref={item.setNodeRef} style={{ ...style, ...item.style }} className={cn(className, item.isDragging && "bg-background shadow-lg")} {...props}>
        {children}
      </div>
    </SortHandleContext.Provider>
  )
}

export function SortHandle({ label = "Drag to reorder" }: { label?: string }) {
  const handle = useContext(SortHandleContext)
  if (!handle || handle.disabled) return null
  return (
    <button
      type="button"
      ref={handle.setActivatorNodeRef}
      {...handle.attributes}
      {...handle.listeners}
      aria-label={label}
      title={label}
      className="inline-flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  )
}
