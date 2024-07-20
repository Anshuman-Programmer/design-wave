import { Minus, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
};

export const FontSizeInput = ({
  value,
  onChange,
}: FontSizeInputProps) => {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange(value - 1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = isNaN(Number(e.target.value)) ? 0 : parseInt(e.target.value, 10)
    onChange(value);
  };

  return (
    <div className="flex items-center">
      <Button
        onClick={decrement}
        variant="outline"
        className="p-1 h-8 rounded-r-none border-r-0"
        size="icon"
      >
        <Minus className="size-4" />
      </Button>
      <Input
        onChange={handleChange}
        value={value}
        type="number"
        className="w-[50px] h-8 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none"
      />
      <Button
        onClick={increment}
        variant="outline"
        className="p-1 h-8 rounded-l-none border-l-0"
        size="icon"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
};
