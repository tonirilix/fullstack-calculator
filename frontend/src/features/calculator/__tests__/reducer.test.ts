import { describe, expect, it } from "vitest"

import { initialCalculatorState } from "../constants"
import { calculatorReducer } from "../reducer"
import type { CalculatorState } from "../types"

describe("calculatorReducer", () => {
  it("handles digit input from the initial state", () => {
    const nextState = calculatorReducer(initialCalculatorState, {
      type: "digitPressed",
      digit: "7",
    })

    expect(nextState).toEqual({
      ...initialCalculatorState,
      displayValue: "7",
      hasActiveInput: true,
    })
  })

  it("normalizes leading zero behavior", () => {
    const activeZeroState: CalculatorState = {
      ...initialCalculatorState,
      hasActiveInput: true,
    }

    const tests = [
      {
        name: "replaces a leading zero with another zero",
        action: { type: "digitPressed" as const, digit: "0" },
        expectedDisplayValue: "0",
      },
      {
        name: "replaces a leading zero with a non-zero digit",
        action: { type: "digitPressed" as const, digit: "8" },
        expectedDisplayValue: "8",
      },
    ]

    for (const test of tests) {
      const nextState = calculatorReducer(activeZeroState, test.action)

      expect(nextState.displayValue, test.name).toBe(test.expectedDisplayValue)
      expect(nextState.hasActiveInput, test.name).toBe(true)
    }
  })

  it("supports decimal input and prevents duplicate decimals", () => {
    const firstDecimalState = calculatorReducer(initialCalculatorState, {
      type: "decimalPressed",
    })

    expect(firstDecimalState).toEqual({
      ...initialCalculatorState,
      displayValue: "0.",
      hasActiveInput: true,
    })

    const duplicateDecimalState = calculatorReducer(firstDecimalState, {
      type: "decimalPressed",
    })

    expect(duplicateDecimalState).toEqual(firstDecimalState)
  })

  it("ignores input actions while loading", () => {
    const loadingState: CalculatorState = {
      ...initialCalculatorState,
      displayValue: "12",
      hasActiveInput: true,
      isLoading: true,
    }

    const actions = [
      { type: "digitPressed" as const, digit: "7" },
      { type: "decimalPressed" as const },
      { type: "backspacePressed" as const },
    ]

    for (const action of actions) {
      expect(calculatorReducer(loadingState, action)).toEqual(loadingState)
    }
  })

  it("recovers from error state when a digit is pressed", () => {
    const errorState: CalculatorState = {
      displayValue: "Error",
      storedValue: 9,
      pendingOperation: "add",
      waitingForNextInput: false,
      hasActiveInput: false,
      isLoading: false,
      errorMessage: "Cannot divide by zero.",
    }

    const nextState = calculatorReducer(errorState, {
      type: "digitPressed",
      digit: "4",
    })

    expect(nextState).toEqual({
      ...initialCalculatorState,
      displayValue: "4",
      hasActiveInput: true,
    })
  })

  it("recovers from error state when decimal is pressed", () => {
    const errorState: CalculatorState = {
      displayValue: "Error",
      storedValue: 9,
      pendingOperation: "add",
      waitingForNextInput: false,
      hasActiveInput: false,
      isLoading: false,
      errorMessage: "Cannot divide by zero.",
    }

    const nextState = calculatorReducer(errorState, {
      type: "decimalPressed",
    })

    expect(nextState).toEqual({
      ...initialCalculatorState,
      displayValue: "0.",
      hasActiveInput: true,
    })
  })

  it("selects a binary operation after active input", () => {
    const state: CalculatorState = {
      ...initialCalculatorState,
      displayValue: "12",
      hasActiveInput: true,
    }

    const nextState = calculatorReducer(state, {
      type: "binaryOperationSelected",
      operation: "multiply",
    })

    expect(nextState).toEqual({
      ...state,
      storedValue: 12,
      pendingOperation: "multiply",
      waitingForNextInput: true,
      hasActiveInput: false,
    })
  })

  it("replaces a pending binary operation before the right operand starts", () => {
    const state: CalculatorState = {
      displayValue: "12",
      storedValue: 12,
      pendingOperation: "add",
      waitingForNextInput: true,
      hasActiveInput: false,
      isLoading: false,
      errorMessage: null,
    }

    const nextState = calculatorReducer(state, {
      type: "binaryOperationSelected",
      operation: "divide",
    })

    expect(nextState).toEqual({
      ...state,
      pendingOperation: "divide",
    })
  })

  it("no-ops when selecting a binary operation from the untouched initial state", () => {
    const nextState = calculatorReducer(initialCalculatorState, {
      type: "binaryOperationSelected",
      operation: "add",
    })

    expect(nextState).toEqual(initialCalculatorState)
  })

  it("edits an active input buffer with backspace", () => {
    const tests = [
      {
        name: "removes the last digit",
        state: {
          ...initialCalculatorState,
          displayValue: "123",
          hasActiveInput: true,
        } satisfies CalculatorState,
        expectedDisplayValue: "12",
      },
      {
        name: "normalizes an empty buffer back to zero",
        state: {
          ...initialCalculatorState,
          displayValue: "8",
          hasActiveInput: true,
        } satisfies CalculatorState,
        expectedDisplayValue: "0",
      },
    ]

    for (const test of tests) {
      const nextState = calculatorReducer(test.state, {
        type: "backspacePressed",
      })

      expect(nextState.displayValue, test.name).toBe(test.expectedDisplayValue)
      expect(nextState.hasActiveInput, test.name).toBe(true)
    }
  })

  it("no-ops on backspace after a completed result while waiting for next input", () => {
    const completedResultState: CalculatorState = {
      displayValue: "5",
      storedValue: 5,
      pendingOperation: null,
      waitingForNextInput: true,
      hasActiveInput: true,
      isLoading: false,
      errorMessage: null,
    }

    const nextState = calculatorReducer(completedResultState, {
      type: "backspacePressed",
    })

    expect(nextState).toEqual(completedResultState)
  })

  it("resets to the initial state on clear", () => {
    const state: CalculatorState = {
      displayValue: "Error",
      storedValue: 9,
      pendingOperation: "subtract",
      waitingForNextInput: true,
      hasActiveInput: true,
      isLoading: true,
      errorMessage: "Something went wrong.",
    }

    const nextState = calculatorReducer(state, {
      type: "clearPressed",
    })

    expect(nextState).toEqual(initialCalculatorState)
  })

  it("marks the calculator as loading on calculationStarted", () => {
    const state: CalculatorState = {
      ...initialCalculatorState,
      displayValue: "9",
      errorMessage: "Old error",
      hasActiveInput: true,
    }

    const nextState = calculatorReducer(state, {
      type: "calculationStarted",
    })

    expect(nextState).toEqual({
      ...state,
      isLoading: true,
      errorMessage: null,
    })
  })

  it("stores a completed result on finalCalculationSucceeded", () => {
    const state: CalculatorState = {
      displayValue: "3",
      storedValue: 2,
      pendingOperation: "add",
      waitingForNextInput: false,
      hasActiveInput: true,
      isLoading: true,
      errorMessage: null,
    }

    const nextState = calculatorReducer(state, {
      type: "finalCalculationSucceeded",
      result: 5,
    })

    expect(nextState).toEqual({
      displayValue: "5",
      storedValue: 5,
      pendingOperation: null,
      waitingForNextInput: true,
      hasActiveInput: true,
      isLoading: false,
      errorMessage: null,
    })
  })

  it("stores a chained result and next pending operation on chainedCalculationSucceeded", () => {
    const state: CalculatorState = {
      displayValue: "3",
      storedValue: 2,
      pendingOperation: "add",
      waitingForNextInput: false,
      hasActiveInput: true,
      isLoading: true,
      errorMessage: null,
    }

    const nextState = calculatorReducer(state, {
      type: "chainedCalculationSucceeded",
      result: 5,
      nextOperation: "multiply",
    })

    expect(nextState).toEqual({
      displayValue: "5",
      storedValue: 5,
      pendingOperation: "multiply",
      waitingForNextInput: true,
      hasActiveInput: false,
      isLoading: false,
      errorMessage: null,
    })
  })

  it("stores a standalone unary result", () => {
    const state: CalculatorState = {
      ...initialCalculatorState,
      displayValue: "16",
      hasActiveInput: true,
      isLoading: true,
    }

    const nextState = calculatorReducer(state, {
      type: "standaloneUnaryCalculationSucceeded",
      result: 4,
    })

    expect(nextState).toEqual({
      displayValue: "4",
      storedValue: 4,
      pendingOperation: null,
      waitingForNextInput: true,
      hasActiveInput: true,
      isLoading: false,
      errorMessage: null,
    })
  })

  it("stores a right-operand unary result without clearing the pending binary operation", () => {
    const state: CalculatorState = {
      displayValue: "16",
      storedValue: 9,
      pendingOperation: "add",
      waitingForNextInput: false,
      hasActiveInput: true,
      isLoading: true,
      errorMessage: null,
    }

    const nextState = calculatorReducer(state, {
      type: "rightOperandUnaryCalculationSucceeded",
      result: 4,
    })

    expect(nextState).toEqual({
      displayValue: "4",
      storedValue: 9,
      pendingOperation: "add",
      waitingForNextInput: false,
      hasActiveInput: true,
      isLoading: false,
      errorMessage: null,
    })
  })

  it("moves to a recoverable error state on calculationFailed", () => {
    const state: CalculatorState = {
      displayValue: "3",
      storedValue: 2,
      pendingOperation: "add",
      waitingForNextInput: false,
      hasActiveInput: true,
      isLoading: true,
      errorMessage: null,
    }

    const nextState = calculatorReducer(state, {
      type: "calculationFailed",
      message: "Unable to reach the server. Please try again.",
    })

    expect(nextState).toEqual({
      displayValue: "Error",
      storedValue: null,
      pendingOperation: null,
      waitingForNextInput: false,
      hasActiveInput: false,
      isLoading: false,
      errorMessage: "Unable to reach the server. Please try again.",
    })
  })
})
