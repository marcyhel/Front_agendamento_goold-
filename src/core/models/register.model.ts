import { z } from "zod";

export interface RegisterModel {
  user: {
    name: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    canViewLogs: boolean;
    canManageScheduling: boolean;
  };
  address: {
    cep: string;
    number: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  password: string;
  confirmPassword: string;
}

export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirmação de senha obrigatória"),
    cep: z.string().min(8, "CEP deve ter 8 dígitos").max(9, "CEP inválido"),
    street: z.string().min(1, "Endereço é obrigatório"),
    number: z.string().min(1, "Número é obrigatório"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z
      .string()
      .min(2, "Estado é obrigatório")
      .max(2, "Estado deve ter 2 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
