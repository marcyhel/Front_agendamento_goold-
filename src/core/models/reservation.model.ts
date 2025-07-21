import { z } from "zod";

export interface ReservationModel {
  id: string;
  date: string;
  time: string;
  userId: string;
  roomId: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    lastName: string;
    role: "user" | "admin";
  };
  room: {
    name: string;
  };
}

export interface ReservationListResponse {
  data: ReservationModel[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ReservationFilters {
  search?: string;
  date?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export const reservationFiltersSchema = z.object({
  search: z.string().optional(),
  date: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["ASC", "DESC"]).optional(),
});

export type ReservationFiltersSchema = z.infer<typeof reservationFiltersSchema>;
