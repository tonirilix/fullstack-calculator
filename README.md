# Full-Stack Calculator

Small full-stack calculator built as a take-home submission. The app has a React + TypeScript frontend and a Go backend. The frontend renders a calculator UI and sends structured calculation requests to the backend, which remains the source of truth for arithmetic and validation.

For the scoped product definition, see [docs/PRD.md](docs/PRD.md).  
For representative AI planning and implementation prompts, see [docs/AI_PROMPTS.md](docs/AI_PROMPTS.md).

## Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Go, `net/http`
- Frontend tests: Vitest
- Backend tests: `go test`

## Supported Operations

Current backend and UI wiring support:

- Addition
- Subtraction
- Multiplication
- Division
- Power
- Square root
- Percentage

Percentage is implemented as `x / 100`.

## Local Setup

Prerequisites:

- Node.js 20+ and npm
- Go 1.26+

From the repo root, create the frontend environment file:

```bash
echo "VITE_API_BASE_URL=http://localhost:8080" > frontend/.env
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Run

Backend:

```bash
cd backend
go run .
```

Runs on `http://localhost:8080`.

Frontend:

```bash
cd frontend
npm run dev
```

Runs on `http://localhost:5173`.

## Docker

Docker is provided as an optional convenience for local review.

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## Test

Backend:

```bash
cd backend
go test ./...
go test ./... -cover
```

Frontend:

```bash
cd frontend
npm test
npm run typecheck
npm run test:coverage
```

## API Example

`POST /api/calculate`

Example request:

```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "multiply",
    "operands": [6, 7]
  }'
```

Example success response:

```json
{
  "result": 42
}
```

Example error response:

```json
{
  "error": {
    "code": "DIVISION_BY_ZERO",
    "message": "Cannot divide by zero."
  }
}
```

## Design Rationale

- The backend owns arithmetic and validation. The frontend does not compute results locally.
- The frontend uses a reducer for pure state transitions and a controller hook for async API orchestration.
- The calculator follows an immediate-execution model rather than expression parsing or operator precedence.
- Scope is intentionally tight for the take-home: one page, one API endpoint, focused tests, and no history, memory keys, keyboard shortcuts, or advanced calculator features.

For fuller scope and acceptance criteria, see [docs/PRD.md](docs/PRD.md).