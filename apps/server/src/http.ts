import { type ZodType, ZodError } from "zod";

export interface ApiError {
  code: string;
  message: string;
}

export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: ApiError };

interface JsonResponse {
  status(code: number): JsonResponse;
  json(body: unknown): JsonResponse;
}

export function parseInput<T>(schema: ZodType<T>, input: unknown): ParseResult<T> {
  const result = schema.safeParse(input);

  if (result.success) {
    return { ok: true, data: result.data };
  }

  return {
    ok: false,
    status: 400,
    error: {
      code: "VALIDATION_ERROR",
      message: formatZodError(result.error),
    },
  };
}

export function sendSuccess<T>(
  res: JsonResponse,
  data: T,
  status = 200,
): JsonResponse {
  return res.status(status).json({ data });
}

export function sendError(
  res: JsonResponse,
  status: number,
  code: string,
  message: string,
): JsonResponse {
  return res.status(status).json({ error: { code, message } });
}

function formatZodError(error: ZodError): string {
  const issue = error.issues[0];
  if (!issue) {
    return "Invalid request.";
  }

  const path = issue.path.join(".");
  return path ? `${path}: ${issue.message}` : issue.message;
}
