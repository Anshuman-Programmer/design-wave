import { Dispatch, SetStateAction, useEffect } from "react"

interface UseCanvasEventsProps {
    canvas: fabric.Canvas | null,
    setSelectedObjects: Dispatch<SetStateAction<fabric.Object[]>>,
    clearSelectionCallback?: () => void
}

export const useCanvasEvents = ({ canvas, setSelectedObjects, clearSelectionCallback }: UseCanvasEventsProps) => {
    useEffect(() => {
        if (canvas) {
            canvas.on("selection:created", (e) => {
                setSelectedObjects(e.selected || [])
            })
            canvas.on("selection:updated", (e) => {
                setSelectedObjects(e.selected || [])
            })
            canvas.on("selection:cleared", () => {
                setSelectedObjects([])
                clearSelectionCallback?.()
            })
        }
    }, [canvas, clearSelectionCallback])
}