package calculator

import (
	"errors"
	"fmt"
)

type Operation string

const (
	OperationAdd        Operation = "add"
)

var (
	ErrUnknownOperation = errors.New("unknown operation")
	ErrInvalidOperands  = errors.New("invalid operands")
)

type Service struct{}

func NewService() *Service {
	return &Service{}
}

func (s *Service) Calculate(operation Operation, operands []float64) (float64, error) {
	switch operation {
	case OperationAdd:
		if len(operands) != 2 {
			return 0, fmt.Errorf("%w: add requires 2 operands", ErrInvalidOperands)
		}
		return operands[0] + operands[1], nil

	default:
		return 0, ErrUnknownOperation
	}
}