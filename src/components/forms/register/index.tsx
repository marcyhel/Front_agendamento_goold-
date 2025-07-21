/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	registerSchema,
	RegisterSchema,
	RegisterModel,
} from "@/core/models/register.model";
import { getCepService } from "@/core/service/cep";
import { registerService } from "@/core/service/register";
import { authHelpers } from "@/core/lib/auth_helpers";


export default function SignUpForm() {
	const navigation = useRouter();
	const search_params = useSearchParams();
	const email_from_url = search_params.get("email");

	// Estados para controle de UI
	const [password_visible, set_password_visible] = useState<boolean>(false);
	const [confirm_password_visible, set_confirm_password_visible] = useState<boolean>(false);
	const [is_submitting, set_is_submitting] = useState<boolean>(false);
	const [is_searching_cep, set_is_searching_cep] = useState<boolean>(false);
	const [is_cep_found, set_is_cep_found] = useState<boolean>(false);
	const [show_address_section, set_show_address_section] = useState<boolean>(false);

	// Configuração do formulário com validação Zod
	const registration_form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			lastName: "",
			email: email_from_url || "",
			password: "",
			confirmPassword: "",
			cep: "",
			street: "",
			number: "",
			neighborhood: "",
			city: "",
			state: "",
		},
	});

	// Efeito para preencher email automaticamente quando vindo de redirecionamento
	useEffect(() => {
		if (email_from_url) {
			registration_form.setValue("email", email_from_url);
			toast.message("Email preenchido automaticamente!");
		}
	}, [email_from_url, registration_form]);

	// Funções auxiliares para controle de visibilidade de senha
	const toggle_password_visibility = () => set_password_visible(!password_visible);
	const toggle_confirm_password_visibility = () =>
		set_confirm_password_visible(!confirm_password_visible);

	/**
	 * Busca informações de endereço a partir do CEP informado
	 * @param cep - CEP a ser consultado
	 */
	const fetch_address_by_cep = async (cep: string): Promise<void> => {
		const numeric_cep = cep.replace(/\D/g, "");

		if (numeric_cep.length === 8) {
			set_is_searching_cep(true);
			try {
				const address_data = await getCepService(numeric_cep);

				if (address_data && !address_data.erro) {
					// Preenche os campos do formulário com os dados retornados
					registration_form.setValue("street", address_data.logradouro || "");
					registration_form.setValue("neighborhood", address_data.bairro || "");
					registration_form.setValue("city", address_data.localidade || "");
					registration_form.setValue("state", address_data.uf || "");

					// Verifica se o CEP retornou um endereço válido
					const has_complete_address = !!(
						address_data.logradouro && address_data.logradouro.trim() !== ""
					);
					set_is_cep_found(has_complete_address);
					set_show_address_section(true);

					// Notifica o usuário sobre o resultado da busca
					if (has_complete_address) {
						toast.message("CEP encontrado!");
					} else {
						toast.message("CEP encontrado, mas preencha os dados manualmente.");
					}
				}
			} catch (error) {

				// Limpa os campos em caso de erro
				set_is_cep_found(false);
				set_show_address_section(true);
				registration_form.setValue("street", "");
				registration_form.setValue("neighborhood", "");
				registration_form.setValue("city", "");
				registration_form.setValue("state", "");
				toast.message("CEP não encontrado. Preencha os dados manualmente.");
			} finally {
				set_is_searching_cep(false);
			}
		} else {
			// Esconde os campos de endereço se o CEP não tiver 8 dígitos
			set_is_cep_found(false);
			set_show_address_section(false);
		}
	};

	/**
	 * Processa o envio do formulário de cadastro
	 * @param data - Dados do formulário validados pelo Zod
	 */
	const handle_registration = async (data: RegisterSchema): Promise<void> => {
		set_is_submitting(true);

		try {
			// Prepara os dados para envio à API
			const user_data: RegisterModel = {
				user: {
					name: data.name,
					lastName: data.lastName,
					email: data.email,
					role: "user",
					status: "active",
					canViewLogs: true,
					canManageScheduling: true,
				},
				address: {
					cep: data.cep.replace(/\D/g, ""),
					number: data.number,
					street: data.street,
					neighborhood: data.neighborhood,
					city: data.city,
					state: data.state,
				},
				password: data.password,
				confirmPassword: data.confirmPassword,
			};

			// Envia os dados para a API
			await registerService(user_data);
			toast.message("Cadastro realizado com sucesso!");

			// Tenta fazer login automático após o cadastro
			const auth_result = await authHelpers.signInAfterRegister(
				data.email,
				data.password
			);

			// Redireciona com base no resultado do login
			if (auth_result?.ok) {
				toast.message("Login realizado automaticamente!");
				navigation.push("/reservation");
			} else {
				toast.message("Cadastro realizado! Faça login para continuar.");
				navigation.push("/");
			}
		} catch (error: unknown) {
			// Extrai a mensagem de erro da resposta da API
			const error_message =
				error && typeof error === "object" && "response" in error
					? (error as { response?: { data?: { error?: string } } }).response
						?.data?.error || "Tente novamente mais tarde."
					: "Tente novamente mais tarde.";

			toast.message("Erro ao realizar cadastro", {
				description: error_message,
			});
		} finally {
			set_is_submitting(false);
		}
	};


	const format_cep = (value: string): string => {
		const numeric_cep = value.replace(/\D/g, "");
		if (numeric_cep.length <= 5) {
			return numeric_cep;
		}
		return `${numeric_cep.slice(0, 5)}-${numeric_cep.slice(5, 8)}`;
	};

	return (
		<form
			className="flex flex-col gap-4 w-full"
			onSubmit={registration_form.handleSubmit(handle_registration)}
			noValidate
		>
			<section className="flex flex-col gap-4">
				{/* Campos de nome e sobrenome */}
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
							{...registration_form.register("name")}
							className="p-2 border rounded"
						/>
						{registration_form.formState.errors.name && (
							<p className="text-red-500 text-sm">
								{registration_form.formState.errors.name.message}
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
							{...registration_form.register("lastName")}
							className="p-2 border rounded"
						/>
						{registration_form.formState.errors.lastName && (
							<p className="text-red-500 text-sm">
								{registration_form.formState.errors.lastName.message}
							</p>
						)}
					</div>
				</div>

				{/* Campo de email */}
				<div className="flex flex-col gap-2">
					<label
						htmlFor="email"
						className="text-[14px] flex text-end gap-1 font-medium text-black"
					>
						<div className="flex items-end">E-mail</div>
						<p className="text-[12px] font-normal">(Obrigatório)</p>
					</label>
					<Input
						type="email"
						id="email"
						placeholder="E-mail"
						{...registration_form.register("email")}
						className="p-2 border rounded"
						aria-invalid={registration_form.formState.errors.email ? "true" : "false"}
					/>
					{registration_form.formState.errors.email && (
						<p className="text-red-500 text-sm">
							{registration_form.formState.errors.email.message}
						</p>
					)}
				</div>

				{/* Campo de senha */}
				<div className="flex flex-col gap-2">
					<label
						htmlFor="password"
						className="text-[14px] flex text-end gap-1 font-medium text-black"
					>
						<div className="flex items-end">Senha</div>
						<p className="text-[12px] font-normal">(Obrigatório)</p>
					</label>
					<div className="relative">
						<Input
							type={password_visible ? "text" : "password"}
							id="password"
							placeholder="Senha"
							{...registration_form.register("password")}
							className="p-2 border rounded pr-10"
							aria-invalid={registration_form.formState.errors.password ? "true" : "false"}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 flex items-center pr-3"
							onClick={toggle_password_visibility}
							aria-label={password_visible ? "Ocultar senha" : "Mostrar senha"}
						>
							{password_visible ? (
								<EyeOff className="h-5 w-5 text-gray-400" />
							) : (
								<Eye className="h-5 w-5 text-gray-400" />
							)}
						</button>
					</div>
					{registration_form.formState.errors.password && (
						<p className="text-red-500 text-sm" role="alert">
							{registration_form.formState.errors.password.message}
						</p>
					)}
				</div>

				{/* Campo de confirmação de senha */}
				<div className="flex flex-col gap-2">
					<label
						htmlFor="confirmPassword"
						className="text-[14px] flex text-end gap-1 font-medium text-black"
					>
						<div className="flex items-end">Confirmar Senha</div>
						<p className="text-[12px] font-normal">(Obrigatório)</p>
					</label>
					<div className="relative">
						<Input
							type={confirm_password_visible ? "text" : "password"}
							id="confirmPassword"
							placeholder="Confirmar Senha"
							{...registration_form.register("confirmPassword")}
							className="p-2 border rounded pr-10"
							aria-invalid={registration_form.formState.errors.confirmPassword ? "true" : "false"}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 flex items-center pr-3"
							onClick={toggle_confirm_password_visibility}
							aria-label={confirm_password_visible ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
						>
							{confirm_password_visible ? (
								<EyeOff className="h-5 w-5 text-gray-400" />
							) : (
								<Eye className="h-5 w-5 text-gray-400" />
							)}
						</button>
					</div>
					{registration_form.formState.errors.confirmPassword && (
						<p className="text-red-500 text-sm" role="alert">
							{registration_form.formState.errors.confirmPassword.message}
						</p>
					)}
				</div>
				<div className="w-full border-t"></div>
				{/* Campo de CEP */}
				<div className="flex flex-col gap-2">
					<label
						htmlFor="cep"
						className="text-[14px] flex text-end gap-1 font-medium text-black"
					>
						<div className="flex items-end">CEP</div>
						<p className="text-[12px] font-normal">(Obrigatório)</p>
					</label>
					<div className="relative">
						<Input
							type="text"
							id="cep"
							placeholder="insira seu CEP"
							{...registration_form.register("cep", {
								onChange: (e) => {
									const formattedValue = format_cep(e.target.value);
									e.target.value = formattedValue;
									fetch_address_by_cep(formattedValue);
								},
							})}
							className="p-2 border rounded"
							aria-invalid={registration_form.formState.errors.cep ? "true" : "false"}
							maxLength={9}
							aria-describedby="cep-format"
						/>
						{is_searching_cep && (
							<div className="absolute inset-y-0 right-0 flex items-center pr-3">
								<Loader2 className="h-4 w-4 animate-spin text-gray-400" aria-hidden="true" />
								<span className="sr-only">Buscando endereço...</span>
							</div>
						)}
					</div>
					<span id="cep-format" className="text-xs text-gray-500">Formato: 00000-000</span>
					{registration_form.formState.errors.cep && (
						<p className="text-red-500 text-sm" role="alert">
							{registration_form.formState.errors.cep.message}
						</p>
					)}
				</div>

				{/* Seção de endereço - exibida após busca de CEP */}
				{show_address_section && (
					<>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="street"
								className="text-[14px] flex text-end gap-1 font-medium text-black"
							>
								<div className="flex items-end">Endereço</div>
								<p className="text-[12px] font-normal">
									(Obrigatório)
								</p>
							</label>
							<Input
								type="text"
								id="street"
								placeholder="Rua"
								{...registration_form.register("street")}
								className="p-2 border rounded"
								aria-invalid={registration_form.formState.errors.street ? "true" : "false"}
							/>
							{registration_form.formState.errors.street && (
								<p className="text-red-500 text-sm" role="alert">
									{registration_form.formState.errors.street.message}
								</p>
							)}
						</div>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="number"
								className="text-[14px] flex text-end gap-1 font-medium text-black"
							>
								<div className="flex items-end">Número</div>
								<p className="text-[12px] font-normal">
									(Obrigatório)
								</p>
							</label>
							<Input
								type="text"
								id="number"
								placeholder="Número"
								{...registration_form.register("number")}
								className="p-2 border rounded"
								aria-invalid={registration_form.formState.errors.number ? "true" : "false"}
							/>
							{registration_form.formState.errors.number && (
								<p className="text-red-500 text-sm" role="alert">
									{registration_form.formState.errors.number.message}
								</p>
							)}
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
								{...registration_form.register("neighborhood")}
								className="p-2 border rounded"
								aria-invalid={registration_form.formState.errors.neighborhood ? "true" : "false"}
							/>
							{registration_form.formState.errors.neighborhood && (
								<p className="text-red-500 text-sm" role="alert">
									{registration_form.formState.errors.neighborhood.message}
								</p>
							)}
						</div>


						<div className="flex flex-col gap-2">
							<label
								htmlFor="city"
								className="text-[14px] flex text-end gap-1 font-medium text-black"
							>
								<div className="flex items-end">Cidade</div>
								<p className="text-[12px] font-normal">
									(Obrigatório)
								</p>
							</label>
							<Input
								type="text"
								id="city"
								placeholder="Cidade"
								{...registration_form.register("city")}
								className="p-2 border rounded"
								aria-invalid={registration_form.formState.errors.city ? "true" : "false"}
							/>
							{registration_form.formState.errors.city && (
								<p className="text-red-500 text-sm" role="alert">
									{registration_form.formState.errors.city.message}
								</p>
							)}
						</div>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="state"
								className="text-[14px] flex text-end gap-1 font-medium text-black"
							>
								<div className="flex items-end">Estado</div>
								<p className="text-[12px] font-normal">
									(Obrigatório)
								</p>
							</label>
							<Input
								type="text"
								id="state"
								placeholder="Estado"
								{...registration_form.register("state")}
								className="p-2 border rounded"
								aria-invalid={registration_form.formState.errors.state ? "true" : "false"}
							/>
							{registration_form.formState.errors.state && (
								<p className="text-red-500 text-sm" role="alert">
									{registration_form.formState.errors.state.message}
								</p>
							)}
						</div>

					</>
				)}
			</section>

			{/* Botão de envio do formulário */}
			<Button
				type="submit"
				className="bg-black hover:bg-gray-800 text-white p-2 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
				disabled={is_submitting}
				aria-busy={is_submitting}
			>
				{is_submitting && (
					<span className="w-4 h-4 border-2 border-t-2 border-t-white border-blue-500 rounded-full animate-spin"></span>
				)}
				Cadastrar-se
			</Button>



		</form>
	);
}
