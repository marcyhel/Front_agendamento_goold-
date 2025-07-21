import { z } from "zod";

export interface ProfileResponse {
  userProfile: {
    id: string;
    name: string;
    lastName: string;
    role: "user" | "admin";
    status: "active" | "inactive";
    email: string;
    canViewLogs: boolean;
    canManageScheduling: boolean;
    createdAt: string;
    updatedAt: string;
    address: {
      id: string;
      userId: string;
      cep: string;
      number: string;
      street: string;
      neighborhood: string;
      city: string;
      state: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface UpdateProfileModel {
  user: {
    name: string;
    lastName: string;

  };
  address: {
    cep: string;
    number: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  password?: string;
}

export const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
  cep: z.string().min(8, "CEP deve ter 8 dígitos").max(9, "CEP inválido"),
  street: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z
    .string()
    .min(2, "Estado é obrigatório")
    .max(2, "Estado deve ter 2 caracteres"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
