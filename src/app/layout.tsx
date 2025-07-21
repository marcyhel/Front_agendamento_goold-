
import type { Metadata } from "next";
import React from "react";

import { Geist as GeistSans, Geist_Mono as GeistMono, Montserrat as MontserratFont } from "next/font/google";

import { AuthProvider } from "@/util/auth_provider";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const fontGeistSans = GeistSans({
	subsets: ["latin"],
	variable: "--geist-sans-font",
});

const fontGeistMono = GeistMono({
	subsets: ["latin"],
	variable: "--geist-mono-font",
});

const fontMontserrat = MontserratFont({
	subsets: ["latin"],
	variable: "--montserrat-font",
	weight: [
		"100", "200", "300", "400", "500", "600", "700", "800", "900"
	],
});

export const metadata: Metadata = {
	title: "Grupo Goold",
	description: "Salas",
};

const LayoutRoot = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<html lang="en">
			<body
				className={[
					fontGeistSans.variable,
					fontGeistMono.variable,
					fontMontserrat.variable,
					"font-sans antialiased",
					"bg-[#F6F4F1] text-foreground",
					"tracking-tight leading-normal",
					"h-screen flex flex-col items-center justify-center",
					"select-none text-sm sm:text-base"
				].join(" ")}
			>
				<AuthProvider>
					{children}
					<Toaster richColors />
				</AuthProvider>
			</body>
		</html>
	);
};

export default LayoutRoot;
