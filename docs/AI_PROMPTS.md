# AI Usage and Representative Prompts

AI tools were used for planning, scaffolding, implementation assistance, tests, and documentation. I reviewed and adjusted the generated output throughout the process. The prompts below are representative of the main instructions used; small follow-up prompts for corrections or debugging are omitted.

## 1a. Conversation

Had a planning session with Codex. I defined the main technical direction for the application: a React/TypeScript calculator UI backed by a Go REST API. I also clarified the intended calculator behavior and scope boundaries.

Defined the supported operations: add, subtract, multiply, divide, power, square root, and percentage. Percentage means `x / 100`. 
Unary operations apply to the current displayed operand. Chained binary operations use immediate execution. 
Out of scope: operator precedence, expression parsing, repeated equals, persistence, keyboard support.

## 1b. Initial project scaffold

Before using AI for implementation help, I created the initial repository structure manually: a Vite React + TypeScript frontend and a small Go backend with `internal/api` and `internal/calculator` packages.

This gave the AI an existing structure to work within rather than asking it to generate the project from scratch.

## 2a. Concise PRD write

Prompt: 
```text
Generate a concise reviewer-friendly PRD at `docs/PRD.md`.

Target length: 800–1,200 words.

Keep only:
- product overview
- goals
- non-goals
- supported operations
- high-level calculator interaction model
- API contract summary for `POST /api/calculate`
- loading/error behavior
- frontend/backend responsibility split
- testing expectations
- acceptance criteria

Do not implement code yet.
```

## 2b. Inform Codex about the source of truth
Prompt:
```
Use docs/PRD.md as the source of truth. Keep the implementation scoped to the PRD. Do not add features that are not listed there.
```

## 3. Backend operations prompt

```text
Update the Go backend to support the required v1 calculator operation contract from docs/PRD.md.

Keep the existing structure:
- main.go
- internal/api
- internal/calculator

Right now, only add support for:
- add
- subtract
- multiply
- divide

Use strict operand arity. The backend is the source of truth for validation. Return structured JSON errors. Add or update
backend service and handler tests.

Do not add unnecessary packages or refactor the backend structure.
Follow the structure I already provided.
```

## 4. Frontend calculator module skeleton prompt

```text
Create the frontend calculator feature module structure using these types. Do not implement the full UI yet.

Files:
- src/features/calculator/types.ts // This is already created. Don't remove it. It's only listed here for reference.
- src/features/calculator/constants.ts
- src/features/calculator/reducer.ts
- src/features/calculator/api.ts
- src/features/calculator/use-calculator.ts
- src/features/calculator/components/

Keep the files minimal. Add placeholders only where necessary. Do not add expression parsing, history, keyboard shortcuts, or
local arithmetic calculation.
```

## 5. Reducer prompt

```text
Implement only the pure calculator reducer in src/features/calculator/reducer.ts.

Use this state shape. It's the same from the types file.
  CalculatorState = {
    displayValue: string;
    storedValue: number | null;
    pendingOperation: BinaryOperation | null;
    waitingForNextInput: boolean;
    hasActiveInput: boolean;
    isLoading: boolean;
    errorMessage: string | null;
  };

Rules:
- reducer must be pure and synchronous
- no fetch calls
- no local arithmetic computation
- no expression parsing
- no operator precedence
- no repeated equals
- API orchestration will happen in useCalculator, not in the reducer

Reducer should handle:
- digitPressed
- decimalPressed
- binaryOperationSelected
- backspacePressed
- clearPressed
- calculationStarted
- chainedCalculationSucceeded
- finalCalculationSucceeded
- standaloneUnaryCalculationSucceeded
- rightOperandUnaryCalculationSucceeded
- calculationFailed

Keep behavior simple and aligned with docs/PRD.md.
Do not infer behavior beyond this step.
```

## 6. Frontend API client prompt

```text
Create a minimal frontend API client for the calculator backend.

Add a small `calculate` function for `POST /api/calculate`.

Basic requirements:
- accept an operation and operands
- use `VITE_API_BASE_URL`, defaulting to `http://localhost:8080`
- send a JSON request body
- return the numeric result from a successful response
- surface backend error messages when the API returns a structured error

Keep it small and specific to the calculator feature. Do not add a generic HTTP client abstraction, do not call it directly from UI components, and do not implement calculation logic locally.
```

## 7. Basic UI shell prompt

```text
Create only the calculator UI shell.

Use the existing `useCalculator` hook API and existing operation types/constants. Components should be presentational and
should not contain calculator business logic.

