"use client";

import { useEditor } from "@/feature/editor/hooks/use-editor";
import { useEffect, useRef } from "react";
import { fabric } from "fabric";

const Editor = () => {
    const { init } = useEditor();

    const canvasRef = useRef(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            controlsAboveOverlay: true,
            preserveObjectStacking: true,
        });

        init({
            initialCanvas: canvas,
            initialContainer: containerRef.current!,
        });
    }, []);

    return (
        <div className="h-full flex flex-col">
            <div ref={containerRef} className="flex-1 h-full bg-muted">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

export default Editor;
