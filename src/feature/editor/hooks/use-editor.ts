import { useCallback, useMemo, useState } from "react"
import { fabric } from "fabric"
import { useAutoResize } from "./use-auto-resize"
import { BuildEditorProps, CIRCLE_OPTIONS, DIAMOND_OPTIONS, Editor, OBJECT_PROTOTYPE_STYLES, RECTANGLE_OPTIONS, TRIANGLE_OPTIONS } from "../types"

const buildEditor = ({ canvas }: BuildEditorProps): Editor => {

    const getWorkspace = () => {
        return canvas
            .getObjects()
            .find((object) => object.name === "clip");
    };

    const center = (object: fabric.Object) => {
        const workspace = getWorkspace();
        const center = workspace?.getCenterPoint();

        if (!center) return;

        // @ts-ignore
        canvas._centerObject(object, center);
    };

    const addToCanvas = (object: fabric.Object) => {
        center(object);
        canvas.add(object);
        canvas.setActiveObject(object);
    };

    return ({
        addCircle: () => {
            const object = new fabric.Circle(CIRCLE_OPTIONS)
            addToCanvas(object)
        },
        addSoftRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                rx: 50,
                ry: 50,
                // fill: fillColor,
                // stroke: strokeColor,
                // strokeWidth: strokeWidth,
                // strokeDashArray: strokeDashArray,
            });

            addToCanvas(object);
        },
        addRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                // fill: fillColor,
                // stroke: strokeColor,
                // strokeWidth: strokeWidth,
                // strokeDashArray: strokeDashArray,
            });

            addToCanvas(object);
        },
        addTriangle: () => {
            const object = new fabric.Triangle({
                ...TRIANGLE_OPTIONS,
                // fill: fillColor,
                // stroke: strokeColor,
                // strokeWidth: strokeWidth,
                // strokeDashArray: strokeDashArray,
            });

            addToCanvas(object);
        },
        addInverseTriangle: () => {
            const HEIGHT = TRIANGLE_OPTIONS.height;
            const WIDTH = TRIANGLE_OPTIONS.width;

            const object = new fabric.Polygon(
                [
                    { x: 0, y: 0 },
                    { x: WIDTH, y: 0 },
                    { x: WIDTH / 2, y: HEIGHT },
                ],
                {
                    ...TRIANGLE_OPTIONS,
                    // fill: fillColor,
                    // stroke: strokeColor,
                    // strokeWidth: strokeWidth,
                    // strokeDashArray: strokeDashArray,
                }
            );

            addToCanvas(object);
        },
        addDiamond: () => {
            const HEIGHT = DIAMOND_OPTIONS.height;
            const WIDTH = DIAMOND_OPTIONS.width;

            const object = new fabric.Polygon(
                [
                    { x: WIDTH / 2, y: 0 },
                    { x: WIDTH, y: HEIGHT / 2 },
                    { x: WIDTH / 2, y: HEIGHT },
                    { x: 0, y: HEIGHT / 2 },
                ],
                {
                    ...DIAMOND_OPTIONS,
                    // fill: fillColor,
                    // stroke: strokeColor,
                    // strokeWidth: strokeWidth,
                    // strokeDashArray: strokeDashArray,
                }
            );
            addToCanvas(object);
        },
    } as Editor)
} 

export const useEditor = () => {

    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
    const [container, setContainer] = useState<HTMLDivElement | null>(null)

    useAutoResize({
        canvas,
        container
    })

    const editor = useMemo(() => {
        if (canvas) return buildEditor({ canvas } as BuildEditorProps)
        return undefined
    }, [canvas])

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

        setCanvas(initialCanvas)
        setContainer(initialContainer)

    }, [])

    return { init, editor }
}