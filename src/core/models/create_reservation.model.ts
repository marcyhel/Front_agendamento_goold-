import { z } from "zod";

export interface CreateReservationModel {
  date: string;
  time: string;
  userId: string;
  roomId: string;
}

export interface CreateReservationResponse {
  id: string;
  date: string;
  time: string;
  userId: string;
  roomId: string;
  status: "pending" | "confirmed" | "cancelled";
  updatedAt: string;
  createdAt: string;
}

export interface AvailableSlotsResponse {
  availableSlots: string[];
}

export const createReservationSchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  roomId: z.string().min(1, "Sala é obrigatória"),
});

export type CreateReservationSchema = z.infer<typeof createReservationSchema>;
