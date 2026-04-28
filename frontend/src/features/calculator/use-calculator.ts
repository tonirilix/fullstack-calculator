import { useEffect, useReducer, useRef } from "react"

import { CalculatorApiError, calculate } from "./api"
import { initialCalculatorState } from "./constants"
import { calculatorReducer } from "./reducer"
import type { BinaryOperation, UnaryOperation } from "./types"

function useCalculator() {
  const [state, dispatch] = useReducer(
    calculatorReducer,
    initialCalculatorState
  )
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const getFiniteDisplayValue = () => {
    const value = Number(state.displayValue)
    return Number.isFinite(value) ? value : null
  }

  const runCalculationRequest = async <T>(
    run: (signal: AbortSignal) => Promise<T>
  ): Promise<T | null> => {
    const controller = new AbortController()
    abortControllerRef.current?.abort()
    abortControllerRef.current = controller

    dispatch({ type: "calculationStarted" })

    try {
      return await run(controller.signal)
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return null
      }

      if (error instanceof CalculatorApiError) {
        dispatch({ type: "calculationFailed", message: error.message })
        return null
      }

      dispatch({
        type: "calculationFailed",
        message: "Unable to reach the server. Please try again.",
      })
      return null
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
    }
  }

  const pressDigit = (digit: string) => {
    dispatch({ type: "digitPressed", digit })
  }

  const pressDecimal = () => {
    dispatch({ type: "decimalPressed" })
  }

  const pressBinaryOperation = (operation: BinaryOperation) => {
    if (
      state.isLoading ||
      state.errorMessage ||
      state.pendingOperation === null ||
      !state.hasActiveInput ||
      state.storedValue === null
    ) {
      dispatch({ type: "binaryOperationSelected", operation })
      return
    }

    const rightOperand = getFiniteDisplayValue()
    const { storedValue, pendingOperation } = state

    if (
      rightOperand === null ||
      storedValue === null ||
      pendingOperation === null
    ) {
      return
    }

    void runCalculationRequest(async (signal) => {
      const response = await calculate({
        operation: pendingOperation,
        operands: [storedValue, rightOperand],
        signal,
      })

      dispatch({
        type: "chainedCalculationSucceeded",
        result: response.result,
        nextOperation: operation,
      })
    })
  }

  const pressUnaryOperation = (operation: UnaryOperation) => {
    if (state.isLoading || state.errorMessage || !state.hasActiveInput) {
      return
    }

    const operand = getFiniteDisplayValue()

    if (operand === null) {
      return
    }

    const isRightOperandUnary =
      state.pendingOperation !== null && state.storedValue !== null

    void runCalculationRequest(async (signal) => {
      const response = await calculate({
        operation,
        operands: [operand],
        signal,
      })

      dispatch({
        type: isRightOperandUnary
          ? "rightOperandUnaryCalculationSucceeded"
          : "standaloneUnaryCalculationSucceeded",
        result: response.result,
      })
    })
  }

  const pressEquals = () => {
    if (
      state.isLoading ||
      state.errorMessage ||
      state.pendingOperation === null ||
      !state.hasActiveInput ||
      state.storedValue === null
    ) {
      return
    }

    const rightOperand = getFiniteDisplayValue()
    const { pendingOperation, storedValue } = state

    if (
      rightOperand === null ||
      pendingOperation === null ||
      storedValue === null
    ) {
      return
    }

    void runCalculationRequest(async (signal) => {
      const response = await calculate({
        operation: pendingOperation,
        operands: [storedValue, rightOperand],
        signal,
      })

      dispatch({
        type: "finalCalculationSucceeded",
        result: response.result,
      })
    })
  }

  const pressBackspace = () => {
    dispatch({ type: "backspacePressed" })
  }

  const pressClear = () => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
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
