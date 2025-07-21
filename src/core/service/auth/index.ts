import api from "@/core/lib/api";
import { authModel, AuthResponse } from "@/core/models/auth_cliente.model";

export async function userAuthService(data: authModel): Promise<AuthResponse> {
	const response = await api.post<AuthResponse>("/auth/signin", data);
	return response.data;
}
