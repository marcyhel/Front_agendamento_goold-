/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import {
	authSchema,
	AuthSchema,
	authMailSchema,
	AuthMailSchema,
} from "@/core/models/auth_cliente.model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { authHelpers } from "@/core/lib/auth_helpers";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState<"email" | "password">("email");
	const [emailConfirmed, setEmailConfirmed] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const emailForm = useForm<AuthMailSchema>({
		resolver: zodResolver(authMailSchema),
		defaultValues: {
			email: "",
		},
	});

	const passwordForm = useForm<AuthSchema>({
		resolver: zodResolver(authSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleEmailSubmit = async (data: AuthMailSchema) => {
		setLoading(true);
		try {
			const result = await authHelpers.checkEmail(data.email);

			if (result.exists) {
				setEmailConfirmed(data.email);
				passwordForm.setValue("email", data.email);
				await new Promise((resolve) => setTimeout(resolve, 300));
				setStep("password");
			} else {
				toast.message("Esse email não está cadastrado.");
			}
		} catch (err) {
			toast.message("Erro ao checar email", {
				description: "Estamos enfrentando problemas. Tente mais tarde.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordSubmit = async (credentials: AuthSchema) => {
		setLoading(true);
		try {
			const login = await authHelpers.signInAsUser(credentials);

			if (login?.error) {
				toast.message("Não foi possível fazer login", {
					description: "Verifique seu email e senha.",
				});
			} else if (login?.ok) {
				toast.message("Login efetuado com sucesso!");
				router.push("/reservation");
			}
		} catch {
			toast.message("Erro de autenticação", {
				description: "Tente novamente mais tarde.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleNavigateToSignup = () => {
		router.push("/register");
	};

	const togglePassword = () => setShowPassword((prev) => !prev);

	const EmailStep = () => (
		<form
			onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
			className="flex flex-col gap-4 w-full"
		>
			<div className="flex flex-col gap-2">
				<label htmlFor="email" className="text-sm font-medium text-black">
					E-mail <span className="text-xs font-normal">(Obrigatório)</span>
				</label>
				<Input
					id="email"
					type="email"
					placeholder="seu@email.com"
					{...emailForm.register("email")}
				/>
			</div>

			<Button
				type="submit"
				className="text-white bg-black p-2 rounded flex items-center justify-center gap-2 text-base font-semibold"
				disabled={loading || !emailForm.formState.isValid}
			>
				{loading && (
					<span className="w-4 h-4 border-2 border-t-white border-gray-500 rounded-full animate-spin"></span>
				)}
				Acessar conta
			</Button>

			<div className="flex justify-between items-center text-sm mt-2">
				<span>Ainda não tem um cadastro?</span>
				<Button variant="link" onClick={handleNavigateToSignup} className="text-black underline font-bold cursor-pointer">
					Cadastre-se
				</Button>
			</div>
		</form>
	);

	const PasswordStep = () => (
		<form
			onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
			className="flex flex-col gap-4 w-full"
		>
			<div className="flex flex-col gap-2">
				<label htmlFor="email" className="text-sm font-medium text-black">
					E-mail <span className="text-xs font-normal">(Obrigatório)</span>
				</label>
				<Input
					id="email"
					type="email"
					value={emailConfirmed}
					disabled
					className="bg-gray-100"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="password" className="text-sm font-medium text-black">
					Senha de acesso <span className="text-xs font-normal">(Obrigatório)</span>
				</label>
				<div className="relative">
					<Input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder="Digite sua senha"
						{...passwordForm.register("password")}
						className="pr-10"
					/>
					<button
						type="button"
						onClick={togglePassword}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
					>
						{showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
					</button>
				</div>
			</div>

			<Button
				type="submit"
				className="text-white bg-black p-2 rounded flex items-center justify-center gap-2 text-base font-semibold"
				disabled={loading || !passwordForm.formState.isValid}
			>
				{loading && (
					<span className="w-4 h-4 border-2 border-t-white border-gray-500 rounded-full animate-spin"></span>
				)}
				Acessar conta
			</Button>
			<div className="flex justify-between items-center text-sm mt-2">
				<span>Ainda não tem um cadastro?</span>
				<Button variant="link" onClick={handleNavigateToSignup} className="text-black underline font-bold cursor-pointer">
					Cadastre-se
				</Button>
			</div>
		</form>
	);

	return (
		<div className="w-full max-w-md mx-auto">
			{step === "email" ? <EmailStep /> : <PasswordStep />}
		</div>
	);
};

export default Login;
