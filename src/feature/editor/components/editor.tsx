"use client";

import { useEditor } from "@/feature/editor/hooks/use-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import Navbar from "@/feature/editor/components/navbar";
import Sidebar from "@/feature/editor/components/sidebar";
import Toolbar from "@/feature/editor/components/toolbar";
import Footer from "./footer";
import { ActiveTool, selectionDependentTools } from "../types";
import { ShapeSidebar } from "./shape-sidebar";
import { FillColorSidebar } from "./fill-color-sidebar";
import { StrokeColorSidebar } from "./stroke-color-sidebar";
import { StrokeWidthSidebar } from "./stroke-width-sidebar";
import { OpacitySidebar } from "./opacity-sidebar";
import { TextSidebar } from "./text-sidebar";
import { FontSidebar } from "./font-sidebar";
import { ImageSidebar } from "./image-sidebar";
import { FilterSidebar } from "./filter-sidebar";
import { AiSidebar } from "./ai-sidebar";
import { DrawSidebar } from "./draw-sidebar";
import { SettingsSidebar } from "./settings-sidebar";

const Editor = () => {

    const [activeTool, setActiveTool] = useState<ActiveTool>("select");

    const onClearSelection = useCallback(() => {
        if (selectionDependentTools.includes(activeTool)) setActiveTool("select")
    }, [activeTool])

    const { init, editor } = useEditor({
        clearSelectionCallback: onClearSelection
    });

    const onChangeActiveTool = useCallback((tool: ActiveTool) => {

        if (tool === "draw") {
            editor?.enableDrawingMode();
        }

        if (activeTool === "draw") {
            editor?.disableDrawingMode();
        }

        if (tool === activeTool) {
            return setActiveTool("select");
        }

        setActiveTool(tool);
    }, [activeTool, editor])

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
                <ShapeSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
                <FillColorSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
                <StrokeColorSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
                <StrokeWidthSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
                <OpacitySidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
                <TextSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
                <FontSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
                {activeTool === "images" && <ImageSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />}
                {activeTool === "filter" && <FilterSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />}
                {activeTool === "ai" && <AiSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />}
                {activeTool === "draw" && <DrawSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />}
                {activeTool === "settings" && <SettingsSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />}
                <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
                    <Toolbar
                        editor={editor}
                        activeTool={activeTool}
                        onChangeActiveTool={onChangeActiveTool}
                        key={JSON.stringify(editor?.canvas?.getActiveObject())}
                    />
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
