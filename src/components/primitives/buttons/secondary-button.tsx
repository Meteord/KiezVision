import React from "react";
import type { ButtonProps } from "./button-types.tsx";

const baseClasses =
	"bg-eb-50 text-eb-900 border-2 border-eb-900 font-black uppercase tracking-[0.08em] transition-colors hover:bg-coral-100 disabled:opacity-50 disabled:cursor-not-allowed";

export const SecondaryButton: React.FC<ButtonProps> = ({
	onClick,
	disabled,
	type = "button",
	ariaLabel,
	ariaPressed,
	ariaCurrent,
	title,
	children,
	className = "",
	testId,
}) => (
	<button
		type={type}
		onClick={onClick}
		disabled={disabled}
		aria-label={ariaLabel}
		aria-pressed={ariaPressed}
		aria-current={ariaCurrent}
		title={title}
		data-testid={testId}
		className={`${baseClasses} ${className}`.trim()}
	>
		{children}
	</button>
);
