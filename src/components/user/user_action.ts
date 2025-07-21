"use server";

import api from "@/core/lib/api";
import { getServerSession } from "next-auth";
import { authConfig } from "@/core/lib/auth_config";
import { UserModel } from "@/core/models/user.model";

export interface UserActionResponse {
	success: boolean;
	user?: UserModel;
	error?: string;
}

export async function updateUserStatusAction(
	userId: string,
	status: "active" | "inactive"
): Promise<UserActionResponse> {
	try {
		const session = await getServerSession(authConfig);

		if (!session?.accessToken) {
			return {
				success: false,
				error: "Não autorizado",
			};
		}

		const response = await api.patch(
			`/user/${userId}/status`,
			{ status },
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);

		return {
			success: true,
			user: response.data.updatedUser,
		};
	} catch (error: unknown) {
		const errorMessage =
			error && typeof error === "object" && "response" in error
				? (error as { response?: { data?: { message?: string } } }).response
					?.data?.message
				: undefined;

		return {
			success: false,
			error: errorMessage || "Erro ao atualizar status do usuário",
		};
	}
}

export async function updateUserPermissionsAction(
	userId: string,
	permissions: {
		canViewLogs: boolean;
		canManageScheduling: boolean;
	}
): Promise<UserActionResponse> {
	try {
		const session = await getServerSession(authConfig);

		if (!session?.accessToken) {
			return {
				success: false,
				error: "Não autorizado",
			};
		}

		const response = await api.patch(
			`/user/${userId}/permissions`,
			{ permissions },
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);

		return {
			success: true,
			user: response.data.updatedUser,
		};
	} catch (error: unknown) {
		const errorMessage =
			error && typeof error === "object" && "response" in error
				? (error as { response?: { data?: { message?: string } } }).response
					?.data?.message
				: undefined;

		return {
			success: false,
			error: errorMessage || "Erro ao atualizar permissões do usuário",
		};
	}
}
