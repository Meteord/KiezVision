import React from "react";
import { Trees, Droplets, Ban, Sun, Armchair, Bike, Wand2 } from "lucide-react";
import { TransformationType, type ProjectPreset } from "../../../types.ts";

interface QuickActionsProps {
	onAction: (prompt: string) => void | Promise<void>;
	disabled: boolean;
	language?: "en" | "de";
	/** In Area Edit, presets need a painted mask first — otherwise the run aborts. */
	presetsBlocked?: boolean;
	presets?: ProjectPreset[];
}

const swallowAsync = (p: Promise<void> | void) => {
	if (p && typeof (p as Promise<void>).catch === "function") {
		void (p as Promise<void>).catch(() => {});
	}
};

export const QuickActions: React.FC<QuickActionsProps> = ({
	onAction,
	disabled,
	language = "en",
	presetsBlocked = false,
	presets,
}) => {
	const presetLabels = {
		en: {
			sunny: "Sunny Day",
			nature: "Add Nature",
			water: "Add Water",
			noCars: "No Cars",
			bench: "Bench",
			bikeRack: "Bike Rack",
			presetsBlockedHint:
				"In Area Edit, brush a region first — or switch to Compare for full-image presets.",
		},
		de: {
			sunny: "Sonnig",
			nature: "Natur pur",
			water: "Mehr Wasser",
			noCars: "Ohne Autos",
			bench: "Sitzbank",
			bikeRack: "Fahrradständer",
			presetsBlockedHint:
				"Im Bereich bearbeiten zuerst markieren — oder zu Vergleichen wechseln für ganze Bild-Vorlagen.",
		},
	}[language];

	const presetDisabled = disabled || presetsBlocked;

	const defaultActions = [
		{
			label: presetLabels.sunny,
			prompt: TransformationType.SUNNY_DAY,
			icon: (
				<Sun className="w-6 h-6 md:w-8 md:h-8 text-amber-400 fill-amber-400/20" />
			),
		},
		{
			label: presetLabels.nature,
			prompt: TransformationType.ADD_TREES,
			icon: (
				<Trees className="w-6 h-6 md:w-8 md:h-8 text-emerald-500 fill-emerald-500/20" />
			),
		},
		{
			label: presetLabels.water,
			prompt: TransformationType.ADD_WATER,
			icon: (
				<Droplets className="w-6 h-6 md:w-8 md:h-8 text-sky-500 fill-sky-500/20" />
			),
		},
		{
			label: presetLabels.noCars,
			prompt: TransformationType.REMOVE_CARS,
			icon: <Ban className="w-6 h-6 md:w-8 md:h-8 text-red-500" />,
		},
		{
			label: presetLabels.bench,
			prompt: TransformationType.ADD_BENCH,
			icon: (
				<Armchair className="w-6 h-6 md:w-8 md:h-8 text-amber-800 fill-amber-800/15" />
			),
		},
		{
			label: presetLabels.bikeRack,
			prompt: TransformationType.ADD_BIKE_RACK,
			icon: <Bike className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />,
		},
	];
	const actions = presets
		? presets.map((preset) => ({
				label: preset.label,
				prompt: preset.prompt,
				icon: <Wand2 className="w-6 h-6 md:w-8 md:h-8 text-tsb" />,
			}))
		: defaultActions;

	return (
		<div className="space-y-3 mt-3 md:mt-4">
			{presetsBlocked && (
				<p
					className="text-xs font-bold text-eb-900 leading-snug border border-eb-900/20 bg-coral-100/40 px-2 py-2"
					role="status"
				>
					{presetLabels.presetsBlockedHint}
				</p>
			)}
			<div className="grid grid-cols-2 gap-2 md:gap-3">
				{actions.map((action) => (
					<ActionBtn
						key={`${action.label}-${action.prompt}`}
						icon={action.icon}
						label={action.label}
						onClick={() => swallowAsync(onAction(action.prompt))}
						disabled={presetDisabled}
					/>
				))}
			</div>
		</div>
	);
};

interface ActionBtnProps {
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
	disabled?: boolean;
}

const ActionBtn: React.FC<ActionBtnProps> = ({
	icon,
	label,
	onClick,
	disabled,
}) => (
	<button
		onClick={onClick}
		disabled={disabled}
		className="flex flex-col items-center justify-center h-24 md:h-28 bg-eb-50 border-2 border-eb-900 transition-colors group disabled:opacity-30 disabled:cursor-not-allowed hover:bg-coral-100"
	>
		<div className="mb-1 md:mb-2">{icon}</div>
		<span className="text-[9px] md:text-[10px] font-black text-eb-900 tracking-tight md:tracking-widest text-center leading-tight px-0.5">
			{label}
		</span>
	</button>
);
