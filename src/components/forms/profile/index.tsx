"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	profileSchema,
	ProfileSchema,
	UpdateProfileModel,
} from "@/core/models/profile.model";
import { getCepService } from "@/core/service/cep";
import { getProfileService, updateProfileService } from "@/core/service/profile";
import Image from "next/image";

export default function ProfileForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingCep, setLoadingCep] = useState(false);
	const [loadingProfile, setLoadingProfile] = useState(true);
	const [cepFound, setCepFound] = useState(false);

	const form = useForm<ProfileSchema>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: "",
			lastName: "",
			email: "",
			password: "",
			cep: "",
			street: "",
			number: "",
			neighborhood: "",
			city: "",
			state: "",
		},
	});

	useEffect(() => {
		const loadProfile = async () => {
			try {
				setLoadingProfile(true);
				const profileData = await getProfileService();
				const { userProfile } = profileData;

				form.setValue("name", userProfile.name);
				form.setValue("lastName", userProfile.lastName);
				form.setValue("email", userProfile.email);
				form.setValue("cep", userProfile.address.cep);
				form.setValue("street", userProfile.address.street);
				form.setValue("number", userProfile.address.number);
				form.setValue("neighborhood", userProfile.address.neighborhood);
				form.setValue("city", userProfile.address.city);
				form.setValue("state", userProfile.address.state);
			} catch (error) {
				console.error("Erro ao carregar perfil:", error);
				toast.message("Erro ao carregar dados do perfil", {
					description: "Tente novamente mais tarde.",
				});
			} finally {
				setLoadingProfile(false);
			}
		};

		loadProfile();
	}, [form]);

	const toggleShowPassword = () => setShowPassword(!showPassword);

	const handleCepChange = async (cep: string) => {
		const cleanCep = cep.replace(/\D/g, "");

		if (cleanCep.length === 8) {
			setLoadingCep(true);
			try {
				const cepData = await getCepService(cleanCep);

				if (cepData && !cepData.erro) {
					form.setValue("street", cepData.logradouro || "");
					form.setValue("neighborhood", cepData.bairro || "");
					form.setValue("city", cepData.localidade || "");
					form.setValue("state", cepData.uf || "");

					const hasValidData = !!(
						cepData.logradouro && cepData.logradouro.trim() !== ""
					);
					setCepFound(hasValidData);

					if (hasValidData) {
						toast.message("CEP encontrado!");
					} else {
						toast.message("CEP encontrado, mas preencha os dados manualmente.");
					}
				}
			} catch {
				setCepFound(false);
				form.setValue("street", "");
				form.setValue("neighborhood", "");
				form.setValue("city", "");
				form.setValue("state", "");
				toast.message("CEP não encontrado. Preencha os dados manualmente.");
			} finally {
				setLoadingCep(false);
			}
		} else {
			setCepFound(false);
		}
	};

	const onSubmit = async (data: ProfileSchema) => {
		setIsLoading(true);

		try {
			const updateData: UpdateProfileModel = {
				user: {
					name: data.name,
					lastName: data.lastName,

				},
				address: {
					cep: data.cep.replace(/\D/g, ""),
					number: data.number,
					street: data.street,
					neighborhood: data.neighborhood,
					city: data.city,
					state: data.state,
				},
			};

			if (data.password && data.password.trim() !== "") {
				updateData.password = data.password;
			}

			await updateProfileService(updateData);
			toast.message("Perfil atualizado com sucesso!");
		} catch (error: unknown) {
			const errorMessage =
				error && typeof error === "object" && "response" in error
					? (error as { response?: { data?: { error?: string } } }).response
						?.data?.error || "Tente novamente mais tarde."
					: "Tente novamente mais tarde.";

			toast.message("Erro ao atualizar perfil", {
				description: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const formatCep = (value: string) => {
		const cleanCep = value.replace(/\D/g, "");
		if (cleanCep.length <= 5) {
			return cleanCep;
		}
		return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5, 8)}`;
	};

	if (loadingProfile) {
		return (
			<div className="flex flex-col   justify-center items-center">
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

	return (
		<form
			className="flex flex-col gap-4 w-full"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<div className="flex flex-col gap-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col gap-2">
						<label
							htmlFor="name"
							className="text-[14px] flex text-end gap-1 font-medium text-black"
						>
							<div className="flex items-end">Nome</div>
							<p className="text-[12px] font-normal">(Obrigatório)</p>
						</label>
						<Input
							type="text"
							id="name"
							placeholder="Nome"
							{...form.register("name")}
							className="p-2 border rounded"
						/>
						{form.formState.errors.name && (
							<p className="text-red-500 text-sm">
								{form.formState.errors.name.message}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="lastName"
							className="text-[14px] flex text-end gap-1 font-medium text-black"
						>
							<div className="flex items-end">Sobrenome</div>
							<p className="text-[12px] font-normal">(Obrigatório)</p>
						</label>
						<Input
							type="text"
							id="lastName"
							placeholder="Sobrenome"
							{...form.register("lastName")}
							className="p-2 border rounded"
						/>
						{form.formState.errors.lastName && (
							<p className="text-red-500 text-sm">
								{form.formState.errors.lastName.message}
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="emails"
						className="text-[14px] flex text-end gap-1 font-medium text-black"
					>
						<div className="flex items-end">E-mail</div>
						<p className="text-[12px] font-normal">(Obrigatório)</p>
					</label>
					<Input
						type="emails"
						id="emails"
						placeholder="E-mail"

						className="p-2 border rounded"
						disabled
					/>

				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="password"
						className="text-[14px] flex text-end gap-1 font-medium text-black"
					>
						<div className="flex items-end">Nova senha</div>
						<p className="text-[12px] font-normal">(Opcional)</p>
					</label>
					<div className="relative">
						<Input
							type={showPassword ? "text" : "password"}
							id="password"
							placeholder="Deixe em branco para não alterar"
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
					{form.formState.errors.password && (
						<p className="text-red-500 text-sm">
							{form.formState.errors.password.message}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="cep"
						className="text-[14px] flex text-end gap-1 font-medium text-black"
					>
						<div className="flex items-end">CEP</div>
						<p className="text-[12px] font-normal">(Obrigatório)</p>
					</label>
					<Input
						type="text"
						id="cep"
						placeholder="CEP"
						{...form.register("cep", {
							onChange: (e) => {
								const formatted = formatCep(e.target.value);
								form.setValue("cep", formatted);
								handleCepChange(formatted);
							},
						})}
						className="p-2 border rounded"
						maxLength={9}
					/>
					{loadingCep && (
						<p className="text-blue-500 text-sm">Buscando CEP...</p>
					)}
					{form.formState.errors.cep && (
						<p className="text-red-500 text-sm">
							{form.formState.errors.cep.message}
						</p>
					)}
				</div>

				<>
					<div className="flex flex-col gap-2">
						<label
							htmlFor="street"
							className="text-[14px] flex text-end gap-1 font-medium text-black"
						>
							<div className="flex items-end">Endereço</div>
							<p className="text-[12px] font-normal">(Obrigatório)</p>
						</label>
						<Input
							type="text"
							id="street"
							placeholder="Endereço"
							{...form.register("street")}
							className="p-2 border rounded"
							disabled={cepFound}
						/>
						{form.formState.errors.street && (
							<p className="text-red-500 text-sm">
								{form.formState.errors.street.message}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="number"
							className="text-[14px] flex text-end gap-1 font-medium text-black"
						>
							<div className="flex items-end">Número</div>
							<p className="text-[12px] font-normal">(Obrigatório)</p>
						</label>
						<Input
							type="text"
							id="number"
							placeholder="Número"
							{...form.register("number")}
							className="p-2 border rounded"
						/>
						{form.formState.errors.number && (
							<p className="text-red-500 text-sm">
								{form.formState.errors.number.message}
							</p>
						)}{" "}
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="neighborhood"
							className="text-[14px] flex text-end gap-1 font-medium text-black"
						>
							<div className="flex items-end">Bairro</div>
							<p className="text-[12px] font-normal">(Obrigatório)</p>
						</label>
						<Input
							type="text"
							id="neighborhood"
							placeholder="Bairro"
							{...form.register("neighborhood")}
							className="p-2 border rounded"
							disabled={cepFound}
						/>
						{form.formState.errors.neighborhood && (
							<p className="text-red-500 text-sm">
								{form.formState.errors.neighborhood.message}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="city"
							className="text-[14px] flex text-end gap-1 font-medium text-black"
						>
							<div className="flex items-end">Cidade</div>
							<p className="text-[12px] font-normal">(Obrigatório)</p>
						</label>
						<Input
							type="text"
							id="city"
							placeholder="Cidade"
							{...form.register("city")}
							className="p-2 border rounded"
							disabled={cepFound}
						/>
						{form.formState.errors.city && (
							<p className="text-red-500 text-sm">
								{form.formState.errors.city.message}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="state"
							className="text-[14px] flex text-end gap-1 font-medium text-black"
						>
							<div className="flex items-end">Estado</div>
							<p className="text-[12px] font-normal">(Obrigatório)</p>
						</label>
						<Input
							type="text"
							id="state"
							placeholder="Estado"
							{...form.register("state")}
							className="p-2 border rounded"
							disabled={cepFound}
							maxLength={2}
						/>
						{form.formState.errors.state && (
							<p className="text-red-500 text-sm">
								{form.formState.errors.state.message}
							</p>
						)}
					</div>
				</>
			</div>

			<Button
				type="submit"
				className="bg-black hover:bg-gray-800 text-white p-2 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
				disabled={isLoading || !form.formState.isValid}
			>
				{isLoading && (
					<span className="w-4 h-4 border-2 border-t-2 border-t-white border-blue-500 rounded-full animate-spin"></span>
				)}
				Salvar
			</Button>
		</form>
	);
}
