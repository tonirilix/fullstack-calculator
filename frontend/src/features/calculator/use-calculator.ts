import { useReducer } from "react"

import { initialCalculatorState } from "./constants"
import { calculatorReducer } from "./reducer"
import type { BinaryOperation, UnaryOperation } from "./types"

function useCalculator() {
  const [state, dispatch] = useReducer(
    calculatorReducer,
    initialCalculatorState
  )

  const pressDigit = (digit: string) => {
    dispatch({ type: "digitPressed", digit })
  }

  const pressDecimal = () => {
    dispatch({ type: "decimalPressed" })
  }

  const pressBinaryOperation = (operation: BinaryOperation) => {
    dispatch({ type: "binaryOperationSelected", operation })
  }

  const pressUnaryOperation = (_operation: UnaryOperation) => {
    // Unary operations are intentionally not wired yet.
  }

  const pressEquals = () => {
    // Final calculation orchestration is intentionally not wired yet.
  }

  const pressBackspace = () => {
    dispatch({ type: "backspacePressed" })
  }

  const pressClear = () => {
    dispatch({ type: "clearPressed" })
  }

  return {
    state,
    pressDigit,
    pressDecimal,
    pressBinaryOperation,
    pressUnaryOperation,
    pressEquals,
    pressBackspace,
    pressClear,
  }
}

export { useCalculator }
