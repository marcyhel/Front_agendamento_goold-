import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { adminAuthService } from "@/core/service/admin";
import { userAuthService } from "@/core/service/auth";

export const authConfig: AuthOptions = {
	providers: [
		CredentialsProvider({
			id: "admin-credentials",
			name: "Admin Login",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
				userType: { label: "User Type", type: "hidden" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					const response = await adminAuthService({
						email: credentials.email,
						password: credentials.password,
					});

					if (response.accessToken && !response.error) {
						const tokenPayload = JSON.parse(
							Buffer.from(
								response.accessToken.split(".")[1],
								"base64"
							).toString()
						);

						return {
							id: tokenPayload.userId,
							email: tokenPayload.email,
							name: tokenPayload.name || "",
							lastName: tokenPayload.lastName || "",
							role: tokenPayload.role,
							canViewLogs: tokenPayload.canViewLogs,
							canManageScheduling: tokenPayload.canManageScheduling,
							status: tokenPayload.status || "active",
							accessToken: response.accessToken,
						};
					}
					return null;
				} catch (error) {
					console.error("Admin authorization error:", error);
					return null;
				}
			},
		}),
		CredentialsProvider({
			id: "user-credentials",
			name: "User Login",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
				userType: { label: "User Type", type: "hidden" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					const response = await userAuthService({
						email: credentials.email,
						password: credentials.password,
					});

					if (response.accessToken && !response.error) {
						const tokenPayload = JSON.parse(
							Buffer.from(
								response.accessToken.split(".")[1],
								"base64"
							).toString()
						);

						return {
							id: tokenPayload.userId,
							email: tokenPayload.email,
							name: tokenPayload.name || "",
							lastName: tokenPayload.lastName || "",
							role: tokenPayload.role,
							canViewLogs: tokenPayload.canViewLogs || false,
							canManageScheduling: tokenPayload.canManageScheduling || false,
							status: tokenPayload.status || "active",
							accessToken: response.accessToken,
						};
					}
					return null;
				} catch (error) {
					console.error("User authorization error:", error);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 24 * 60 * 60, // 24 horas
	},
	jwt: {
		maxAge: 24 * 60 * 60, // 24 horas
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.lastName = user.lastName;
				token.role = user.role;
				token.canViewLogs = user.canViewLogs;
				token.canManageScheduling = user.canManageScheduling;
				token.status = user.status;
				token.accessToken = user.accessToken;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user = {
					id: token.id as string,
					email: token.email as string,
					name: token.name as string,
					lastName: token.lastName as string,
					role: token.role as "user" | "admin",
					canViewLogs: token.canViewLogs as boolean,
					canManageScheduling: token.canManageScheduling as boolean,
					status: token.status as "active" | "inactive",
				};
				session.accessToken = token.accessToken as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
export const authOptions = authConfig;