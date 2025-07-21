import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeBlockSelectorProps {
  onValueChange: (value: string) => void;
  value: string;
  label?: string;
}
const timeBlockOptions = [
  { value: "10", label: "10 minutos" },
  { value: "20", label: "20 minutos" },
  { value: "30", label: "30 minutos" },
  { value: "60", label: "1 hora" },
];

export function TimeBlockSelector({
  onValueChange,
  value,
  label = "Bloco de Tempo",
}: TimeBlockSelectorProps) {
  return (
    <div className="flex w-full flex-col space-y-2 bg-white ">
      {label && (
        <label className="font-normal text-black text-[14px]">{label}</label>
      )}
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Selecionar bloco de tempo" />
        </SelectTrigger>
        <SelectContent className="w-full ">
          <SelectGroup>
            <SelectLabel className="font-normal text-black text-[14px]">
              Blocos de Tempo
            </SelectLabel>
            {timeBlockOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}