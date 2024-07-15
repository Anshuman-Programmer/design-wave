"use client";

import { useEditor } from "@/feature/editor/hooks/use-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import Navbar from "@/feature/editor/components/navbar";
import Sidebar from "@/feature/editor/components/sidebar";
import Toolbar from "@/feature/editor/components/toolbar";
import Footer from "./footer";
import { ActiveTool } from "../types";
import { ShapeSidebar } from "./shape-sidebar";

const Editor = () => {

    const [activeTool, setActiveTool] = useState<ActiveTool>("select");

    const onChangeActiveTool = useCallback((tool: ActiveTool) => {

        if (tool === "draw") {
            // editor?.enableDrawingMode();
        }

        if (activeTool === "draw") {
            // editor?.disableDrawingMode();
        }

        if (tool === activeTool) {
            return setActiveTool("select");
        }

        setActiveTool(tool);
    }, [activeTool])

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
        return () => { canvas.dispose() }

    }, []);

    return (
        <div className="h-full flex flex-col">
            <Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
            <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
                <Sidebar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
                <ShapeSidebar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
                <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
                    <Toolbar />
                    <div ref={containerRef} className="flex-1 h-full bg-muted">
                        <canvas ref={canvasRef} />
                    </div>
                    <Footer />
                </main>
            </div>

        </div>
    );
};

export default Editor;
