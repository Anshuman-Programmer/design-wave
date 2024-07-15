import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";

import { ActiveTool, Editor } from "@/feature/editor/types";
import { ShapeTool } from "@/feature/editor/components/shape-tool";
import { ToolSidebarClose } from "@/feature/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/feature/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShapeSidebarProps {
  // editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const ShapeSidebar = ({
  // editor,
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "shapes" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Shapes"
        description="Add shapes to your canvas"
      />
      <ScrollArea>
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool
            // onClick={() => editor?.addCircle()}
            onClick={() => { }}
            icon={FaCircle}
          />
          <ShapeTool
            // onClick={() => editor?.addSoftRectangle()}
            onClick={() => { }}
            icon={FaSquare}
          />
          <ShapeTool
            // onClick={() => editor?.addRectangle()}
            onClick={() => { }}
            icon={FaSquareFull}
          />
          <ShapeTool
            // onClick={() => editor?.addTriangle()}
            onClick={() => { }}
            icon={IoTriangle}
          />
          <ShapeTool
            // onClick={() => editor?.addInverseTriangle()}
            onClick={() => { }}
            icon={IoTriangle}
            iconClassName="rotate-180"
          />
          <ShapeTool
            // onClick={() => editor?.addDiamond()}
            onClick={() => { }}
            icon={FaDiamond}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
