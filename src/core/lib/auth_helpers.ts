import { signIn, SignInResponse } from "next-auth/react";
import api_client from "./api";
import { CheckEmailResponse } from "@/core/models/auth_cliente.model";

interface UserCredentials {
	email: string;
	password: string;
}


export const authHelpers = {

	async checkEmail(email: string): Promise<CheckEmailResponse> {
		try {
			const api_response = await api_client.post("/auth/verify_mail", { email });
			return api_response.data;
		} catch (error: unknown) {
			if (error && typeof error === "object" && "response" in error) {
				const http_error = error as {
					response?: { data?: { error?: string } };
				};
				if (http_error?.response?.data?.error === "User not found") {
					return { message: "User not found", exists: false };
				}
			}
			throw { message: "Erro interno", exists: false };
		}
	},


	async signInAsAdmin(
		credentials: UserCredentials
	): Promise<SignInResponse | undefined> {
		return await signIn("admin-credentials", {
			email: credentials.email,
			password: credentials.password,
			userType: "admin",
			redirect: false,
		});
	},


	async signInAsUser(
		credentials: UserCredentials
	): Promise<SignInResponse | undefined> {
		return await signIn("user-credentials", {
			email: credentials.email,
			password: credentials.password,
			userType: "user",
			redirect: false,
		});
	},


	async signInAfterRegister(
		email: string,
		password: string
	): Promise<SignInResponse | undefined> {
		return await signIn("user-credentials", {
			email,
			password,
			userType: "user",
			redirect: false,
		});
	},
};
