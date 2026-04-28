import { initialCalculatorState } from "./constants"
import type { CalculatorAction, CalculatorState } from "./types"


function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case "digitPressed": {
      if (state.isLoading) {
        return state
      }

      if (state.errorMessage) {
        return {
          ...initialCalculatorState,
          displayValue: action.digit,
          hasActiveInput: true,
        }
      }

      if (state.waitingForNextInput) {
        if (state.pendingOperation === null) {
          return {
            ...initialCalculatorState,
            displayValue: action.digit,
            hasActiveInput: true,
          }
        }

        return {
          ...state,
          displayValue: action.digit,
          waitingForNextInput: false,
          hasActiveInput: true,
        }
      }

      return {
        ...state,
        displayValue:
          state.displayValue === "0"
            ? action.digit
            : `${state.displayValue}${action.digit}`,
        hasActiveInput: true,
      }
    }

    case "decimalPressed": {
      if (state.isLoading) {
        return state
      }

      if (state.errorMessage) {
        return {
          ...initialCalculatorState,
          displayValue: "0.",
          hasActiveInput: true,
        }
      }

      if (state.waitingForNextInput) {
        if (state.pendingOperation === null) {
          return {
            ...initialCalculatorState,
            displayValue: "0.",
            hasActiveInput: true,
          }
        }

        return {
          ...state,
          displayValue: "0.",
          waitingForNextInput: false,
          hasActiveInput: true,
        }
      }

      if (state.displayValue.includes(".")) {
        return state
      }

      return {
        ...state,
        displayValue: `${state.displayValue}.`,
        hasActiveInput: true,
      }
    }

    case "binaryOperationSelected": {
      if (state.isLoading || state.errorMessage) {
        return state
      }

      if (!state.hasActiveInput && state.pendingOperation === null) {
        return state
      }

      if (state.pendingOperation !== null && !state.hasActiveInput) {
        return {
          ...state,
          pendingOperation: action.operation,
        }
      }

      const currentValue = Number(state.displayValue)

      if (!Number.isFinite(currentValue)) {
        return state
      }

      return {
        ...state,
        storedValue: currentValue,
        pendingOperation: action.operation,
        waitingForNextInput: true,
        hasActiveInput: false,
      }
    }

    case "backspacePressed": {
      if (
        state.isLoading ||
        state.errorMessage ||
        state.waitingForNextInput ||
        !state.hasActiveInput
      ) {
        return state
      }

      const nextValue = state.displayValue.slice(0, -1)

      return {
        ...state,
        displayValue: nextValue === "" ? "0" : nextValue,
        hasActiveInput: true,
      }
    }

    case "clearPressed":
      return initialCalculatorState

    case "calculationStarted":
      return {
        ...state,
        isLoading: true,
        errorMessage: null,
      }

    case "chainedCalculationSucceeded":
      return {
        displayValue: String(action.result),
        storedValue: action.result,
        pendingOperation: action.nextOperation,
        waitingForNextInput: true,
        hasActiveInput: false,
        isLoading: false,
        errorMessage: null,
      }

    case "finalCalculationSucceeded":
      return {
        displayValue: String(action.result),
        storedValue: action.result,
        pendingOperation: null,
        waitingForNextInput: true,
        hasActiveInput: true,
        isLoading: false,
        errorMessage: null,
      }

    case "standaloneUnaryCalculationSucceeded":
      return {
        displayValue: String(action.result),
        storedValue: action.result,
        pendingOperation: null,
        waitingForNextInput: true,
        hasActiveInput: true,
        isLoading: false,
        errorMessage: null,
      }

    case "rightOperandUnaryCalculationSucceeded":
      return {
        displayValue: String(action.result),
        storedValue: state.storedValue,
        pendingOperation: state.pendingOperation,
        waitingForNextInput: false,
        hasActiveInput: true,
        isLoading: false,
        errorMessage: null,
      }

    case "calculationFailed":
      return {
        displayValue: "Error",
        storedValue: null,
        pendingOperation: null,
        waitingForNextInput: false,
        hasActiveInput: false,
        isLoading: false,
        errorMessage: action.message,
      }

    default:
      return state
  }
}

export { calculatorReducer }
