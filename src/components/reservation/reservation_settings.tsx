"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { CreateRoom, EditRoom } from "../forms/room";

interface ReservationSettingsModalProps {
  open: boolean;
  close: () => void;
  onOpenChange: (open: boolean) => void;
  onSettingsSaved: () => void;
}

export function ReservationSettingsModal({
  open,
  onOpenChange,
  close,
}: ReservationSettingsModalProps) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden p-0 m-0">
        <DialogHeader className="py-4 flex flex-row justify-between items-center px-2 border-b border-[#D7D7D7]">
          <DialogTitle className="font-medium tex-[18px] text-black px-4">
            Ajustes de Agendamento
          </DialogTitle>
          <X
            size={24}
            onClick={() => {
              close();
              onOpenChange(false);
            }}
          />
        </DialogHeader>
        {isCreating ? (
          <CreateRoom setIsCreating={setIsCreating} close={close} />
        ) : (
          <EditRoom setIsCreating={setIsCreating} close={close} />
        )}
      </DialogContent>
    </Dialog>
  );
}
