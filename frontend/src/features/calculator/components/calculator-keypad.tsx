import {
  binaryOperationLabels,
  unaryOperationLabels,
} from "../constants"
import type { BinaryOperation, UnaryOperation } from "../types"
import { CalculatorButton } from "./calculator-button"

type CalculatorKeypadProps = {
  isLoading: boolean
  onDigitPress: (digit: string) => void
  onDecimalPress: () => void
  onBinaryOperationPress: (operation: BinaryOperation) => void
  onUnaryOperationPress: (operation: UnaryOperation) => void
  onEqualsPress: () => void
  onBackspacePress: () => void
  onClearPress: () => void
}

function CalculatorKeypad({
  isLoading,
  onDigitPress,
  onDecimalPress,
  onBinaryOperationPress,
  onUnaryOperationPress,
  onEqualsPress,
  onBackspacePress,
  onClearPress,
}: CalculatorKeypadProps) {
  const controlsDisabled = isLoading

  return (
    <div className="grid grid-cols-4 gap-3">
      <CalculatorButton label="AC" onPress={onClearPress} tone="utility" />
      <CalculatorButton
        label="⌫"
        onPress={onBackspacePress}
        disabled={controlsDisabled}
        tone="utility"
      />
      <CalculatorButton
        label={unaryOperationLabels.sqrt}
        onPress={() => onUnaryOperationPress("sqrt")}
        disabled={controlsDisabled}
        tone="utility"
      />
      <CalculatorButton
        label={unaryOperationLabels.percentage}
        onPress={() => onUnaryOperationPress("percentage")}
        disabled={controlsDisabled}
        tone="utility"
      />

      {["7", "8", "9"].map((digit) => (
        <CalculatorButton
          key={digit}
          label={digit}
          onPress={() => onDigitPress(digit)}
          disabled={controlsDisabled}
        />
      ))}
      <CalculatorButton
        label={binaryOperationLabels.divide}
        onPress={() => onBinaryOperationPress("divide")}
        disabled={controlsDisabled}
        tone="operator"
      />

      {["4", "5", "6"].map((digit) => (
        <CalculatorButton
          key={digit}
          label={digit}
          onPress={() => onDigitPress(digit)}
          disabled={controlsDisabled}
        />
      ))}
      <CalculatorButton
        label={binaryOperationLabels.multiply}
        onPress={() => onBinaryOperationPress("multiply")}
        disabled={controlsDisabled}
        tone="operator"
      />

      {["1", "2", "3"].map((digit) => (
        <CalculatorButton
          key={digit}
          label={digit}
          onPress={() => onDigitPress(digit)}
          disabled={controlsDisabled}
        />
      ))}
      <CalculatorButton
        label={binaryOperationLabels.subtract}
        onPress={() => onBinaryOperationPress("subtract")}
        disabled={controlsDisabled}
        tone="operator"
      />

      <CalculatorButton
        label="0"
        onPress={() => onDigitPress("0")}
        disabled={controlsDisabled}
      />
      <CalculatorButton
        label="."
        onPress={onDecimalPress}
        disabled={controlsDisabled}
      />
      <CalculatorButton
        label={binaryOperationLabels.power}
        onPress={() => onBinaryOperationPress("power")}
        disabled={controlsDisabled}
        tone="operator"
      />
      <CalculatorButton
        label={binaryOperationLabels.add}
        onPress={() => onBinaryOperationPress("add")}
        disabled={controlsDisabled}
        tone="operator"
      />

      <CalculatorButton
        label="="
        onPress={onEqualsPress}
        disabled={controlsDisabled}
        tone="equals"
        className="col-span-4"
      />
    </div>
  )
}

export { CalculatorKeypad }
