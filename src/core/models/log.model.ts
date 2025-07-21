import { z } from "zod";

export interface LogModel {
  id: string;
  userId: string;
  module: string;
  activity: string;
  details: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    lastName: string;
    email: string;
  };
}

export interface LogFilters {
  search?: string;
  date?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export const logFiltersSchema = z.object({
  search: z.string().optional(),
  date: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["ASC", "DESC"]).optional(),
});

export interface LogListResponse {
  data: LogModel[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
