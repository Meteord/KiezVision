import React from "react";
import type { ButtonProps } from "./button-types.tsx";

const baseClasses =
	"bg-coral-500 text-eb-50 border-2 border-coral-500 font-black uppercase tracking-[0.08em] transition-colors hover:bg-eb-900 hover:border-eb-900 disabled:opacity-50 disabled:cursor-not-allowed";

export const PrimaryButton: React.FC<ButtonProps> = ({
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
