package calculator

import "fmt"

type Operation string

const (
	OperationAdd        Operation = "add"
	OperationSubtract   Operation = "subtract"
	OperationMultiply   Operation = "multiply"
	OperationDivide     Operation = "divide"
	OperationPower      Operation = "power"
	OperationSqrt       Operation = "sqrt"
	OperationPercentage Operation = "percentage"
)

func validateBinaryOperands(name string, operands []float64) error {
	if len(operands) != 2 {
		return fmt.Errorf("%w: %s requires 2 operands", ErrInvalidOperands, name)
	}

	return nil
}

func validateUnaryOperands(name string, operands []float64) error {
	if len(operands) != 1 {
		return fmt.Errorf("%w: %s requires 1 operand", ErrInvalidOperands, name)
	}

	return nil
}
