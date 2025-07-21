import { z } from "zod";
export interface roomModel {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  time_block: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomListResponse {
  rooms: roomModel[];
}

export interface NewRoomResponse {
  newRoom: roomModel;
}

export const roomSchema = z.object({
  name: z.string().min(1, "Número é obrigatório"),
  startTime: z
    .string()
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
  endTime: z
    .string()
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
  time_block: z.number().int().positive("Bloco de tempo deve ser positivo"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createRoomSchema = z.object({
  name: z.string().min(1, "Número é obrigatório"),
  startTime: z
    .string()
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
  endTime: z
    .string()
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
  time_block: z.number().int().positive("Bloco de tempo deve ser positivo"),
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;

export type RoomSchema = z.infer<typeof roomSchema>;
