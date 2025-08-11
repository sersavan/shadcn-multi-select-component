"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FocusIndicatorProps {
	className?: string;
}

export function FocusIndicator({ className }: FocusIndicatorProps) {
	const [isKeyboardUser, setIsKeyboardUser] = useState(false);

	useEffect(() => {
		let isUsingKeyboard = false;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Tab") {
				isUsingKeyboard = true;
				setIsKeyboardUser(true);
				document.body.classList.add("using-keyboard");
			}
		};
		const handleMouseDown = () => {
			if (isUsingKeyboard) {
				isUsingKeyboard = false;
				setIsKeyboardUser(false);
				document.body.classList.remove("using-keyboard");
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousedown", handleMouseDown);

		const style = document.createElement("style");
		style.textContent = `
      .using-keyboard *:focus {
        outline: 2px solid hsl(var(--ring)) !important;
        outline-offset: 2px !important;
        border-radius: 4px;
      }
      
      .using-keyboard button:focus,
      .using-keyboard [role="button"]:focus {
        box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring)) !important;
      }
      
      .using-keyboard input:focus,
      .using-keyboard textarea:focus,
      .using-keyboard select:focus {
        border-color: hsl(var(--ring)) !important;
        box-shadow: 0 0 0 1px hsl(var(--ring)) !important;
      }
      
      .using-keyboard a:focus {
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 4px;
      }
      
      /* Enhanced focus for custom components */
      .using-keyboard [data-state="open"]:focus,
      .using-keyboard [aria-expanded="true"]:focus {
        outline: 2px solid hsl(var(--ring)) !important;
        outline-offset: 2px !important;
      }
      
      /* Skip link styling when focused */
      .using-keyboard .sr-only:focus {
        position: fixed !important;
        top: 1rem !important;
        left: 1rem !important;
        width: auto !important;
        height: auto !important;
        padding: 0.5rem 1rem !important;
        background: hsl(var(--background)) !important;
        color: hsl(var(--foreground)) !important;
        border: 2px solid hsl(var(--ring)) !important;
        border-radius: 0.375rem !important;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
        z-index: 9999 !important;
        clip: unset !important;
        clip-path: unset !important;
      }
    `;
		document.head.appendChild(style);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleMouseDown);
			document.body.classList.remove("using-keyboard");
			document.head.removeChild(style);
		};
	}, []);

	return (
		<div
			className={cn("sr-only", className)}
			aria-live="polite"
			aria-atomic="true">
			{isKeyboardUser && "Keyboard navigation is active"}
		</div>
	);
}
