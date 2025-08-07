"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useColorMode } from "@/contexts/color-mode-context";

export function ColorModeToggle() {
	const { isGrayMode, toggleGrayMode } = useColorMode();

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleGrayMode}
			className={`relative transition-all duration-300 ${
				isGrayMode
					? "bg-transparent hover:bg-muted"
					: "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
			}`}
			title={isGrayMode ? "Enable Colors" : "Disable Colors"}>
			{isGrayMode ? (
				<Icons.eyeOff className="h-5 w-5 text-muted-foreground" />
			) : (
				<Icons.eye className="h-5 w-5" />
			)}
			<span className="sr-only">
				{isGrayMode ? "Enable Colors" : "Disable Colors"}
			</span>
		</Button>
	);
}
