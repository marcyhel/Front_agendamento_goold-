import api from "@/core/lib/api";
import { authAdminModel, AuthAdminResponse } from "@/core/models/auth_admin.model";

export async function adminAuthService(
	data: authAdminModel
): Promise<AuthAdminResponse> {
	const response = await api.post<AuthAdminResponse>("/auth/admin", data);
	return response.data;
}
