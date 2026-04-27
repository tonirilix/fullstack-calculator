// TODO: add "power" once core operations are finished
type BinaryOperation = "add" | "subtract" | "multiply" | "divide";


// TODO: These are optional. Will implement after the core operations are finished.
type UnaryOperation = "sqrt" | "percentage"

type Operation = BinaryOperation

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
   * Whether a backend calculation request is currently in flight.
   */
  isLoading: boolean

  /**
   * Recoverable user-facing error message.
   */
  errorMessage: string | null
}

export type { BinaryOperation, UnaryOperation, Operation, CalculatorState }
