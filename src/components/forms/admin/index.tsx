/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { AuthAdminSchema, authAdminSchema } from "@/core/models/auth_admin.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { authHelpers } from "@/core/lib/auth_helpers";

export default function AdminAuthForm() {
	const router = useRouter();
	const form = useForm<AuthAdminSchema>({
		resolver: zodResolver(authAdminSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const [showPassword, setShowPassword] = useState(false);
	const toggleShowPassword = () => setShowPassword(!showPassword);

	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async (data: AuthAdminSchema) => {
		setIsLoading(true);
		try {
			const result = await authHelpers.signInAsAdmin({
				email: data.email,
				password: data.password,
			});

			if (result?.error) {
				toast.message("Credenciais inválidas", {
					description: "Verifique suas credenciais e tente novamente.",
				});
			} else if (result?.ok) {
				toast.message("Login realizado");
				router.push("/reservation");
			}
		} catch (error) {

			toast.message("Erro interno", {
				description: "Tente novamente mais tarde.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			className="flex flex-col gap-4 w-full"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<div className="flex flex-col gap-4 ">
				<label
					htmlFor="email"
					className="text-[14px] flex text-end gap-1 font-medium text-black"
				>
					<div className="flex items-end">Email</div>
					<p className="text-[12px] font-normal">(obrigatório)</p>
				</label>
				<Input
					type="email"
					id="email"
					placeholder="Email"
					{...form.register("email")}
					className="p-2 border rounded"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label
					htmlFor="password"
					className="text-[14px] flex text-end gap-1 font-medium text-black"
				>
					<div className="flex items-end">Senha</div>
					<p className="text-[12px] font-normal">(obrigatório)</p>
				</label>
				<div className="relative">
					<Input
						type={showPassword ? "text" : "password"}
						id="password"
						placeholder="Senha"
						{...form.register("password")}
						className="p-2 border rounded pr-10"
					/>
					<button
						type="button"
						onClick={toggleShowPassword}
						className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
					>
						{!showPassword ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
			</div>
			<Button
				type="submit"
				className="#000000 text-white p-2 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
				disabled={isLoading}
			>
				{isLoading && (
					<span className="w-4 h-4 border-2 border-t-2 border-t-white border-blue-500 rounded-full animate-spin"></span>
				)}
				Acessar conta
			</Button>
		</form>
	);
}
