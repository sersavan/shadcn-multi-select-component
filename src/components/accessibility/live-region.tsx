"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LiveRegionProps {
	className?: string;
}

let announceFunction:
	| ((message: string, priority?: "polite" | "assertive") => void)
	| null = null;

export function LiveRegion({ className }: LiveRegionProps) {
	const [politeMessage, setPoliteMessage] = useState("");
	const [assertiveMessage, setAssertiveMessage] = useState("");

	useEffect(() => {
		announceFunction = (
			message: string,
			priority: "polite" | "assertive" = "polite"
		) => {
			if (priority === "assertive") {
				setAssertiveMessage(message);
				setTimeout(() => setAssertiveMessage(""), 100);
			} else {
				setPoliteMessage(message);
				setTimeout(() => setPoliteMessage(""), 100);
			}
		};

		return () => {
			announceFunction = null;
		};
	}, []);

	return (
		<div className={cn("sr-only", className)}>
			<div aria-live="polite" aria-atomic="true" role="status">
				{politeMessage}
			</div>
			<div aria-live="assertive" aria-atomic="true" role="alert">
				{assertiveMessage}
			</div>
		</div>
	);
}

export function announce(
	message: string,
	priority: "polite" | "assertive" = "polite"
) {
	if (announceFunction) {
		announceFunction(message, priority);
	}
}
