import React, { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import {
	imageModelsFor,
	type ImageOperation,
	type OpenAIImageModel,
} from "../../services/imageModels.ts";

interface TransformationPanelProps {
	onTransform: (prompt: string) => void | Promise<void>;
	isProcessing: boolean;
	placeholder?: string;
	isMaskMode?: boolean;
	language?: "en" | "de";
	imageModel: OpenAIImageModel;
	onImageModelChange: (model: OpenAIImageModel) => void;
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
	isMaskMode = false,
	language = "en",
	imageModel,
	onImageModelChange,
}) => {
	const [prompt, setPrompt] = useState("");
	const suggestions = language === "en" ? SUGGESTIONS_EN : SUGGESTIONS_DE;

	const strings = {
		en: {
			instruction: "AI Instruction",
			masked: "(Targeting Mask)",
			clear: "Clear",
			synthesizing: "Synthesizing...",
			apply: "Apply Changes",
		},
		de: {
			instruction: "KI-Anweisung",
			masked: "(Bereich ausgewählt)",
			clear: "Leeren",
			synthesizing: "Synthese...",
			apply: "Anwenden",
		},
	}[language];
	const operation: ImageOperation = isMaskMode ? "mask-edit" : "edit";
	const models = imageModelsFor(operation);

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
		<div className="bg-eb-50 border-2 border-eb-900 p-0">
			<div className="bg-tsb text-eb-50 px-4 py-2 flex items-center justify-between">
				<h3
					className="text-xs font-black flex items-center gap-2"
					id="transform-instruction-label"
				>
					<Wand2 className="w-3 h-3" aria-hidden="true" /> {strings.instruction}{" "}
					{isMaskMode && (
						<span className="text-coral-100">{strings.masked}</span>
					)}
				</h3>
				{prompt && (
					<button
						type="button"
						onClick={() => setPrompt("")}
						className="text-xs font-black hover:text-coral-100"
					>
						{strings.clear}
					</button>
				)}
			</div>
			<form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
				<div>
					<label
						htmlFor="image-model"
						className="block text-xs font-black mb-2"
					>
						{language === "en" ? "Image model" : "Bildmodell"}
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
						className="w-full h-10 bg-eb-50 border-2 border-eb-900 px-2 text-sm font-bold disabled:opacity-70"
					>
						{models.map((model) => (
							<option key={model.id} value={model.id}>
								{model.label}
							</option>
						))}
					</select>
				</div>
				<label htmlFor="transform-prompt" className="sr-only">
					{strings.instruction}
				</label>
				<textarea
					id="transform-prompt"
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder={placeholder}
					aria-describedby="transform-instruction-label"
					className="w-full bg-header text-eb-900 text-sm p-4 border-2 border-eb-900 focus:bg-eb-50 transition-colors resize-none h-28 font-bold tracking-tight placeholder:text-eb-900/30"
					disabled={isProcessing}
				/>

				<div className="flex flex-wrap gap-2">
					{suggestions.map((s) => (
						<button
							key={s.label}
							type="button"
							onClick={() => addSuggestion(s.value)}
							className="px-3 h-9 bg-eb-50 border-2 border-eb-900 text-xs font-black uppercase tracking-wide hover:bg-coral-100 transition-colors"
						>
							{s.label}
						</button>
					))}
				</div>

				<button
					type="submit"
					disabled={!prompt.trim() || isProcessing}
					className="w-full bg-coral-500 text-eb-50 h-14 border-2 border-coral-500 font-black uppercase tracking-[0.08em] hover:bg-eb-900 hover:border-eb-900 transition-colors disabled:opacity-50"
				>
					{isProcessing ? (
						<span className="flex items-center justify-center gap-2">
							<Loader2 className="w-4 h-4 animate-spin" />{" "}
							{strings.synthesizing}
						</span>
					) : (
						strings.apply
					)}
				</button>
			</form>
		</div>
	);
};