Create or update:
- `src/features/calculator/components/calculator.tsx`
- `src/features/calculator/components/calculator-display.tsx`
- `src/features/calculator/components/calculator-keypad.tsx`
- `src/features/calculator/components/calculator-button.tsx`
- `src/App.tsx` only to render the calculator

UI requirements:
- centered old-school calculator card
- prominent dark display area
- 4-column keypad
- layout:
AC   ⌫   √    %
7    8    9    ÷
4    5    6    ×
1    2    3    -
0    .    ^    +
=    =    =    =
- `=` spans all 4 columns
- show `state.displayValue`
- show `state.errorMessage` below display when present
- show `Calculating...` when `state.isLoading` is true
- disable all buttons except `AC` while `state.isLoading` is true
- keep responsive mobile-friendly max width

Do not:
- implement arithmetic in components
- add local calculation logic
- call the backend directly from components
- modify reducer behavior
- implement keyboard shortcuts
- add history, memory keys, sign toggle, expression parsing, themes, or animations

After the change, summarize the files changed and confirm that calculator logic remains outside presentational components.
```

## 8. `useCalculator` hook prompt

```text
Implement `useCalculator` as the controller hook for the calculator feature.

Use the existing reducer, types, constants, and `calculate` API client. The reducer must stay pure; all async API orchestration
should live in this hook.

Expose:
- `state`
- `pressDigit`
- `pressDecimal`
- `pressBinaryOperation`
- `pressUnaryOperation`
- `pressEquals`
- `pressBackspace`
- `pressClear`

Behavior:
- Digits, decimal, backspace, and clear should dispatch reducer actions.
- Binary operations should either select/replace the pending operator or trigger a chained backend calculation when a pending
operation and right operand exist.
- Equals should call the backend only for a complete pending binary operation.
- Unary operations should call the backend for the current displayed operand when valid.
- `AC` should reset state and cancel any in-flight request.
- Show loading before requests and failure state on errors.

Constraints:
- Do not compute arithmetic locally in the frontend.
- Do not add expression parsing, operator precedence, repeated equals, history, memory keys, sign toggle, or keyboard
shortcuts.
- Do not call `fetch` directly; use the existing API client.
- Do not modify UI components in this step.

After implementation, summarize what changed and any assumptions made.
```

## 9a. Add optional backend operations

```text
Update the Go backend to support the required v1 calculator operation contract from docs/PRD.md.

Keep the existing structure
Add support for:
- power
- sqrt
- percentage

Use strict operand arity. The backend is the source of truth for validation. Return structured JSON errors. Add or update
backend service and handler tests.

Just follow the structure I already provided similar to the previous methods.
```

## 9b. Split backend calculator files
```text
Split calculator service.go into:
- errors.go
- operations.go
- service.go
```

## 10. Reducer tests prompt

```text
Add focused Vitest unit tests for the frontend calculator reducer.

The reducer is pure and synchronous; API orchestration lives in `useCalculator`, so tests should verify observable state transitions rather than API behavior or component rendering.

Cover digit input, leading-zero behavior, decimal handling, binary operation selection, operator replacement, backspace, clear/reset, loading start, final success, chained success, standalone unary success, right-operand unary success, and failure state.

Do not add React Testing Library or component tests in this step. Do not modify reducer behavior unless a test exposes a real inconsistency; if so, summarize the issue before changing implementation.
```

```text
Add additional unit tests for the following scenarios:
1. ignores input actions while loading
2. digit recovers from error
3. decimal recovers from error
4. binary operation no-ops from untouched initial state
5. backspace no-ops after completed result / waitingForNextInput
```


## 11. Docker prompt

```text
Add minimal Docker support for local reviewer setup.

Create:
- `backend/Dockerfile`
- `backend/.dockerignore`
- `frontend/Dockerfile`
- `frontend/.dockerignore`
- root `docker-compose.yml`

Goal:
`docker compose up --build` should run the Go backend on `http://localhost:8080` and the Vite frontend on `http://localhost:5173`.

Keep it simple:
- backend should use a small Go build
- frontend can run the Vite dev server with `--host 0.0.0.0`
- set `VITE_API_BASE_URL=http://localhost:8080` for the frontend service

Do not change application behavior.
```

## 12. README and AI prompts prompt

```text
Update the project documentation for the take-home submission.

Update `README.md` so a reviewer can quickly understand, run, and test the app. Include:
- project overview
- stack summary
- supported operations
- local setup
- backend/frontend run commands
- backend/frontend test commands
- API example for `POST /api/calculate`
- brief design rationale

Also add `docs/AI_PROMPTS.md` with concise representative prompts used for planning, backend work, frontend work, tests, and documentation.

Keep both files concise and reviewer-friendly. Do not implement code or claim features that are not actually present.
```
