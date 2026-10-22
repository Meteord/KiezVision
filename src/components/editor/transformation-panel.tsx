import React, { useState } from "react";
import { MousePointer2, Paintbrush2, Save } from "lucide-react";
import type { ProjectPreset } from "../../types.ts";
import type { EditMode } from "../../hooks/use-editor.ts";
import {
	imageModelsFor,
	type OpenAIImageModel,
} from "../../services/imageModels.ts";

interface TransformationPanelProps {
	onTransform: (prompt: string) => void | Promise<void>;
	isProcessing: boolean;
	placeholder?: string;
	language?: "en" | "de";
	presets?: ProjectPreset[];
	imageModel: OpenAIImageModel;
	onImageModelChange: (model: OpenAIImageModel) => void;
	editMode: EditMode;
	onSetEditModeComparison: () => void;
	onSetEditModeMask: () => void;
	onSave: () => void;
	compareLabel: string;
	areaEditLabel: string;
	saveLabel: string;
}

const SUGGESTIONS_EN = [
	{ label: "🌳 Tree", value: "add a mature street tree with green foliage" },
	{
		label: "🛝 Playground swing",
		value:
			"add a public playground swing set with metal frame and child-sized seat, on safety surfacing or grass",
	},
	{
		label: "🌼 Flower garden",
		value:
			"add a small street-side flower garden with mixed blooms in a low planting bed",
	},
	{ label: "💡 Street Light", value: "add a modern LED street lamp" },
];

const SUGGESTIONS_DE = [
	{
		label: "🌳 Baum",
		value: "einen ausgewachsenen straßenbaum mit grünem laub hinzufügen",
	},
	{
		label: "🛝 Schaukel",
		value:
			"eine öffentliche kinderschaukel mit metallgestell und kindersitz, auf fallschutz oder rasen",
	},
	{
		label: "🌼 Blumengarten",
		value:
			"einen kleinen straßenrand-blumengarten mit bunten stauden in einer flachen beetanlage hinzufügen",
	},
	{
		label: "💡 Straßenlampe",
		value: "eine moderne led-straßenlaterne hinzufügen",
	},
];

export const TransformationPanel: React.FC<TransformationPanelProps> = ({
	onTransform,
	isProcessing,
	placeholder = "Describe how to change the image...",
	language = "en",
	presets,
	imageModel,
	onImageModelChange,
	editMode,
	onSetEditModeComparison,
	onSetEditModeMask,
	onSave,
	compareLabel,
	areaEditLabel,
	saveLabel,
}) => {
	const [prompt, setPrompt] = useState("");
	const suggestions = language === "en" ? SUGGESTIONS_EN : SUGGESTIONS_DE;

	const strings = {
		en: {
			presets: "Presets",
			prompt: "Prompt",
			model: "Image model",
			generate: "Generate",
			generating: "Generating...",
		},
		de: {
			presets: "Vorlagen",
			prompt: "Prompt",
			model: "Bildmodell",
			generate: "Generieren",
			generating: "Wird generiert...",
		},
	}[language];
	const availablePresets = presets ?? suggestions;
	const models = imageModelsFor("edit");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = prompt.trim();
		if (!trimmed || isProcessing) return;
		try {
			await onTransform(trimmed);
			setPrompt("");
		} catch {
			/* error UI handled in App */
		}
	};

	const addSuggestion = (val: string) => {
		setPrompt((prev) => (prev ? `${prev}, ${val}` : val));
	};

	return (
		<div className="bg-header">
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="flex border-2 border-eb-900">
					<button
						type="button"
						onClick={onSetEditModeComparison}
						aria-pressed={editMode === "comparison"}
						className={`flex-1 flex items-center justify-center gap-2 h-11 text-xs font-black uppercase tracking-wide transition-colors ${editMode === "comparison" ? "bg-eb-900 text-eb-50" : "bg-header hover:bg-coral-100"}`}
					>
						<MousePointer2 className="w-4 h-4" aria-hidden="true" />
						{compareLabel}
					</button>
					<button
						type="button"
						onClick={onSetEditModeMask}
						aria-pressed={editMode === "mask"}
						className={`flex-1 flex items-center justify-center gap-2 h-11 border-l-2 border-eb-900 text-xs font-black uppercase tracking-wide transition-colors ${editMode === "mask" ? "bg-eb-900 text-eb-50" : "bg-header hover:bg-coral-100"}`}
					>
						<Paintbrush2 className="w-4 h-4" aria-hidden="true" />
						{areaEditLabel}
					</button>
				</div>
				<div className="border-b-2 border-eb-900 pb-4">
					<p className="mb-3 text-xs font-black uppercase tracking-[0.1em]">
						{strings.presets}
					</p>
					<div className="flex flex-wrap gap-2">
						{availablePresets.map((preset) => (
							<button
								key={`${preset.label}-${preset.prompt ?? preset.value}`}
								type="button"
								onClick={() => addSuggestion(preset.prompt ?? preset.value)}
								disabled={isProcessing}
								className="px-3 h-9 bg-header border-2 border-eb-900 text-xs font-black uppercase tracking-wide hover:bg-coral-100 transition-colors disabled:opacity-50"
							>
								{preset.label}
							</button>
						))}
					</div>
				</div>

				<label
					htmlFor="transform-prompt"
					className="text-xs font-black uppercase tracking-[0.1em]"
				>
					{strings.prompt}
				</label>
				<textarea
					id="transform-prompt"
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter" && !event.shiftKey) {
							event.preventDefault();
							event.currentTarget.form?.requestSubmit();
						}
					}}
					placeholder={placeholder}
					className="w-full h-32 bg-header text-eb-900 text-sm p-4 border-2 border-eb-900 focus:bg-header transition-colors resize-y font-bold tracking-tight placeholder:text-eb-900/30"
					disabled={isProcessing}
				/>

				<label
					htmlFor="image-model"
					className="text-xs font-black uppercase tracking-[0.1em]"
				>
					{strings.model}
				</label>
				<select
					id="image-model"
					value={
						models.some((model) => model.id === imageModel)
							? imageModel
							: models[0]?.id
					}
					onChange={(event) =>
						onImageModelChange(event.target.value as OpenAIImageModel)
					}
					disabled={isProcessing || models.length < 2}
					className="w-full h-11 bg-header border-2 border-eb-900 px-3 text-sm font-bold disabled:opacity-70"
				>
					{models.map((model) => (
						<option key={model.id} value={model.id}>
							{model.label}
						</option>
					))}
				</select>

				<button
					type="submit"
					disabled={!prompt.trim() || isProcessing}
					className="w-full h-12 bg-tsb text-eb-50 border-2 border-eb-900 text-xs font-black uppercase tracking-wide hover:bg-eb-900 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isProcessing ? strings.generating : strings.generate}
				</button>
				<button
					type="button"
					onClick={onSave}
					className="w-full h-12 bg-coral-500 text-eb-50 border-2 border-coral-500 text-xs font-black uppercase tracking-wide hover:bg-eb-900 hover:border-eb-900 transition-colors flex items-center justify-center gap-2"
				>
					<Save className="w-4 h-4" aria-hidden="true" />
					{saveLabel}
				</button>
			</form>
		</div>
	);
};
