import { parseInput, sendError } from "./http";
import { aiBodySchema } from "./schemas";

interface RequestLike {
  body?: unknown;
}

interface ResponseLike {
  status(code: number): ResponseLike;
  json(body: unknown): ResponseLike;
}

interface AiDeps {
  stream(messages: unknown[], res: ResponseLike): Promise<void>;
}

export function createAiHandler(deps: AiDeps) {
  return async (req: RequestLike, res: ResponseLike) => {
    const parsed = parseInput(aiBodySchema, req.body ?? {});
    if (!parsed.ok) {
      return sendError(res, parsed.status, parsed.error.code, parsed.error.message);
    }

    try {
      await deps.stream(parsed.data.messages, res);
    } catch (error) {
      console.log(error);
      return sendError(res, 500, "AI_STREAM_FAILED", "Could not stream AI response.");
    }
  };
}
