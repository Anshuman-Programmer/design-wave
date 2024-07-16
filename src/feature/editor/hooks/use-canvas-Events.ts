import { Dispatch, SetStateAction, useEffect } from "react"

interface UseCanvasEventsProps {
    canvas: fabric.Canvas | null,
    setSelectedObjects: Dispatch<SetStateAction<fabric.Object[]>>
}

export const useCanvasEvents = ({ canvas, setSelectedObjects }: UseCanvasEventsProps) => {
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
            })
        }
    }, [canvas])
}