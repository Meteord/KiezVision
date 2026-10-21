import type { IncomingMessage, ServerResponse } from "node:http";
import {
	generateImageViaOpenAIImagesApi,
	type OpenAIImageGenerationBody,
} from "../../server/openaiImages.ts";
import { readRawBody, sendError, sendJson } from "../../server/httpHelpers.ts";
import {
	assertBodySize,
	assertProtectedApiRequest,
} from "../../server/requestGuard.ts";

export const config = { maxDuration: 60 };

export default async function handler(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	try {
		if (req.method !== "POST") {
			sendJson(res, 405, { message: "Method not allowed" });
			return;
		}
		assertProtectedApiRequest(req);
		const raw = await readRawBody(req);
		assertBodySize(Buffer.byteLength(raw || "{}", "utf8"));
		sendJson(
			res,
			200,
			await generateImageViaOpenAIImagesApi(
				JSON.parse(raw || "{}") as OpenAIImageGenerationBody,
			),
		);
	} catch (error) {
		console.error("[api/images/generations]", error);
		sendError(res, error);
	}
}
