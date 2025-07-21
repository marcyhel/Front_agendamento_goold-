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

interface LogFiltersProps {
  onFiltersChange: (filters: { search?: string; date?: string }) => void;
  isLoading?: boolean;
}

export function LogFilters({
  onFiltersChange,
  isLoading = false,
}: LogFiltersProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [dateValue, setDateValue] = useState("");
  const [open, setOpen] = useState(false);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const isValidDate = (date: Date | undefined) => {
    if (!date) return false;
    return !isNaN(date.getTime());
  };

  const parseDate = (value: string) => {
    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    ];

    for (const regex of formats) {
      const match = value.match(regex);
      if (match) {
        let day, month, year;

        if (regex.source.startsWith("^(\\d{4})")) {
          [, year, month, day] = match;
        } else {
          [, day, month, year] = match;
        }

        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );

        if (
          isValidDate(date) &&
          date.getDate() === parseInt(day) &&
          date.getMonth() === parseInt(month) - 1 &&
          date.getFullYear() === parseInt(year)
        ) {
          return date;
        }
      }
    }

    return null;
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    setDateValue(formatDate(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    onFiltersChange({
      search: debouncedSearch || undefined,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
    });
  }, [debouncedSearch, selectedDate]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };




  return (
    <div className="pb-8 flex flex-col w-full">
      <div className="flex flex-col sm:flex-row gap-4 ">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar por nome ou email..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 py-5"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="relative">
          <Input
            value={dateValue}
            placeholder="Selecione"
            className="pr-20 w-[200px] py-5"
            disabled={isLoading}
            onChange={(e) => {
              const value = e.target.value;
              setDateValue(value);

              const parsedDate = parseDate(value);
              if (parsedDate) {
                setSelectedDate(parsedDate);
              } else if (value === "") {
                setSelectedDate(undefined);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
              }
            }}
          />


          {selectedDate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedDate(undefined);
                setDateValue("");
              }}
              disabled={isLoading}
              className="absolute right-9 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Limpar data</span>
            </Button>
          )}


          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0 cursor-pointer"
                disabled={isLoading}
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="sr-only">Selecionar data</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setDateValue(formatDate(date));
                  setOpen(false);
                }}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

      </div>
    </div>
  );
}
