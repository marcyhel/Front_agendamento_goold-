/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { UserModel } from "@/core/models/user.model";
import { useUser } from "@/util/hooks/use_user";
import {
	CalendarDays,
	ListChecks,
	User,
	Users,
	ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { LogoutButton } from "@/components/logout/logout_button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SidebarProps = {
	children: ReactNode;
};

type NavigationItem = {
	label: string;
	href: string;
	icon: React.ReactNode;
	show: boolean;
};

export default function Sidebar({ children }: SidebarProps) {
	const { user, isAuthenticated, isLoading } = useUser();
	const [isOpen, setIsOpen] = useState(false);
	const path = usePathname();
	const router = useRouter();

	const getMenuItems = (currentUser: UserModel): NavigationItem[] => [
		{
			label: "Agendamentos",
			href: "/reservation",
			icon: <CalendarDays size={20} />,
			show:
				currentUser.role === "admin" ||
				currentUser.canManageScheduling === true,
		},
		{
			label: "Minha conta",
			href: "/profile",
			icon: <User size={20} />,
			show: currentUser.role === "user",
		},
		{
			label: "Logs",
			href: "/logs",
			icon: <ListChecks size={20} />,
			show:
				currentUser.role === "admin" || currentUser.canViewLogs === true,
		},
		{
			label: "Clientes",
			href: "/clients",
			icon: <Users size={20} />,
			show: currentUser.role === "admin",
		},

	];

	const navigate = (href: string) => {
		if (path !== href) {
			router.push(href);
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col bg-[#F6F4F1] w-screen h-screen justify-center items-center">
				<Image
					src="/logo.png"
					alt="Brand Logo"
					width={40}
					height={40}
					priority
				/>
				<div className="mt-4">Carregando</div>

			</div>
		);
	}

	if (!isAuthenticated || !user) return null;

	const menu = getMenuItems(user).filter((item) => item.show);

	return (
		<div className="flex w-full h-full">
			<aside className="w-64 h-full border-r border-[#D7D7D7] flex flex-col">
				<div className="h-[93px] min-h-[93px] border-b border-[#D7D7D7] flex items-center pl-4">
					<Image
						src="/logo.png"
						alt="Logo"
						width={60}
						height={60}
						priority
					/>
				</div>

				<nav className="flex-1 p-4">
					<ul className="flex flex-col gap-2">
						{menu.map(({ label, href, icon }) => {
							const active = path === href;
							return (
								<li
									key={label}
									onClick={() => navigate(href)}
									className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${active ? "bg-black text-white" : ""
										}`}
								>
									{icon}
									<span>{label}</span>
								</li>
							);
						})}
					</ul>
				</nav>

				<DropdownMenu onOpenChange={(open: boolean) => setIsOpen(open)}>
					<DropdownMenuTrigger asChild>
						<div className="border-t border-[#D7D7D7] py-2 px-4 flex justify-between items-center cursor-pointer">
							<div className="mb-3 flex flex-col items-start">
								<p className="text-sm font-medium">
									{user.name} {user.lastName}
								</p>
								<p className="text-xs">
									{user.role === "admin" ? "Administrador" : "Cliente"}
								</p>
							</div>
							<ChevronDown
								size={20}
								className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
							/>
						</div>
					</DropdownMenuTrigger>

					<DropdownMenuContent className="w-[250px]">
						<DropdownMenuItem>
							<LogoutButton className="w-full text-sm cursor-pointer text-black bg-opacity-0 hover:bg-opacity-0 shadow-none" />
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer">Configuração</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</aside>

			<main className="flex-1 overflow-y-auto bg-white">{children}</main>
		</div>
	);
}
