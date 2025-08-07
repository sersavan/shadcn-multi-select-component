import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { ColorModeProvider } from "@/contexts/color-mode-context";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Multi-Select Component | shadcn/ui React TypeScript",
	description:
		"A powerful and flexible multi-select component built with React, TypeScript, Tailwind CSS, and shadcn/ui. Features animations, search, multiple variants, and full accessibility support.",
	keywords: [
		"react",
		"typescript",
		"shadcn",
		"tailwind",
		"multi-select",
		"component",
		"ui",
	],
	authors: [{ name: "sersavan", url: "https://github.com/sersavan" }],
	openGraph: {
		title: "Multi-Select Component | shadcn/ui React TypeScript",
		description:
			"A powerful and flexible multi-select component with animations, search, and multiple variants",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background antialiased",
					inter.className
				)}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange>
					<ColorModeProvider>
						<div className="relative flex min-h-screen flex-col bg-background">
							<SiteHeader />
							{children}
						</div>
					</ColorModeProvider>
				</ThemeProvider>
				<Toaster position="bottom-center" />
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
