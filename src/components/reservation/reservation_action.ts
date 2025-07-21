"use server";

import api from "@/core/lib/api";
import { getServerSession } from "next-auth";
import { authConfig } from "@/core/lib/auth_config";
import {
	CreateReservationModel,
	CreateReservationResponse,
} from "@/core/models/create_reservation.model";

export interface ReservationActionResponse {
	success: boolean;
	status?: "confirmed" | "cancelled";
	error?: string;
}

export interface CreateReservationActionResponse {
	success: boolean;
	reservation?: CreateReservationResponse;
	error?: string;
}

export async function cancelReservationAction(
	reservationId: string
): Promise<ReservationActionResponse> {
	try {
		const session = await getServerSession(authConfig);

		if (!session?.accessToken) {
			return {
				success: false,
				error: "Não autorizado",
			};
		}

		const response = await api.post(
			`/reservation/cancel/${reservationId}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);

		if (response.data?.status === "cancelled") {
			return {
				success: true,
				status: "cancelled",
			};
		}

		return {
			success: false,
			error: "Falha ao cancelar agendamento",
		};
	} catch (error: unknown) {
		const errorMessage =
			error && typeof error === "object" && "response" in error
				? (error as { response?: { data?: { error?: string } } }).response?.data
					?.error || "Erro ao cancelar agendamento"
				: "Erro ao cancelar agendamento";

		return {
			success: false,
			error: errorMessage,
		};
	}
}

export async function confirmReservationAction(
	reservationId: string
): Promise<ReservationActionResponse> {
	try {
		const session = await getServerSession(authConfig);

		if (!session?.accessToken) {
			return {
				success: false,
				error: "Não autorizado",
			};
		}

		const response = await api.post(
			`/reservation/confirm/${reservationId}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);

		if (response.data?.status === "confirmed") {
			return {
				success: true,
				status: "confirmed",
			};
		}

		return {
			success: false,
			error: "Falha ao confirmar agendamento",
		};
	} catch (error: unknown) {
		const errorMessage =
			error && typeof error === "object" && "response" in error
				? (error as { response?: { data?: { error?: string } } }).response?.data
					?.error || "Erro ao confirmar agendamento"
				: "Erro ao confirmar agendamento";

		return {
			success: false,
			error: errorMessage,
		};
	}
}

export async function createReservationAction(
	reservationData: CreateReservationModel
): Promise<CreateReservationActionResponse> {
	try {
		const session = await getServerSession(authConfig);

		if (!session?.accessToken) {
			return {
				success: false,
				error: "Não autorizado",
			};
		}

		const response = await api.post<CreateReservationResponse>(
			"/reservation",
			reservationData,
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);

		return {
			success: true,
			reservation: response.data,
		};
	} catch (error: unknown) {
		const errorMessage =
			error && typeof error === "object" && "response" in error
				? (error as { response?: { data?: { error?: string } } }).response?.data
					?.error || "Erro ao criar agendamento"
				: "Erro ao criar agendamento";

		return {
			success: false,
			error: errorMessage,
		};
	}
}
