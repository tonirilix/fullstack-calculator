package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/tonirilix/fullstack-calculator/backend/internal/calculator"
)

func TestHandlerCalculate(t *testing.T) {
	handler := NewHandler(calculator.NewService())

	tests := []struct {
		name       string
		body       string
		wantStatus int
		wantResult float64
		wantError  *apiError
	}{
		{
			name:       "returns success for add",
			body:       `{"operation":"add","operands":[2,3]}`,
			wantStatus: http.StatusOK,
			wantResult: 5,
		},
		{
			name:       "returns invalid json error",
			body:       `{invalid json`,
			wantStatus: http.StatusBadRequest,
			wantError: &apiError{
				Code:    "INVALID_JSON",
				Message: "Request body must be valid JSON.",
			},
		},
		{
			name:       "returns invalid operands error",
			body:       `{"operation":"multiply","operands":[4]}`,
			wantStatus: http.StatusBadRequest,
			wantError: &apiError{
				Code:    "INVALID_OPERANDS",
				Message: "invalid operands: multiply requires 2 operands",
			},
		},
		{
			name:       "returns unknown operation error",
			body:       `{"operation":"modulo","operands":[4,2]}`,
			wantStatus: http.StatusBadRequest,
			wantError: &apiError{
				Code:    "UNKNOWN_OPERATION",
				Message: "Unknown calculator operation.",
			},
		},
		{
			name:       "returns division by zero error",
			body:       `{"operation":"divide","operands":[10,0]}`,
			wantStatus: http.StatusUnprocessableEntity,
			wantError: &apiError{
				Code:    "DIVISION_BY_ZERO",
				Message: "Cannot divide by zero.",
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodPost, "/api/calculate", bytes.NewBufferString(test.body))
			response := httptest.NewRecorder()

			handler.Calculate(response, request)

			if response.Code != test.wantStatus {
				t.Fatalf("expected status %d, got %d", test.wantStatus, response.Code)
			}

			if contentType := response.Header().Get("Content-Type"); contentType != "application/json" {
				t.Fatalf("expected content type application/json, got %q", contentType)
			}

			if test.wantError != nil {
				var payload errorResponse

				if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
					t.Fatalf("failed to decode error response: %v", err)
				}

				if payload.Error != *test.wantError {
					t.Fatalf("expected error %+v, got %+v", *test.wantError, payload.Error)
				}

				return
			}

			var payload calculateResponse

			if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
				t.Fatalf("failed to decode success response: %v", err)
			}

			if payload.Result != test.wantResult {
				t.Fatalf("expected result %v, got %v", test.wantResult, payload.Result)
			}
		})
	}
}
