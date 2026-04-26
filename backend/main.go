package main

import (
	"log"
	"net/http"

	"github.com/tonirilix/fullstack-calculator/backend/internal/api"
	"github.com/tonirilix/fullstack-calculator/backend/internal/calculator"
)

func main() {
	calculatorService := calculator.NewService()
	handler := api.NewHandler(calculatorService)

	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", handler.Health)
	mux.HandleFunc("POST /api/calculate", handler.Calculate)

	server := &http.Server{
		Addr:    ":8080",
		Handler: withCORS(mux),
	}

	log.Println("server running on http://localhost:8080")

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Good enough for local Vite development.
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}