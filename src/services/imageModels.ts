export type LiteLLMImageModel =
	| "gpt-image-1.5"
	| "azure_ai/FLUX-1.1-pro"
	| "azure_ai/FLUX.1-Kontext-pro"
	| "azure_ai/FLUX.2-pro";

export type ImageOperation = "generation" | "edit" | "mask-edit";

export const IMAGE_MODELS: Array<{
	id: LiteLLMImageModel;
	label: string;
	operations: ImageOperation[];
}> = [
	{
		id: "gpt-image-1.5",
		label: "GPT Image 1.5",
		operations: ["generation", "edit"],
	},
	{
		id: "azure_ai/FLUX-1.1-pro",
		label: "FLUX 1.1 Pro",
		operations: ["generation"],
	},
	{
		id: "azure_ai/FLUX.1-Kontext-pro",
		label: "FLUX.1 Kontext Pro",
		operations: ["edit", "mask-edit"],
	},
	{
		id: "azure_ai/FLUX.2-pro",
		label: "FLUX.2 Pro",
		operations: ["generation"],
	},
];

export function imageModelsFor(operation: ImageOperation) {
	return IMAGE_MODELS.filter((model) => model.operations.includes(operation));
}
