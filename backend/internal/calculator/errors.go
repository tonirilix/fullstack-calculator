package calculator

import "errors"

var (
	ErrUnknownOperation   = errors.New("unknown operation")
	ErrInvalidOperands    = errors.New("invalid operands")
	ErrDivisionByZero     = errors.New("division by zero")
	ErrNegativeSquareRoot = errors.New("negative square root")
	ErrInvalidPower       = errors.New("invalid power")
)
