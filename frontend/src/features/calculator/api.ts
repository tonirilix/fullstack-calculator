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

async function calculate({
  operation,
  operands,
  signal,
}: CalculateParams): Promise<CalculateResponse> {
  const response = await fetch(`${API_BASE_URL}/api/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ operation, operands }),
    signal,
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | {
          error?: {
            code?: string
            message?: string
          }
        }
      | null

    if (payload?.error?.code && payload.error.message) {
      throw new CalculatorApiError(payload.error.code, payload.error.message)
    }

    throw new CalculatorApiError(
      "INVALID_RESPONSE",
      "Received an invalid response from the server."
    )
  }

  const payload = (await response.json()) as Partial<CalculateResponse>

  if (
    typeof payload.result !== "number" ||
    Number.isNaN(payload.result) ||
    !Number.isFinite(payload.result)
  ) {
    throw new CalculatorApiError(
      "INVALID_RESPONSE",
      "Received an invalid response from the server."
    )
  }

  return { result: payload.result }
}

export { CalculatorApiError, calculate }
export type { CalculateParams, CalculateResponse }
