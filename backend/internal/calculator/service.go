package calculator

import (
	"errors"
	"fmt"
)

type Operation string

const (
	OperationAdd      Operation = "add"
	OperationSubtract Operation = "subtract"
	OperationMultiply Operation = "multiply"
	OperationDivide   Operation = "divide"
)

var (
	ErrUnknownOperation = errors.New("unknown operation")
	ErrInvalidOperands  = errors.New("invalid operands")
	ErrDivisionByZero   = errors.New("division by zero")
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
