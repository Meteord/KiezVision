export type OpenAIImageModel =
	| "gpt-image-1.5"
	| "FLUX-1.1-pro"
	| "FLUX.1-Kontext-pro-edit"
	| "FLUX.2-pro"
	| "FLUX.2-pro-edit";

export type ImageOperation = "generation" | "edit" | "mask-edit";

export const IMAGE_MODELS: Array<{
	id: OpenAIImageModel;
	label: string;
	operations: ImageOperation[];
}> = [
	{
		id: "gpt-image-1.5",
		label: "GPT Image 1.5",
		operations: ["generation", "edit"],
	},
	{
		id: "FLUX-1.1-pro",
		label: "FLUX 1.1 Pro",
		operations: ["generation"],
	},
	{
		id: "FLUX.1-Kontext-pro-edit",
		label: "FLUX.1 Kontext Pro",
		operations: ["edit", "mask-edit"],
	},
	{
		id: "FLUX.2-pro",
		label: "FLUX.2 Pro",
		operations: ["generation", "edit"],
	},
	{
		id: "FLUX.2-pro-edit",
		label: "FLUX.2 Pro Edit",
		operations: ["edit", "mask-edit"],
	},
];

export function imageModelsFor(operation: ImageOperation) {
	return IMAGE_MODELS.filter((model) => model.operations.includes(operation));
}
