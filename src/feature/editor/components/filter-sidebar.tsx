import {
  ActiveTool,
  Editor,
  filters,
} from "@/feature/editor/types";
import { ToolSidebarClose } from "@/feature/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/feature/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

interface FilterSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const FilterSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FilterSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const [search, setSearch] = useState('')

  const searchedFilters = useMemo(() => {
    return filters.filter(e => e.includes(search))
  }, [search])

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "filter" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Filters"
        description="Apply a filter to selected image"
      />
      <div className="p-4">
        <Input placeholder="Search Filters" onChange={(e) => setSearch(e.target.value)} />
      </div>
      <ScrollArea>
        <div className="p-4 pt-0 space-y-1 border-b">
          {(search !== "" ? searchedFilters : filters).map((filter) => (
            <Button
              key={filter}
              variant="secondary"
              size="lg"
              className="w-full h-16 justify-start text-left"
              onClick={() => editor?.changeImageFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
