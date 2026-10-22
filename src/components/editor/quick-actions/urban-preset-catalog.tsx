import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
	URBAN_CATEGORIES,
	URBAN_PRESETS,
	buildUrbanPresetPrompt,
	type UrbanCategoryId,
	type UrbanLanguage,
	type UrbanStrength,
} from "../../../data/urbanPresets.ts";

interface UrbanPresetCatalogProps {
	onAction: (prompt: string) => void | Promise<void>;
	disabled: boolean;
	language: UrbanLanguage;
	/** Presets are scoped to the current image mask, not a full-image rewrite. */
	isMaskMode: boolean;
	hasSelection: boolean;
}

const STRENGTHS: readonly UrbanStrength[] = ["low", "medium", "high"];

const COPY = {
	de: {
		title: "Stadt gestalten – München 2040",
		intro:
			"22 Gestaltungsideen, abgeleitet aus den Zielen des Stadtentwicklungsplans 2040. Keine offiziellen Vorlagen der Stadt München.",
		category: "Themenbereich",
		strength: "Eingriffsstärke",
		levels: ["Wenig", "Mittel", "Stark"],
		apply: "Ausgewählte Gestaltung anwenden",
		selectFirst:
			"Wechsle zu „Bereich bearbeiten“ und markiere die Fläche im Bild.",
		markFirst:
			"Markiere zuerst die zu verändernde Fläche mit den Auswahlwerkzeugen.",
		warning:
			"Auch bei „Stark“ bleibt die Auswahlgrenze verbindlich. Für Bäume oder Spielgeräte muss die gesamte sichtbare Fläche einschließlich Krone bzw. Gerät ausgewählt sein. Nur Visualisierung, keine bauliche Freigabe.",
	},
	en: {
		title: "Design public spaces – Munich 2040",
		intro:
			"22 ideas inspired by Munich's Urban Development Plan 2040. These are not official City of Munich presets.",
		category: "Category",
		strength: "Intervention intensity",
		levels: ["Low", "Medium", "High"],
		apply: "Apply selected design",
		selectFirst:
			"Switch to Area Edit and select the part of the image to change.",
		markFirst: "Select an area on the image using the selection tools first.",
		warning:
			"Even at High, the selection boundary remains binding. For trees or play structures, select the entire visible footprint including canopy or equipment. Visualization only, not engineering approval.",
	},
} as const;

/**
 * Built-in public-space ideas live alongside project-specific quick actions.
 * Existing ProjectPreset data and project storage are not modified.
 */
