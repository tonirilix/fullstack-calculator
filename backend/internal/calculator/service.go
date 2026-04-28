package calculator

import (
	"errors"
	"fmt"
	"math"
)

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

var (
	ErrUnknownOperation   = errors.New("unknown operation")
	ErrInvalidOperands    = errors.New("invalid operands")
	ErrDivisionByZero     = errors.New("division by zero")
	ErrNegativeSquareRoot = errors.New("negative square root")
	ErrInvalidPower       = errors.New("invalid power")
)

type Service struct{}

func NewService() *Service {
	return &Service{}
}

func (s *Service) Calculate(operation Operation, operands []float64) (float64, error) {
	switch operation {
	case OperationAdd:
		if err := validateBinaryOperands("add", operands); err != nil {
			return 0, err
		}
		return operands[0] + operands[1], nil
	case OperationSubtract:
		if err := validateBinaryOperands("subtract", operands); err != nil {
			return 0, err
		}
		return operands[0] - operands[1], nil
	case OperationMultiply:
		if err := validateBinaryOperands("multiply", operands); err != nil {
			return 0, err
		}
		return operands[0] * operands[1], nil
	case OperationDivide:
		if err := validateBinaryOperands("divide", operands); err != nil {
			return 0, err
		}
		if operands[1] == 0 {
			return 0, fmt.Errorf("%w: divisor cannot be zero", ErrDivisionByZero)
		}
		return operands[0] / operands[1], nil
	case OperationPower:
		if err := validateBinaryOperands("power", operands); err != nil {
			return 0, err
		}

		result := math.Pow(operands[0], operands[1])
		if math.IsNaN(result) || math.IsInf(result, 0) {
			return 0, fmt.Errorf("%w: power result must be a finite real number", ErrInvalidPower)
		}

		return result, nil
	case OperationSqrt:
		if err := validateUnaryOperands("sqrt", operands); err != nil {
			return 0, err
		}
		if operands[0] < 0 {
			return 0, fmt.Errorf("%w: cannot calculate the square root of a negative number", ErrNegativeSquareRoot)
		}

		return math.Sqrt(operands[0]), nil
	case OperationPercentage:
		if err := validateUnaryOperands("percentage", operands); err != nil {
			return 0, err
		}

		return operands[0] / 100, nil

	default:
		return 0, ErrUnknownOperation
	}
}

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
