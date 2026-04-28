import type { Operation } from "./types"

type CalculateParams = {
  operation: Operation
  operands: number[]
  signal?: AbortSignal
}

type CalculateResponse = {
  result: number
}

class CalculatorApiError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = "CalculatorApiError"
    this.code = code
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"

const INVALID_RESPONSE_MESSAGE = "Received an invalid response from the server."
const NETWORK_ERROR_MESSAGE = "Unable to reach the server. Please try again."

async function calculate({
  operation,
  operands,
  signal,
}: CalculateParams): Promise<CalculateResponse> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}/api/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation, operands }),
      signal,
    })
  } catch (error) {
    if (isAbortError(error)) {
      throw error
    }

    throw new CalculatorApiError("NETWORK_ERROR", NETWORK_ERROR_MESSAGE)
  }

  if (!response.ok) {
    const payload = await parseJsonSafely(response)

    if (isBackendErrorResponse(payload)) {
      throw new CalculatorApiError(payload.error.code, payload.error.message)
    }

    throw new CalculatorApiError("INVALID_RESPONSE", INVALID_RESPONSE_MESSAGE)
  }

  const payload = await parseJsonSafely(response)

  if (!isCalculateResponse(payload)) {
    throw new CalculatorApiError("INVALID_RESPONSE", INVALID_RESPONSE_MESSAGE)
  }

  return payload
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError"
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch (error) {
    if (isAbortError(error)) {
      throw error
    }

    return null
  }
}

function isCalculateResponse(payload: unknown): payload is CalculateResponse {
  if (payload === null || typeof payload !== "object") {
    return false
  }

  const result = (payload as Partial<CalculateResponse>).result

  return typeof result === "number" && Number.isFinite(result)
}

function isBackendErrorResponse(
  payload: unknown
): payload is { error: { code: string; message: string } } {
  if (payload === null || typeof payload !== "object") {
    return false
  }

  const error = (payload as { error?: unknown }).error

  if (error === null || typeof error !== "object") {
    return false
  }

  const { code, message } = error as {
    code?: unknown
    message?: unknown
  }

  return typeof code === "string" && typeof message === "string"
}

export { CalculatorApiError, calculate }
export type { CalculateParams, CalculateResponse }
