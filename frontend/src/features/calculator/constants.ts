import type { BinaryOperation, CalculatorState, UnaryOperation } from "./types"

const initialCalculatorState: CalculatorState = {
  displayValue: "0",
  storedValue: null,
  pendingOperation: null,
  waitingForNextInput: false,
  hasActiveInput: false,
  isLoading: false,
  errorMessage: null,
}

const binaryOperationLabels: Record<BinaryOperation, string> = {
  add: "+",
  subtract: "-",
  multiply: "×",
  divide: "÷",
  power: "^",
}

const unaryOperationLabels: Record<UnaryOperation, string> = {
  sqrt: "√",
  percentage: "%",
}

export { binaryOperationLabels, initialCalculatorState, unaryOperationLabels }
