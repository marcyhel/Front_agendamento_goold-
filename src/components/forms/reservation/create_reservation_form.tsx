"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/core/lib/utils";
import { useUser } from "@/util/hooks/use_user";
import { getRoomsService } from "@/core/service/room";
import { getAvailableSlotsService } from "@/core/service/reservation";
import { createReservationAction } from "@/components/reservation/reservation_action";
import { roomModel } from "@/core/models/room.model";
import {
  createReservationSchema,
  CreateReservationSchema,
} from "@/core/models/create_reservation.model";

interface CreateReservationFormProps {
  close: () => void;
  onReservationCreated: () => void;
}

export function CreateReservationForm({
  close,
  onReservationCreated,
}: CreateReservationFormProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [rooms, setRooms] = useState<roomModel[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const form = useForm<CreateReservationSchema>({
    resolver: zodResolver(createReservationSchema),
    defaultValues: {
      date: "",
      time: "",
      roomId: "",
    },
  });

  const selectedRoomId = form.watch("roomId");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRoomsService();
        setRooms(response.rooms);
      } catch {
        toast.message("Erro ao carregar salas");
      }
    };

    fetchRooms();
  }, []);

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDate || !selectedRoomId) return;

    try {
      setLoadingSlots(true);
      const dateString = selectedDate.toISOString();
      const response = await getAvailableSlotsService(
        selectedRoomId,
        dateString
      );
      setAvailableSlots(response.availableSlots);
      form.setValue("time", "");
    } catch {
      toast.message("Erro ao carregar horários disponíveis");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDate, selectedRoomId, form]);

  useEffect(() => {
    if (selectedDate && selectedRoomId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedRoomId, fetchAvailableSlots]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = format(date, "yyyy-MM-dd");
      form.setValue("date", formattedDate);
      setDatePopoverOpen(false);
    }
  };

  const onSubmit = async (data: CreateReservationSchema) => {
    if (!user?.id) {
      toast.message("Usuário não encontrado");
      return;
    }

    setIsLoading(true);

    try {
      const reservationData = {
        ...data,
        userId: user.id,
      };

      const result = await createReservationAction(reservationData);

      if (result.success) {
        toast.message("Agendamento criado com sucesso!");
        onReservationCreated();
        close();
      } else {
        toast.message(result.error || "Erro ao criar agendamento");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
            ?.data?.error || "Erro ao criar agendamento"
          : "Erro ao criar agendamento";
      toast.message(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col w-full"
    >
      <div className="flex flex-col gap-4 px-4 py-6">
        <div className="space-y-2">
          <label className="font-normal text-black text-[14px]">
            Selecione uma <b>data</b> <span>(Obrigatório)</span>
          </label>
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between py-5 text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                {selectedDate ? (
                  format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
                <CalendarIcon className="mr-2 h-4 w-4 " />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                locale={ptBR}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.date && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="font-normal text-black text-[14px]">
            Selecione uma <b>Sala</b> <span>(Obrigatório)</span>
          </label>
          <Select
            value={form.watch("roomId")}
            onValueChange={(value) => form.setValue("roomId", value)}
          >
            <SelectTrigger className="w-full py-5">
              <SelectValue placeholder="Selecione um Sala" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  Sala {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.roomId && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.roomId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="font-normal text-black text-[14px]">
            Selecione uma <b>Horário</b> <span>(Obrigatório)</span>
          </label>
          <Select
            value={form.watch("time")}
            onValueChange={(value) => form.setValue("time", value)}
            disabled={!selectedDate || !selectedRoomId || loadingSlots}
          >
            <SelectTrigger className="w-full py-5">
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Selecione um horário" />
            </SelectTrigger>
            <SelectContent>
              {loadingSlots ? (
                <SelectItem value="loading" disabled>
                  Carregando horários...
                </SelectItem>
              ) : availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-slots" disabled>
                  Nenhum horário disponível
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {form.formState.errors.time && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.time.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex w-full py-4 border-t border-[#D7D7D7] shadow-2xl items-center px-4 justify-center">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black hover:bg-gray-800 text-white"
        >
          {isLoading ? "Confirmando Agendamento..." : "Confirmar Agendamento"}
        </Button>
      </div>
    </form>
  );
}
