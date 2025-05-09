declare module 'vue-draggable-resizable' {
  import { DefineComponent } from 'vue'

  interface VueDraggableResizableProps {
    className?: string
    classNameActive?: string
    classNameHandle?: string
    classNameDraggable?: string
    classNameResizable?: string
    classNameDragging?: string
    classNameResizing?: string
    disableUserSelect?: boolean
    enableNativeDrag?: boolean
    preventDeactivation?: boolean
    active?: boolean
    draggable?: boolean
    resizable?: boolean
    lockAspectRatio?: boolean
    w?: number | string
    h?: number | string
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    x?: number
    y?: number
    z?: string | number
    handles?: string[]
    axis?: 'x' | 'y' | 'both'
    grid?: number[]
    parent?: boolean
    dragHandle?: string | null
    dragCancel?: string
    scale?: number | number[]
    onDragStart?: Function
    onDrag?: Function
    onResizeStart?: Function
    onResize?: Function
  }

  export interface VueDraggableResizableEmits {
    activated: () => void
    deactivated: () => void
    dragging: (left: number, top: number) => void
    dragstop: (left: number, top: number) => void
    resizing: (left: number, top: number, width: number, height: number) => void
    resizestop: (left: number, top: number, width: number, height: number) => void
  }

  const VueDraggableResizable: DefineComponent<VueDraggableResizableProps, {}, any>
  export default VueDraggableResizable
}
