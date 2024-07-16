import { useCallback, useMemo, useState } from "react"
import { fabric } from "fabric"
import { useAutoResize } from "./use-auto-resize"
import { BuildEditorProps, CIRCLE_OPTIONS, DIAMOND_OPTIONS, Editor, EditorHookProps, FILL_COLOR, OBJECT_PROTOTYPE_STYLES, RECTANGLE_OPTIONS, STROKE_COLOR, STROKE_DASH_ARRAY, STROKE_WIDTH, TRIANGLE_OPTIONS } from "../types"
import { useCanvasEvents } from "./use-canvas-Events"
import { isTextType } from "../utils"

const buildEditor = ({
    canvas,
    fillColor,
    setFillColor,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    selectedObjects,
    strokeDashArray,
    setStrokeDashArray
}: BuildEditorProps): Editor => {

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
        bringForward: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.bringForward(object);
            });

            canvas.renderAll();
            const workspace = getWorkspace();
            workspace?.sendToBack();
        },
        sendBackwards: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.sendBackwards(object);
            });

            canvas.renderAll();
            const workspace = getWorkspace();
            workspace?.sendToBack();
        },
        getActiveFillColor: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return fillColor;
            }

            const value = selectedObject.get("fill") || fillColor;

            // Currently, gradients & patterns are not supported
            return value as string;
        },
        getActiveStrokeColor: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return strokeColor;
            }

            const value = selectedObject.get("stroke") || strokeColor;

            return value;
        },
        getActiveStrokeWidth: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return strokeWidth;
            }

            const value = selectedObject.get("strokeWidth") || strokeWidth;

            return value;
        },
        getActiveStrokeDashArray: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return strokeDashArray;
            }

            const value = selectedObject.get("strokeDashArray") || strokeDashArray;

            return value;
        },
        getActiveOpacity: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return 1;
            }

            const value = selectedObject.get("opacity") || 1;

            return value;
        },
        changeOpacity: (value: number) => {
            // setFillColor(value);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ opacity: value });
            });
            canvas.renderAll();
        },
        changeFillColor: (value: string) => {
            setFillColor(value);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ fill: value });
            });
            canvas.renderAll();
        },
        changeStrokeColor: (value: string) => {
            setStrokeColor(value);
            canvas.getActiveObjects().forEach((object) => {
                // Text types don't have stroke
                if (isTextType(object.type)) {
                    object.set({ fill: value });
                    return;
                }

                object.set({ stroke: value });
            });
            canvas.freeDrawingBrush.color = value;
            canvas.renderAll();
        },
        changeStrokeWidth: (value: number) => {
            setStrokeWidth(value);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeWidth: value });
            });
            canvas.freeDrawingBrush.width = value;
            canvas.renderAll();
        },
        changeStrokeDashArray: (value: number[]) => {
            setStrokeDashArray(value);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeDashArray: value });
            });
            canvas.renderAll();
        },
        addCircle: () => {
            const object = new fabric.Circle(CIRCLE_OPTIONS)
            addToCanvas(object)
        },
        addSoftRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                rx: 50,
                ry: 50,
                fill: fillColor,
                // stroke: strokeColor,
                // strokeWidth: strokeWidth,
                // strokeDashArray: strokeDashArray,
            });

            addToCanvas(object);
        },
        addRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                fill: fillColor,
                // stroke: strokeColor,
                // strokeWidth: strokeWidth,
                // strokeDashArray: strokeDashArray,
            });

            addToCanvas(object);
        },
        addTriangle: () => {
            const object = new fabric.Triangle({
                ...TRIANGLE_OPTIONS,
                fill: fillColor,
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
                    fill: fillColor,
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
                    fill: fillColor,
                    // stroke: strokeColor,
                    // strokeWidth: strokeWidth,
                    // strokeDashArray: strokeDashArray,
                }
            );
            addToCanvas(object);
        },
        canvas,
        selectedObjects
    } as Editor)
} 


export const useEditor = ({
    clearSelectionCallback
}: EditorHookProps) => {

    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
    const [container, setContainer] = useState<HTMLDivElement | null>(null)
    const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([])
    const [fillColor, setFillColor] = useState(FILL_COLOR)
    const [strokeColor, setStrokeColor] = useState(STROKE_COLOR)
    const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH)
    const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY)

    useAutoResize({
        canvas,
        container
    })

    useCanvasEvents({
        canvas,
        setSelectedObjects,
        clearSelectionCallback
    })

    const editor = useMemo(() => {
        if (canvas) return buildEditor({
            canvas,
            fillColor,
            setFillColor,
            strokeColor,
            setStrokeColor,
            strokeWidth,
            setStrokeWidth,
            selectedObjects,
            strokeDashArray,
            setStrokeDashArray
        } as BuildEditorProps)
        return undefined
    }, [canvas, fillColor, strokeColor, strokeWidth, selectedObjects])

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