type BinaryOperation = "add" | "subtract" | "multiply" | "divide" | "power"

type UnaryOperation = "sqrt" | "percentage"

type Operation = BinaryOperation | UnaryOperation

type CalculatorState = {
  /**
   * String shown in the calculator display.
   */
  displayValue: string

  /**
   * Stored left-hand operand for a pending binary operation.
   */
  storedValue: number | null

  /**
   * Binary operation waiting for a right-hand operand.
   */
  pendingOperation: BinaryOperation | null

  /**
   * Whether the next numeric input should replace the display instead of
   * appending to it.
   */
  waitingForNextInput: boolean

  /**
   * Whether the current display represents an actual user-entered or
   * backend-produced operand that can participate in a calculation.
   *
   * In short:
   * - false means the display is informational or waiting context
   * - true means the display is a usable operand/result
   */
  hasActiveInput: boolean

  /**
   * Whether a backend calculation request is currently in flight.
   */
  isLoading: boolean

  /**
   * Recoverable user-facing error message.
   */
  errorMessage: string | null
}

export type { BinaryOperation, UnaryOperation, Operation, CalculatorState }
