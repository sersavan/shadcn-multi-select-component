"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ColorModeContextType {
	isGrayMode: boolean;
	setIsGrayMode: (value: boolean) => void;
	toggleGrayMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(
	undefined
);

export function ColorModeProvider({ children }: { children: ReactNode }) {
	const [isGrayMode, setIsGrayMode] = useState(true);

	const toggleGrayMode = () => {
		setIsGrayMode(!isGrayMode);
	};

	return (
		<ColorModeContext.Provider
			value={{
				isGrayMode,
				setIsGrayMode,
				toggleGrayMode,
			}}>
			{children}
		</ColorModeContext.Provider>
	);
}

export function useColorMode() {
	const context = useContext(ColorModeContext);
	if (context === undefined) {
		throw new Error("useColorMode must be used within a ColorModeProvider");
	}
	return context;
}
