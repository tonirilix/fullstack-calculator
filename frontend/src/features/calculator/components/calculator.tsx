import { useCalculator } from "../use-calculator"
import { CalculatorDisplay } from "./calculator-display"
import { CalculatorKeypad } from "./calculator-keypad"

function Calculator() {
  const {
    state,
    pressDigit,
    pressDecimal,
    pressBinaryOperation,
    pressUnaryOperation,
    pressEquals,
    pressBackspace,
    pressClear,
  } = useCalculator()

  return (
    <div className="mx-auto w-full max-w-sm rounded-[2.5rem] border border-stone-300/80 bg-[linear-gradient(180deg,rgba(244,239,226,1)_0%,rgba(224,217,201,1)_100%)] p-4 shadow-[0_28px_60px_rgba(41,37,36,0.18)] sm:p-5">
      <div className="rounded-[2rem] border border-stone-400/70 bg-stone-200/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:p-4">
        <div className="mb-4 text-[0.65rem] font-semibold tracking-[0.35em] text-stone-600 uppercase">
          Full-Stack Calculator
        </div>

        <CalculatorDisplay
          displayValue={state.displayValue}
          errorMessage={state.errorMessage}
          isLoading={state.isLoading}
        />

        <div className="mt-4">
          <CalculatorKeypad
            isLoading={state.isLoading}
            onDigitPress={pressDigit}
            onDecimalPress={pressDecimal}
            onBinaryOperationPress={pressBinaryOperation}
            onUnaryOperationPress={pressUnaryOperation}
            onEqualsPress={pressEquals}
            onBackspacePress={pressBackspace}
            onClearPress={pressClear}
          />
        </div>
      </div>
    </div>
  )
}

export { Calculator }
