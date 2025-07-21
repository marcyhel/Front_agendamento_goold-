import api from "@/core/lib/api";
import { RegisterModel } from "@/core/models/register.model";

export const registerService = async (
	data: RegisterModel
): Promise<{ message: string }> => {
	const response = await api.post("/auth/signup", data);
	return response.data;
};
