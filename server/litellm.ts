import { assertAllowedLiteLLMModel } from "./requestGuard.ts";
import { resolveLiteLLMApiKey, resolveLiteLLMBaseUrl } from "./secrets.ts";

export type LiteLLMImageGenerationBody = {
	model: string;
	prompt: string;
	size?: string;
	quality?: string;
};

export type LiteLLMImageEditBody = LiteLLMImageGenerationBody & {
	image: string;
	mask?: string;
};

function configuredLiteLLM(): { baseUrl: string; apiKey: string } {
	const baseUrl = resolveLiteLLMBaseUrl();
	const apiKey = resolveLiteLLMApiKey();
	if (!baseUrl || !apiKey) {
		throw Object.assign(
			new Error("LiteLLM base URL or API key is not configured on the server."),
			{ status: 503 },
		);
	}
	return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
}

function imageBlob(dataUrl: string, name: string): File {
	const match = dataUrl.match(
		/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/,
	);
	if (!match) {
		throw Object.assign(new Error(`Invalid ${name} image data.`), {
			status: 400,
		});
	}
	const [, mimeType, base64] = match;
	return new File([Buffer.from(base64.replace(/\s/g, ""), "base64")], name, {
		type: mimeType,
	});
}

async function requestLiteLLM(
	path: string,
	init: RequestInit,
): Promise<unknown> {
	const { baseUrl, apiKey } = configuredLiteLLM();
	let response: Response;
	try {
		response = await fetch(`${baseUrl}${path}`, {
			...init,
			headers: {
				Authorization: `Bearer ${apiKey}`,
				...init.headers,
			},
		});
	} catch (error) {
		const cause = error instanceof Error ? error.cause : undefined;
		const code =
			cause && typeof cause === "object" && "code" in cause
				? cause.code
				: undefined;
		if (code === "UNABLE_TO_GET_ISSUER_CERT_LOCALLY") {
			throw Object.assign(
				new Error(
					"LiteLLM's TLS certificate could not be verified. Configure the LiteLLM host with its complete certificate chain, or set NODE_EXTRA_CA_CERTS to your organization's CA PEM before starting the local dev server.",
				),
				{ status: 502 },
			);
		}
		throw Object.assign(
			error instanceof Error
				? error
				: new Error("Unable to connect to LiteLLM."),
			{ status: 502 },
		);
	}
	const body = await response.text();
	if (!response.ok) {
		let message = body || `LiteLLM request failed (${response.status}).`;
		try {
			const parsed = JSON.parse(body) as {
				error?: { message?: string };
				message?: string;
			};
			message = parsed.error?.message ?? parsed.message ?? message;
		} catch {
			// LiteLLM may return a non-JSON error response.
		}
		throw Object.assign(new Error(message), { status: response.status });
	}
	try {
		return JSON.parse(body) as unknown;
	} catch {
		throw Object.assign(
			new Error("LiteLLM returned an invalid JSON response."),
			{
				status: 502,
			},
		);
	}
}

export async function generateImageViaLiteLLM(
	body: LiteLLMImageGenerationBody,
): Promise<unknown> {
	if (!body?.model || !body.prompt?.trim()) {
		throw Object.assign(new Error("Request must include model and prompt."), {
			status: 400,
		});
	}
	assertAllowedLiteLLMModel(body.model, "generation");
	return requestLiteLLM("/v1/images/generations", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model: body.model,
			prompt: body.prompt,
			n: 1,
			response_format: "b64_json",
			...(body.size ? { size: body.size } : {}),
			...(body.quality ? { quality: body.quality } : {}),
		}),
	});
}

export async function editImageViaLiteLLM(
	body: LiteLLMImageEditBody,
): Promise<unknown> {
	if (!body?.model || !body.prompt?.trim() || !body.image) {
		throw Object.assign(
			new Error("Request must include model, prompt, and image."),
			{
				status: 400,
			},
		);
	}
	assertAllowedLiteLLMModel(body.model, "edit");
	const form = new FormData();
	form.set("model", body.model);
	form.set("prompt", body.prompt);
	form.set("n", "1");
	form.set("response_format", "b64_json");
	form.set("image", imageBlob(body.image, "image.png"));
	if (body.mask) form.set("mask", imageBlob(body.mask, "mask.png"));
	if (body.size) form.set("size", body.size);
	if (body.quality) form.set("quality", body.quality);
	return requestLiteLLM("/v1/images/edits", { method: "POST", body: form });
}