export const UrbanPresetCatalog: React.FC<UrbanPresetCatalogProps> = ({
	onAction,
	disabled,
	language,
	isMaskMode,
	hasSelection,
}) => {
	const [categoryId, setCategoryId] = useState<UrbanCategoryId>("stay");
	const [selectedId, setSelectedId] = useState("park-bench");
	const [strength, setStrength] = useState<UrbanStrength>("medium");
	const copy = COPY[language];
	const category = URBAN_CATEGORIES.find((item) => item.id === categoryId);
	const visiblePresets = URBAN_PRESETS.filter(
		(item) => item.category === categoryId,
	);
	const selectedPreset =
		visiblePresets.find((item) => item.id === selectedId) ?? visiblePresets[0];
	const canApply = Boolean(
		selectedPreset && isMaskMode && hasSelection && !disabled,
	);

	const changeCategory = (nextCategory: UrbanCategoryId) => {
		setCategoryId(nextCategory);
		const firstPreset = URBAN_PRESETS.find(
			(item) => item.category === nextCategory,
		);
		if (firstPreset) setSelectedId(firstPreset.id);
	};

	const applyPreset = () => {
		if (!canApply || !selectedPreset) return;
		const prompt = buildUrbanPresetPrompt(selectedPreset, strength);
		const pending = onAction(prompt);
		if (pending)
			void Promise.resolve(pending).catch(() => {
				/* Asynchronous errors are handled by the editor's onTransform. */
			});
	};

	return (
		<section
			className="mt-6 border-t-2 border-eb-900 pt-5 space-y-3"
			aria-label={copy.title}
		>
			<div className="flex items-center gap-2">
				<SlidersHorizontal
					className="w-5 h-5 shrink-0 text-eb-900"
					aria-hidden
				/>
				<h4 className="font-black text-sm text-eb-900">{copy.title}</h4>
			</div>
			<p className="text-xs text-eb-900/80 leading-relaxed">{copy.intro}</p>

			<label
				htmlFor="urban-preset-category"
				className="block text-xs font-black text-eb-900"
			>
				{copy.category}
			</label>
			<select
				id="urban-preset-category"
				value={categoryId}
				onChange={(event) =>
					changeCategory(event.target.value as UrbanCategoryId)
				}
				className="w-full h-10 border-2 border-eb-900 bg-white px-2 text-sm font-bold text-eb-900"
			>
				{URBAN_CATEGORIES.map((item) => (
					<option key={item.id} value={item.id}>
						{item.title[language]}
					</option>
				))}
			</select>
			{category && (
				<p className="text-xs text-eb-900/75">
					{category.description[language]}
				</p>
			)}

			<div className="max-h-64 overflow-y-auto border border-eb-900/25 bg-gray-50 p-2 space-y-2">
				{visiblePresets.map((preset) => (
					<button
						key={preset.id}
						type="button"
						aria-pressed={selectedPreset?.id === preset.id}
						onClick={() => setSelectedId(preset.id)}
						className={`w-full text-left p-3 border-2 transition-colors ${
							selectedPreset?.id === preset.id
								? "border-eb-900 bg-coral-100"
								: "border-eb-900/20 bg-white hover:border-eb-900"
						}`}
					>
						<span className="block font-black text-xs text-eb-900">
							{preset.title[language]}
						</span>
						<span className="block text-xs text-eb-900/75 mt-1">
							{preset.description[language]}
						</span>
					</button>
				))}
			</div>

			{selectedPreset && (
				<div className="border border-eb-900/25 p-3 space-y-3 bg-white">
					<label
						htmlFor="urban-preset-strength"
						className="block text-xs font-black text-eb-900"
					>
						{copy.strength}: {copy.levels[STRENGTHS.indexOf(strength)]}
					</label>
					<input
						id="urban-preset-strength"
						type="range"
						min={0}
						max={2}
						step={1}
						value={STRENGTHS.indexOf(strength)}
						onChange={(event) => {
							const index = Math.max(
								0,
								Math.min(2, Number(event.target.value)),
							);
							setStrength(STRENGTHS[index]);
						}}
						aria-valuetext={copy.levels[STRENGTHS.indexOf(strength)]}
						className="w-full accent-eb-900 cursor-pointer"
					/>
					<div className="flex justify-between text-[11px] font-bold text-eb-900">
						{copy.levels.map((label) => (
							<span key={label}>{label}</span>
						))}
					</div>
					<p className="text-xs text-eb-900/85" role="status">
						{selectedPreset.levels[strength].summary[language]}
					</p>
					<button
						type="button"
						onClick={applyPreset}
						disabled={!canApply}
						className="w-full py-3 px-2 bg-tsb text-eb-50 text-xs font-black border-2 border-eb-900 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
					>
						{copy.apply}
					</button>
					{!isMaskMode && (
						<p className="text-xs font-bold text-eb-900" role="status">
							{copy.selectFirst}
						</p>
					)}
					{isMaskMode && !hasSelection && (
						<p className="text-xs font-bold text-eb-900" role="status">
							{copy.markFirst}
						</p>
					)}
				</div>
			)}
			<p className="text-[11px] text-eb-900/70 leading-relaxed">
				{copy.warning}
			</p>
		</section>
	);
};
