export type OpenAIImageModel = string;

export type ImageOperation = "generation" | "edit" | "mask-edit";

export type ImageModel = {
	id: OpenAIImageModel;
	label: string;
	operations: ImageOperation[];
};

function parseImageModels(value: string | undefined): ImageModel[] {
	if (!value) return [];
	try {
		const models = JSON.parse(value) as unknown;
		if (!Array.isArray(models)) return [];
		return models.filter(
			(model): model is ImageModel =>
				typeof model === "object" &&
				model !== null &&
				typeof (model as ImageModel).id === "string" &&
				typeof (model as ImageModel).label === "string" &&
				Array.isArray((model as ImageModel).operations) &&
				(model as ImageModel).operations.every(
					(operation) =>
						operation === "generation" ||
						operation === "edit" ||
						operation === "mask-edit",
				),
		);
	} catch {
		return [];
	}
}

export const IMAGE_MODELS = parseImageModels(
	import.meta.env.VITE_OPENAI_IMAGE_MODELS,
);

export function imageModelsFor(operation: ImageOperation) {
	return IMAGE_MODELS.filter((model) => model.operations.includes(operation));
}
