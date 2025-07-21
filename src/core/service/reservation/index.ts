import api from "@/core/lib/api";
import { AvailableSlotsResponse, CreateReservationModel, CreateReservationResponse } from "@/core/models/create_reservation.model";
import { ReservationListResponse, ReservationFilters } from "@/core/models/reservation.model";


export async function getReservationsService(
	filters: ReservationFilters = {}
): Promise<ReservationListResponse> {
	const params = new URLSearchParams();

	if (filters.search) params.append("search", filters.search);
	if (filters.date) params.append("date", filters.date);
	if (filters.page) params.append("page", filters.page.toString());
	if (filters.limit) params.append("limit", filters.limit.toString());
	if (filters.sortBy) params.append("sortBy", filters.sortBy);
	if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

	const response = await api.get<ReservationListResponse>(
		`/profile/reservations?${params.toString()}`
	);
	return response.data;
}

export async function getReservationsServiceAdmin(
	filters: ReservationFilters = {}
): Promise<ReservationListResponse> {
	const params = new URLSearchParams();

	if (filters.search) params.append("search", filters.search);
	if (filters.date) params.append("date", filters.date);
	if (filters.page) params.append("page", filters.page.toString());
	if (filters.limit) params.append("limit", filters.limit.toString());
	if (filters.sortBy) params.append("sortBy", filters.sortBy);
	if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

	const response = await api.get<ReservationListResponse>(
		`/reservation?${params.toString()}`
	);
	return response.data;
}

export async function getAvailableSlotsService(
	roomId: string,
	date: string
): Promise<AvailableSlotsResponse> {
	const response = await api.post<AvailableSlotsResponse>(
		`/reservation/free/${roomId}`,
		{ date }
	);
	return response.data;
}

export async function createReservationService(
	reservationData: CreateReservationModel
): Promise<CreateReservationResponse> {
	const response = await api.post<CreateReservationResponse>(
		"/reservation",
		reservationData
	);
	return response.data;
}
