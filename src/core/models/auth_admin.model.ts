import { z } from "zod";
export interface authAdminModel {
  email: string;
  password: string;
}

export interface AuthAdminResponse {
  accessToken?: string;
  message: string;
  error?: string;
}

export const authAdminSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type AuthAdminSchema = z.infer<typeof authAdminSchema>;
