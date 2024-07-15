"use client";

import { useEditor } from "@/feature/editor/hooks/use-editor";
import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import Navbar from "@/feature/editor/components/navbar";
import Sidebar from "@/feature/editor/components/sidebar";
import Toolbar from "@/feature/editor/components/toolbar";
import Footer from "./footer";

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
        return () => { canvas.dispose() }

    }, []);

    return (
        <div className="h-full flex flex-col">
            <Navbar />
            <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
                <Sidebar />
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
