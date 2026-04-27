package calculator

import (
	"errors"
	"testing"
)

func TestServiceCalculate(t *testing.T) {
	service := NewService()

	tests := []struct {
		name      string
		operation Operation
		operands  []float64
		expected  float64
		wantError error
	}{
		{
			name:      "adds two numbers",
			operation: OperationAdd,
			operands:  []float64{2, 3},
			expected:  5,
		},
		{
			name:      "subtracts two numbers",
			operation: OperationSubtract,
			operands:  []float64{7, 4},
			expected:  3,
		},
		{
			name:      "multiplies two numbers",
			operation: OperationMultiply,
			operands:  []float64{6, 5},
			expected:  30,
		},
		{
			name:      "divides two numbers",
			operation: OperationDivide,
			operands:  []float64{10, 2},
			expected:  5,
		},
		{
			name:      "rejects unknown operation",
			operation: Operation("modulo"),
			operands:  []float64{10, 3},
			wantError: ErrUnknownOperation,
		},
		{
			name:      "rejects wrong operand count for add",
			operation: OperationAdd,
			operands:  []float64{1},
			wantError: ErrInvalidOperands,
		},
		{
			name:      "rejects wrong operand count for subtract",
			operation: OperationSubtract,
			operands:  []float64{7, 4, 1},
			wantError: ErrInvalidOperands,
		},
		{
			name:      "rejects wrong operand count for multiply",
			operation: OperationMultiply,
			operands:  []float64{5},
			wantError: ErrInvalidOperands,
		},
		{
			name:      "rejects wrong operand count for divide",
			operation: OperationDivide,
			operands:  []float64{10},
			wantError: ErrInvalidOperands,
		},
		{
			name:      "rejects division by zero",
			operation: OperationDivide,
			operands:  []float64{10, 0},
			wantError: ErrDivisionByZero,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result, err := service.Calculate(test.operation, test.operands)

			if test.wantError != nil {
				if !errors.Is(err, test.wantError) {
					t.Fatalf("expected error %v, got %v", test.wantError, err)
				}
				return
			}

			if err != nil {
				t.Fatalf("expected no error, got %v", err)
			}

			if result != test.expected {
				t.Fatalf("expected %v, got %v", test.expected, result)
			}
		})
	}
}
