import { ChevronsLeft } from "lucide-react";

interface ToolSidebarCloseProps {
  onClick: () => void;
};

export const ToolSidebarClose = ({
  onClick,
}: ToolSidebarCloseProps) => {
  return (
    <button
      onClick={onClick}
      className="absolute -right-[1rem] h-[70px] bg-white top-1/2 transform -translate-y-1/2 flex items-center justify-center rounded-r-xl px-[2px] border-r border-y group"
    >
      <ChevronsLeft className="size-3 text-black group-hover:opacity-75 transition" />
    </button>
  );
};
