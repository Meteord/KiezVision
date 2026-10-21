export function resolveGeminiApiKey(
	env: NodeJS.ProcessEnv = process.env,
): string {
	return (env.GEMINI_API_KEY ?? "").trim();
}

export function resolveMapillaryAccessToken(
	env: NodeJS.ProcessEnv = process.env,
): string {
	return (env.MAPILLARY_ACCESS_TOKEN ?? "").trim();
}

export function resolveLiteLLMBaseUrl(
	env: NodeJS.ProcessEnv = process.env,
): string {
	return (env.LITELLM_BASE_URL ?? "").trim();
}

export function resolveLiteLLMApiKey(
	env: NodeJS.ProcessEnv = process.env,
): string {
	return (env.LITELLM_API_KEY ?? "").trim();
}

export function resolveLiteLLMInsecureSkipTlsVerify(
	env: NodeJS.ProcessEnv = process.env,
): boolean {
	return env.LITELLM_INSECURE_SKIP_TLS_VERIFY?.trim().toLowerCase() === "true";
}

export type OpenAIImageOperation = "generation" | "edit" | "mask-edit";

export type OpenAIImageModelConfig = {
	id: string;
	label: string;
	operations: OpenAIImageOperation[];
};

export function resolveOpenAIImageModels(
	env: NodeJS.ProcessEnv = process.env,
): OpenAIImageModelConfig[] {
	const value = env.VITE_OPENAI_IMAGE_MODELS?.trim();
	if (!value) return [];
	try {
		const models = JSON.parse(value) as unknown;
		if (!Array.isArray(models)) return [];
		return models.filter(
			(model): model is OpenAIImageModelConfig =>
				typeof model === "object" &&
				model !== null &&
				typeof (model as OpenAIImageModelConfig).id === "string" &&
				typeof (model as OpenAIImageModelConfig).label === "string" &&
				Array.isArray((model as OpenAIImageModelConfig).operations) &&
				(model as OpenAIImageModelConfig).operations.every(
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

export function geminiConfigured(): boolean {
	return Boolean(resolveGeminiApiKey());
}

export function mapillaryConfigured(): boolean {
	return Boolean(resolveMapillaryAccessToken());
}

export function openAIImagesConfigured(): boolean {
	return Boolean(
		resolveLiteLLMBaseUrl() &&
		resolveLiteLLMApiKey() &&
		resolveOpenAIImageModels().length,
	);
}
