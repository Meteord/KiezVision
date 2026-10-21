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

export function geminiConfigured(): boolean {
	return Boolean(resolveGeminiApiKey());
}

export function mapillaryConfigured(): boolean {
	return Boolean(resolveMapillaryAccessToken());
}

export function litellmConfigured(): boolean {
	return Boolean(resolveLiteLLMBaseUrl() && resolveLiteLLMApiKey());
}
