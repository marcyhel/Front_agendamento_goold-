import api from "@/core/lib/api";
import { ProfileResponse, UpdateProfileModel } from "@/core/models/profile.model";

export const getProfileService = async (): Promise<ProfileResponse> => {
	const response = await api.get<ProfileResponse>("/profile");
	return response.data;
};

export const updateProfileService = async (
	data: UpdateProfileModel
): Promise<{ message: string }> => {
	const response = await api.put("/profile", data);
	return response.data;
};
