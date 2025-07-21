import { z } from "zod";

/**
 * Interface para modelo de email de autenticação
 */
export interface authMailModel {
  email: string;
}

/**
 * Interface para modelo completo de autenticação
 */
export interface authModel {
  email: string;
  password: string;
}

/**
 * Interface para resposta da API de autenticação
 */
export interface AuthResponse {
  accessToken?: string;
  message: string;
  error?: string;
}

/**
 * Interface para resposta da verificação de email
 */
export interface CheckEmailResponse {
  message: string;
  exists: boolean;
}

/**
 * Schema de validação para email
 */
export const authMailSchema = z.object({
  email: z.string().email("Email inválido"),
});

/**
 * Tipo inferido do schema de email
 */
export type AuthMailSchema = z.infer<typeof authMailSchema>;

/**
 * Schema de validação para credenciais completas
 */
export const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

/**
 * Tipo inferido do schema de credenciais
 */
export type AuthSchema = z.infer<typeof authSchema>;
