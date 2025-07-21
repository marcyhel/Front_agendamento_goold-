"use client";

import React, { useState, useTransition } from "react";
import { UserModel } from "@/core/models/user.model";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import {
	updateUserStatusAction,
	updateUserPermissionsAction,
} from "@/components/user/user_action";
import { toast } from "sonner";

interface UserListProps {
	users: UserModel[];
	isLoading?: boolean;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
	onSortChange: (sortBy: string, sortOrder: "ASC" | "DESC") => void;
	onUserUpdate?: (updatedUser: UserModel) => void;
}

const roleMap = {
	admin: {
		label: "Administrador",
		className: "bg-[#FFF5F5] text-[#EA0000] border border-[#FF0000]",
	},
	user: {
		label: "Usuário",
		className: "bg-[#F5F5F5] text-[#676767] border border-[#A4AAAD]",
	},
};

export function UserList({
	users,
	isLoading = false,
	sortBy,
	sortOrder,
	onSortChange,
	onUserUpdate,
}: UserListProps) {
	const [isPending, startTransition] = useTransition();
	const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set());
	const handleDateSortClick = () => {
		if (sortBy === "createdAt") {
			const newOrder = sortOrder === "ASC" ? "DESC" : "ASC";
			onSortChange("createdAt", newOrder);
		} else {
			onSortChange("createdAt", "ASC");
		}
	};

	const handleStatusChange = async (
		userId: string,
		newStatus: "active" | "inactive"
	) => {
		setLoadingUsers((prev) => new Set([...prev, userId]));

		startTransition(async () => {
			const result = await updateUserStatusAction(userId, newStatus);

			if (result.success && result.user) {
				toast.message(
					`Status do usuário ${newStatus === "active" ? "ativado" : "desativado"
					} com sucesso!`
				);
				onUserUpdate?.(result.user);
			} else {
				toast.message(result.error || "Erro ao atualizar status do usuário");
			}

			setLoadingUsers((prev) => {
				const newSet = new Set(prev);
				newSet.delete(userId);
				return newSet;
			});
		});
	};

	const handlePermissionChange = async (
		userId: string,
		permissionType: "canViewLogs" | "canManageScheduling",
		newValue: boolean
	) => {
		const user = users.find((u) => u.id === userId);
		if (!user) return;

		setLoadingUsers((prev) => new Set([...prev, userId]));

		const updatedPermissions = {
			canViewLogs: user.canViewLogs || false,
			canManageScheduling: user.canManageScheduling || false,
			[permissionType]: newValue,
		};

		startTransition(async () => {
			const result = await updateUserPermissionsAction(
				userId,
				updatedPermissions
			);

			if (result.success && result.user) {
				toast.message("Permissões atualizadas com sucesso!");
				onUserUpdate?.(result.user);
			} else {
				toast.message(result.error || "Erro ao atualizar permissões do usuário");
			}

			setLoadingUsers((prev) => {
				const newSet = new Set(prev);
				newSet.delete(userId);
				return newSet;
			});
		});
	};

	const renderSortIcon = () => {
		if (sortBy !== "createdAt") return null;

		return sortOrder === "ASC" ? (
			<ChevronUp className="h-4 w-4 ml-1" />
		) : (
			<ChevronDown className="h-4 w-4 ml-1" />
		);
	};

	const formatAddress = (address: UserModel["address"]) => {
		if (!address) return "Endereço não informado";

		return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.state} - CEP: ${address.cep}`;
	};

	const renderPermissionBadge = (
		user: UserModel,
		permissionType: "canViewLogs" | "canManageScheduling",
		label: string
	) => {
		const hasPermission = user[permissionType];
		const isUserLoading = loadingUsers.has(user.id);
		const isAdminUser = user.role === "admin";

		return (
			<button
				onClick={() =>
					handlePermissionChange(user.id, permissionType, !hasPermission)
				}
				disabled={isUserLoading || isPending || isAdminUser}
				className={`inline-flex px-2 py-1.5 text-xs font-semibold rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${hasPermission
					? "bg-black text-white border-black hover:bg-gray-800"
					: "bg-white text-black border-gray-300 hover:bg-gray-50"
					}`}
			>
				{label}
			</button>
		);
	};

	if (isLoading) {
		return (
			<div className="bg-white rounded-2xl shadow-md border p-6">
				<div className="animate-pulse">

					<div className="flex items-center border-b pb-4 mb-4 space-x-6">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="h-5 bg-gray-300 rounded w-1/5"></div>
						))}
					</div>


					<div className="space-y-4">
						{[...Array(8)].map((_, rowIdx) => (
							<div key={rowIdx} className="flex items-center space-x-6">
								{[...Array(5)].map((_, colIdx) => (
									<div
										key={colIdx}
										className="h-4 bg-gray-200 rounded w-1/5"
									></div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
	if (users.length === 0) {
		return (
			<div className="flex flex-col w-full h-full items-center justify-center">
				<Image
					aria-hidden
					src="/wipe.png"
					alt="File icon"
					width={300}
					height={300}
					className="mb-8"
				/>
				<p className="text-black text-[22px] font-semibold">
					Nada por aqui ainda...
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden flex flex-col h-full">
			<div className="flex-1 overflow-y-auto min-h-0">
				<table className="min-w-full">
					<thead className="bg-white sticky top-0 z-10 border-b border-[#D7D7D7]">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-black">
								<button
									onClick={handleDateSortClick}
									className="flex items-center hover:text-gray-600 transition-colors cursor-pointer"
									disabled={isLoading}
								>
									Data de cadastro
									{renderSortIcon()}
								</button>
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-black">
								Nome
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-black">
								Endereço
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-black">
								Permissões
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-black">
								Status
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[#D7D7D7]">
						{users.map((user) => {
							const userRole = roleMap[user.role || "user"];
							const isUserLoading = loadingUsers.has(user.id);
							const isAdminUser = user.role === "admin";

							return (
								<tr key={user.id} className="bg-white">
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<div className="flex gap-2 text-[14px] text-black font-normal">
											<div>
												{user.createdAt &&
													formatInTimeZone(
														new Date(user.createdAt),
														"America/Sao_Paulo",
														"dd/MM/yyyy",
														{ locale: ptBR }
													)}
											</div>
											<div>
												às{" "}
												{user.createdAt &&
													formatInTimeZone(
														new Date(user.createdAt),
														"America/Sao_Paulo",
														"HH:mm",
														{ locale: ptBR }
													)}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<p className="text-black font-medium text-[14px]">
											{user.name} {user.lastName}
										</p>
										<p className="text-black font-normal text-[13px]">
											{userRole.label}
										</p>
									</td>
									<td className="px-6 py-4">
										<div className="text-[14px] text-black font-normal max-w-xs line-clamp-2">
											{formatAddress(user.address)}
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex flex-wrap gap-2">
											{renderPermissionBadge(user, "canViewLogs", "Logs")}
											{renderPermissionBadge(
												user,
												"canManageScheduling",
												"Agendamentos"
											)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center gap-2">
											<Switch
												checked={user.status === "active"}
												disabled={isUserLoading || isPending || isAdminUser}
												onCheckedChange={(checked) =>
													handleStatusChange(
														user.id,
														checked ? "active" : "inactive"
													)
												}
												className="data-[state=checked]:bg-black"
											/>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
