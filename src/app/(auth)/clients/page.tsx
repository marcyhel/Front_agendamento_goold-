"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserPermissions } from "@/util/hooks/use_user";
import { LogoutButton } from "@/components/logout/logout_button";
import { UserFilters, UserList } from "@/components/user";
import { Pagination } from "@/components/ui/pagination";
import { getUsersService } from "@/core/service/user";
import {
	UserModel,
	UserFilters as UserFiltersType,
	UserListResponse,
} from "@/core/models/user.model";
import { toast } from "sonner";
import Header from "@/components/header";

export default function ClientsPage() {
	const { isAdmin } = useUserPermissions();
	const [users, setUsers] = useState<UserModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});
	const [filters, setFilters] = useState<UserFiltersType>({
		limit: 5,
		page: 1,
	});

	const fetchUsers = useCallback(async (currentFilters: UserFiltersType) => {
		try {
			setIsLoading(true);
			const response: UserListResponse = await getUsersService(currentFilters);
			setUsers(response.data);
			setPagination({
				currentPage: response.currentPage,
				totalPages: response.totalPages,
				totalItems: response.totalItems,
				hasNextPage: response.hasNextPage,
				hasPrevPage: response.hasPrevPage,
			});
		} catch (error) {
			console.error("Erro ao buscar usuários:", error);
			toast.message("Erro ao carregar usuários", {
				description: "Tente novamente mais tarde.",
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers(filters);
	}, [filters, fetchUsers]);

	const handleFiltersChange = useCallback(
		(newFilters: Partial<UserFiltersType>) => {
			setFilters((prevFilters) => ({
				...prevFilters,
				...newFilters,
				page: 1,
			}));
		},
		[]
	);

	const handleSortChange = useCallback(
		(sortBy: string, sortOrder: "ASC" | "DESC") => {
			setFilters((prevFilters) => ({
				...prevFilters,
				sortBy,
				sortOrder,
				page: 1,
			}));
		},
		[]
	);

	const handlePageChange = (page: number) => {
		const updatedFilters = { ...filters, page };
		setFilters(updatedFilters);
	};

	const handleUserUpdate = useCallback((updatedUser: UserModel) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
		);
	}, []);

	if (!isAdmin) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Acesso Negado
					</h1>
					<p className="text-gray-600">
						Você não tem permissão para acessar esta página.
					</p>
					<div className="mt-4">
						<LogoutButton />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex w-full h-full flex-col">
			<Header title="Clientes" subtitle="Overview de todos os clientes" />

			<div className="flex w-full h-full flex-col justify-between overflow-hidden p-6">
				<div className="flex-1 flex flex-col w-full min-h-0 border rounded-lg border-[#D7D7D7] px-4 py-8">
					<div className="flex w-full border-b border-[#D7D7D7] mb-8">
						<div className="flex w-4/5 items-center">
							<UserFilters
								onFiltersChange={handleFiltersChange}
								isLoading={isLoading}
							/>
						</div>
					</div>

					<div className="space-y-4 flex-1 flex flex-col min-h-0">
						<div className="flex-1 min-h-0">
							<UserList
								users={users}
								isLoading={isLoading}
								sortBy={filters.sortBy}
								sortOrder={filters.sortOrder}
								onSortChange={handleSortChange}
								onUserUpdate={handleUserUpdate}
							/>
						</div>
					</div>
				</div>

				<Pagination
					currentPage={pagination.currentPage}
					totalPages={pagination.totalPages}
					hasNextPage={pagination.hasNextPage}
					hasPrevPage={pagination.hasPrevPage}
					onPageChange={handlePageChange}
					isLoading={isLoading}
					totalItems={pagination.totalItems}
					itemsPerPage={filters.limit || 5}
				/>
			</div>
		</div>
	);
}
