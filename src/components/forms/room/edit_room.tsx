import {
  createRoomSchema,
  CreateRoomSchema,
  roomModel,
} from "@/core/models/room.model";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTimeRange } from "@/util/hooks/use_time_range";
import { TimeRangeSelector } from "./time_range_selector";
import { TimeBlockSelector } from "./time_block_selector";
import { getRoomsService } from "@/core/service/room";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editRoomService } from "@/core/service/room";
import { Plus } from "lucide-react";

interface Props {
  setIsCreating?: (isCreating: boolean) => void;
  close: () => void;
}

export function EditRoom({ setIsCreating, close }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [rooms, setRooms] = useState<roomModel[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const {
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    startTimeOptions,
    endTimeOptions,
    validateTimeRange,
  } = useTimeRange();

  const form = useForm<CreateRoomSchema>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "1",
      startTime: "08:00",
      endTime: "22:00",
      time_block: 30,
    },
  });

  const fetchRooms = async () => {
    try {
      setIsFetching(true);
      const response = await getRoomsService();
      console.log(response)
      setRooms(response.rooms);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      toast.message("Erro ao carregar agendamentos", {
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
    console.log(selectedRoomId)
  }, [rooms, selectedRoomId]);

  useEffect(() => {
    if (selectedRoomId && rooms.length > 0) {
      const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
      if (selectedRoom) {
        console.log(selectedRoom)
        form.reset({
          name: selectedRoom.name || "1",
          startTime: selectedRoom.startTime || "08:00",
          endTime: selectedRoom.endTime || "22:00",
          time_block: selectedRoom.time_block || 30,
        });
        setStartTime(selectedRoom.startTime || "08:00");
        setEndTime(selectedRoom.endTime || "22:00");
      }
    }
  }, [selectedRoomId, rooms, form, setStartTime, setEndTime]);

  if (isFetching) {
    return <div>Carregando salas...</div>;
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">
          Nenhuma sala encontrada. Por favor, crie uma sala.
        </p>

        <Button
          onClick={() => {
            if (setIsCreating) {
              setIsCreating(true);
            }
          }}
          type="button"
          variant="ghost"
          className="mt-10 w-full mb-4 flex items-center justify-start font-medium text-[16px]"
        >
          <Plus size={22} className="mr-2" />
          <div>Adicionar nova sala</div>
        </Button>
      </div>
    );
  }

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    form.setValue("startTime", time);
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    form.setValue("endTime", time);
  };

  const handleTimeBlockChange = (value: string) => {
    form.setValue("time_block", Number(value));
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const onSubmit = async (data: CreateRoomSchema) => {
    if (!selectedRoomId) {
      toast.message("Selecione uma sala para editar");
      return;
    }

    setIsLoading(true);

    const validation = validateTimeRange();
    if (!validation.isValid) {
      toast.message(validation.error);
      setIsLoading(false);
      return;
    }

    try {
      const roomData = {
        id: selectedRoomId,
        name: data.name,
        startTime: startTime,
        endTime: endTime,
        time_block: Number(data.time_block),
      };

      console.log("Room data para edição:", roomData);
      await editRoomService(roomData.id, roomData);

      toast.message("Sala editada com sucesso!");

      await fetchRooms();
    } catch (error) {
      toast.message("Falha ao editar sala");
      console.error(error);
    } finally {
      setIsLoading(false);
      close();
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col w-full"
    >
      <div className="flex flex-col gap-4 px-6  ">
        <div className="">
          <label className="font-normal text-black text-[14px]">
            Selecionar Sala para Editar
          </label>
          <Select value={selectedRoomId} onValueChange={handleRoomSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Escolha uma sala" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="font-normal text-black text-[14px]">
            Novo Nome da Sala
          </label>
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 font-normal text-black text-[14px] pointer-events-none z-10">
              Sala
            </div>
            <Input
              placeholder="101, A, B, etc."
              {...form.register("name")}
              className="w-full pl-11 font-bold"
            />
          </div>
        </div>

        <TimeRangeSelector
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={handleStartTimeChange}
          onEndTimeChange={handleEndTimeChange}
          startTimeOptions={startTimeOptions}
          endTimeOptions={endTimeOptions}
        />
        {rooms[0].time_block}
        <TimeBlockSelector
          onValueChange={handleTimeBlockChange}
          value={form.watch("time_block").toString()}
          label="Bloco de Horários de agendamento"
        />
        <div className="w-full border-t"></div>
        <Button
          onClick={() => {
            if (setIsCreating) {
              setIsCreating(true);
            }
          }}
          type="button"
          variant="ghost"
          className="w-full mb-4 flex items-center justify-start font-medium text-[16px] cursor-pointer"
        >
          <Plus size={22} className="mr-2" />
          <div>Adicionar nova sala</div>
        </Button>
      </div>

      <div className="flex w-full py-4 border-t border-[#D7D7D7] shadow-2xl items-center px-6 justify-center">
        <Button type="submit" disabled={isLoading} className="w-full cursor-pointer">
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
