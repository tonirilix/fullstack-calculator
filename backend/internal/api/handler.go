package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/tonirilix/fullstack-calculator/backend/internal/calculator"
)

type CalculatorService interface {
	Calculate(operation calculator.Operation, operands []float64) (float64, error)
}

type Handler struct {
	calculator CalculatorService
}

func NewHandler(calculatorSvc CalculatorService) *Handler {
	return &Handler{
		calculator: calculatorSvc,
	}
}

type calculateRequest struct {
	Operation calculator.Operation `json:"operation"`
	Operands  []float64            `json:"operands"`
}

type calculateResponse struct {
	Result float64 `json:"result"`
}

type errorResponse struct {
	Error apiError `json:"error"`
}

type apiError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{
		"status": "ok",
	})
}

func (h *Handler) Calculate(w http.ResponseWriter, r *http.Request) {
	var request calculateRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "INVALID_JSON", "Request body must be valid JSON.")
		return
	}

	result, err := h.calculator.Calculate(request.Operation, request.Operands)
	if err != nil {
		status, code, message := mapCalculatorError(err)
		writeError(w, status, code, message)
		return
	}

	writeJSON(w, http.StatusOK, calculateResponse{
		Result: result,
	})
}

func mapCalculatorError(err error) (int, string, string) {
	switch {
	case errors.Is(err, calculator.ErrUnknownOperation):
		return http.StatusBadRequest, "UNKNOWN_OPERATION", "Unknown calculator operation."

	case errors.Is(err, calculator.ErrInvalidOperands):
		return http.StatusBadRequest, "INVALID_OPERANDS", err.Error()

	case errors.Is(err, calculator.ErrDivisionByZero):
		return http.StatusUnprocessableEntity, "DIVISION_BY_ZERO", "Cannot divide by zero."

	case errors.Is(err, calculator.ErrNegativeSquareRoot):
		return http.StatusUnprocessableEntity, "NEGATIVE_SQUARE_ROOT", "Cannot calculate the square root of a negative number."

	case errors.Is(err, calculator.ErrInvalidPower):
		return http.StatusUnprocessableEntity, "INVALID_POWER", "Power result must be a finite real number."

	default:
		return http.StatusInternalServerError, "INTERNAL_ERROR", "An unexpected error occurred."
	}
}

func writeError(w http.ResponseWriter, status int, code string, message string) {
	writeJSON(w, status, errorResponse{
		Error: apiError{
			Code:    code,
			Message: message,
		},
	})
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	var buffer bytes.Buffer

	if err := json.NewEncoder(&buffer).Encode(value); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, _ = w.Write(buffer.Bytes())
}
