/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Filters = {
  search?: string;
  date?: string;
};

interface Props {
  onFiltersChange: (filters: Filters) => void;
  isLoading?: boolean;
}

export const ReservationFilters: React.FC<Props> = ({
  onFiltersChange,
  isLoading = false,
}) => {
  const [searchText, setSearchText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [chosenDate, setChosenDate] = useState<Date>();
  const [rawDateInput, setRawDateInput] = useState("");
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const delayDebounce = 500;

  // Debounce search text
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedText(searchText);
    }, delayDebounce);

    return () => clearTimeout(timeout);
  }, [searchText]);

  // Format date for display input
  useEffect(() => {
    setRawDateInput(chosenDate ? format(chosenDate, "dd/MM/yyyy", { locale: ptBR }) : "");
  }, [chosenDate]);

  // Notify parent of filters
  useEffect(() => {
    onFiltersChange({
      search: debouncedText || undefined,
      date: chosenDate ? format(chosenDate, "yyyy-MM-dd") : undefined,
    });
  }, [debouncedText, chosenDate]);

  const handleClear = () => {
    setSearchText("");
    setChosenDate(undefined);
    setRawDateInput("");
    onFiltersChange({});
  };

  const tryParseDate = (input: string): Date | null => {
    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    ];

    for (const pattern of formats) {
      const match = input.match(pattern);
      if (match) {
        let d: number, m: number, y: number;
        if (pattern.source.startsWith("^\\d{4}")) {
          [, y, m, d] = match.map(Number);
        } else {
          [, d, m, y] = match.map(Number);
        }

        const parsed = new Date(y, m - 1, d);
        if (
          !isNaN(parsed.getTime()) &&
          parsed.getDate() === d &&
          parsed.getMonth() === m - 1 &&
          parsed.getFullYear() === y
        ) {
          return parsed;
        }
      }
    }

    return null;
  };

  const hasActiveFilters = !!searchText || !!chosenDate;

  return (
    <div className="w-full pb-8 flex flex-col">
      <div className="flex flex-col sm:flex-row gap-4">

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchText}
            placeholder="Buscar por nome"
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 py-5"
            disabled={isLoading}
          />
        </div>


        <div className="relative">
          <Input
            value={rawDateInput}
            placeholder="Selecionar data"
            className="w-[200px] pr-20 py-5"
            disabled={isLoading}
            onChange={(e) => {
              const input = e.target.value;
              setRawDateInput(input);

              const parsed = tryParseDate(input);
              if (parsed) {
                setChosenDate(parsed);
              } else if (input.trim() === "") {
                setChosenDate(undefined);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCalendarOpen(true);
              }
            }}
          />


          <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="absolute top-1/2 right-2 -translate-y-1/2 h-6 w-6 p-0 cursor-pointer"
                disabled={isLoading}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="sr-only">Abrir calendário</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-auto overflow-hidden"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={chosenDate}
                onSelect={(date) => {
                  setChosenDate(date);
                  setRawDateInput(date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "");
                  setCalendarOpen(false);
                }}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>


          {chosenDate && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-9 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-700 cursor-pointer"
              onClick={() => {
                setChosenDate(undefined);
                setRawDateInput("");
              }}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Limpar data</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
