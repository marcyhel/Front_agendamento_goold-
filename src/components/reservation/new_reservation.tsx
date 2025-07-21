"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { CreateReservationForm } from "../forms/reservation/create_reservation_form";


interface NewReservationModalProps {
  open: boolean;
  close: () => void;
  onOpenChange: (open: boolean) => void;
  onReservationCreated: () => void;
}

export function NewReservationModal({
  open,
  onOpenChange,
  onReservationCreated,
  close,
}: NewReservationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] [&>button]:hidden p-0 px-3 m-0">
        <DialogHeader className="py-4 flex flex-row justify-between items-center px-2 border-b border-[#D7D7D7]">
          <DialogTitle className="font-medium text-[18px] text-black px-4">
            Novo Agendamento
          </DialogTitle>
          <X
            size={24}
            onClick={() => {
              close();
              onOpenChange(false);
            }}
            className="cursor-pointer"
          />
        </DialogHeader>
        <CreateReservationForm close={close} onReservationCreated={onReservationCreated} />
      </DialogContent>
    </Dialog>
  );
}
