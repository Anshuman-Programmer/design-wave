import { useCallback, useMemo, useState } from "react"
import { fabric } from "fabric"
import { useAutoResize } from "./use-auto-resize"
import { BuildEditorProps, CIRCLE_OPTIONS, DIAMOND_OPTIONS, Editor, EditorHookProps, FILL_COLOR, FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, fonts, OBJECT_PROTOTYPE_STYLES, RECTANGLE_OPTIONS, STROKE_COLOR, STROKE_DASH_ARRAY, STROKE_WIDTH, TEXT_OPTIONS, TRIANGLE_OPTIONS } from "../types"
import { useCanvasEvents } from "./use-canvas-Events"
import { isTextType } from "../utils"
import { ITextOptions } from "fabric/fabric-impl"

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
    setStrokeDashArray,
    fontFamily,
    setFontFamily
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
        delete: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.remove(object);
            });
            canvas.discardActiveObject()
            canvas.renderAll()
        },
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
        getActiveFontFamily: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return FONT_FAMILY;
            }
            // @ts-ignore
            const value = selectedObject.get("fontFamily") || fontFamily;

            return value;
        },
        getActiveFontWeight: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return FONT_WEIGHT;
            }
            // @ts-ignore
            const value = selectedObject.get("fontWeight") || FONT_WEIGHT;

            return value;
        },
        getActiveFontUnderline: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return 'normal';
            }
            // @ts-ignore
            const value = selectedObject.get("underline") || false;

            return value;
        },
        getActiveFontStyle: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return 'normal';
            }
            // @ts-ignore
            const value = selectedObject.get("fontStyle") || 'normal';

            return value;
        },
        getActiveFontLinethrough: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return 'normal';
            }
            // @ts-ignore
            const value = selectedObject.get("linethrough") || false;

            return value;
        },
        getActiveTextAlign: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return 'start';
            }
            // @ts-ignore
            const value = selectedObject.get("textAlign") || "start";

            return value;
        },
        getActiveFontSize: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return FONT_SIZE;
            }
            // @ts-ignore
            const value = selectedObject.get("fontSize") || FONT_SIZE;

            return value;
        },
        changeOpacity: (value: number) => {
            // setFillColor(value);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ opacity: value });
            });
            canvas.renderAll();
        },
        changeFontFamily: (value: string) => {
            setFontFamily(value);
            canvas.getActiveObjects().forEach((object) => {
                //@ts-ignore
                if (isTextType(object.type)) object.set({ fontFamily: value });
            });
            canvas.renderAll();
        },
        changeFontWeight: (value) => {
            canvas.getActiveObjects().forEach((object) => {
                //@ts-ignore
                if (isTextType(object.type)) object.set({ fontWeight: value });
            });
            canvas.renderAll();
        },
        changeFontStyle: (value) => {
            canvas.getActiveObjects().forEach((object) => {
                //@ts-ignore
                if (isTextType(object.type)) object.set({ fontStyle: value });
            });
            canvas.renderAll();
        },
        changeFontUnderline: (value: boolean) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    // @ts-ignore
                    // Faulty TS library, underline exists.
                    object.set({ underline: value });
                }
            });
            canvas.renderAll();
        },
        changeFontLinethrough: (value: boolean) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    // @ts-ignore
                    // Faulty TS library, linethrough exists.
                    object.set({ linethrough: value });
                }
            });
            canvas.renderAll();
        },
        changeTextAlign: (value: ITextOptions["textAlign"]) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    // @ts-ignore
                    // Faulty TS library, linethrough exists.
                    object.set({ textAlign: value });
                }
            });
            canvas.renderAll();
        },
        changeFontSize: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    // @ts-ignore
                    // Faulty TS library, linethrough exists.
                    object.set({ fontSize: value });
                }
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
        addImage: (value: string) => {
            fabric.Image.fromURL(
                value,
                (image) => {
                    const workspace = getWorkspace();

                    image.scaleToWidth(workspace?.width || 0);
                    image.scaleToHeight(workspace?.height || 0);

                    addToCanvas(image);
                },
                {
                    crossOrigin: "anonymous",
                },
            );
        },
        addText: (value, options) => {
            const object = new fabric.Textbox(value, {
                ...TEXT_OPTIONS,
                fill: fillColor,
                ...options,
            });

            addToCanvas(object);
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
    const [fontFamily, setFontFamily] = useState(FONT_FAMILY)

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
            setStrokeDashArray,
            fontFamily,
            setFontFamily,
        } as BuildEditorProps)
        return undefined
    }, [canvas, fillColor, strokeColor, strokeWidth, selectedObjects, fontFamily])

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