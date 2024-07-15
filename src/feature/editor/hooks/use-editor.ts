import { useCallback } from "react"
import { fabric } from "fabric"
import { OBJECT_PROTOTYPE_STYLES } from "../configs/object-prototype"

export const useEditor = () => {

    const init = useCallback(({
        initialCanvas,
        initialContainer
    }: {
        initialCanvas: fabric.Canvas,
        initialContainer: HTMLDivElement
    }) => {

        fabric.Object.prototype.set(OBJECT_PROTOTYPE_STYLES);

        const initialWorkSpace = new fabric.Rect({
            height: 1200,
            width: 900,
            fill: "white",
            name: "clip",
            selectable: false,
            hasControls: false,
            shadow: new fabric.Shadow({
                color: "rgba(0, 0, 0, 0.8)",
                blur: 5
            })
        })

        initialCanvas.setHeight(initialContainer.offsetHeight)
        initialCanvas.setWidth(initialContainer.offsetWidth)

        initialCanvas.add(initialWorkSpace)
        initialCanvas.centerObject(initialWorkSpace)
        initialCanvas.clipPath = initialWorkSpace

        const test = new fabric.Rect({
            height: 100,
            width: 100,
            fill: "red"
        })

        initialCanvas.add(test)
        initialCanvas.centerObject(test)

    }, [])

    return { init }
}