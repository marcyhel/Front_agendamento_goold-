"use client";

import { useSession } from "next-auth/react";
import { UserModel } from "@/core/models/user.model";

export function useUser() {
	const { data: session, status } = useSession();

	return {
		user: session?.user as UserModel | undefined,
		isLoading: status === "loading",
		isAuthenticated: status === "authenticated",
		accessToken: session?.accessToken,
	};
}

export function useUserPermissions() {
	const { user } = useUser();

	return {
		isAdmin: user?.role === "admin",
		canViewLogs: user?.canViewLogs || false,
		canManageScheduling: user?.canManageScheduling || false,
	};
}
