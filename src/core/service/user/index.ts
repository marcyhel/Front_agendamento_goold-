import api from "@/core/lib/api";
import { UserListResponse, UserFilters } from "@/core/models/user.model";

export async function getUsersService(
	filters: UserFilters = {}
): Promise<UserListResponse> {
	const params = new URLSearchParams();

	if (filters.search) params.append("search", filters.search);
	if (filters.date) params.append("date", filters.date);
	if (filters.status) params.append("status", filters.status);
	if (filters.role) params.append("role", filters.role);
	if (filters.page) params.append("page", filters.page.toString());
	if (filters.limit) params.append("limit", filters.limit.toString());
	if (filters.sortBy) params.append("sortBy", filters.sortBy);
	if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

	const response = await api.get<UserListResponse>(
		`/user?${params.toString()}`
	);
	return response.data;
}
