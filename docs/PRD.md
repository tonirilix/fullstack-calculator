# Full-Stack Calculator V1 PRD

## Product Overview

This project is a small full-stack calculator built for a 2–4 hour take-home exercise. The goal is to turn the existing Go backend and React frontend scaffold into one complete, usable vertical slice: a user enters a calculation in the browser, the frontend sends a structured request to the backend, and the UI displays either a result or a clear error.

The product is intentionally narrow. It is a single-page calculator, not a general expression parser or scientific calculator. The backend remains the source of truth for arithmetic and validation so the full-stack boundary is visible in the finished result.

## Goals

- Deliver a single-page calculator UI in `frontend/`.
- Use the backend `POST /api/calculate` endpoint for all calculations.
- Support a familiar calculator flow with a keypad and display.
- Keep the UI responsive and reviewer-friendly on desktop and mobile.
- Show clear loading and error states.
- Keep the architecture simple and credible for the timebox.
- Cover the riskiest behavior with focused automated tests.

## Non-Goals

- Expression parsing
- Operator precedence
- Parentheses
- Calculation history
- Authentication
- Persistence or database work
- Multi-page routing
- Advanced scientific features
- Memory keys
- Keyboard shortcuts
- Comprehensive end-to-end test suite

## Supported Operations

The calculator should support:

Must:
- Addition
- Subtraction
- Multiplication
- Division

Optional:
- Power
- Square root
- Percentage

For v1, percentage means `x / 100`. It should not use context-sensitive “physical calculator” percent behavior.

## Calculator Interaction Model

The calculator should follow a standard immediate-execution model rather than expression entry.

At a high level:

- Users build the current number locally in the frontend using digit and decimal input.
- Pressing a binary operator stores the current value and waits for the next operand.
- Pressing another binary operator after a right operand is entered should resolve the pending operation and continue chaining.
- Pressing another binary operator before the right operand is entered should simply replace the pending operator.
- Pressing `=` should resolve a complete pending binary operation.
- Unary operations such as square root and percentage should act on the currently displayed operand.
- `AC` should reset the calculator and cancel any in-flight request.
- `⌫` should support editing the current input buffer, but v1 does not need to define every calculator edge case beyond keeping the behavior intuitive and predictable.

This model intentionally avoids expression parsing, precedence rules, and repeated-equals behavior. The frontend should feel like a normal calculator, but the logic should stay small enough for the take-home scope.

## API Contract Summary

The frontend should use one calculation endpoint:

- `POST /api/calculate`

Request body:

```json
{
  "operation": "add" | "subtract" | "multiply" | "divide" | "power" | "sqrt" | "percentage",
  "operands": [number, number?]
}
```

Success response:

```json
{
  "result": 5
}
```

Error response:

```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable message"
  }
}
```

The backend should validate:

- supported operation names
- operand count
- invalid math such as division by zero
- invalid square roots
- invalid power results

The frontend should treat the backend as the source of truth and should not compute arithmetic results locally.

## Loading and Error Behavior

The UI should make request state obvious without becoming complicated.

Loading behavior:

- Show the current display value while the request is pending.
- Show a small loading indicator or status text such as `Calculating...`.
- Disable calculation-triggering controls while loading.
- Keep `AC` available so the user can cancel and reset.

Error behavior:

- Show a clear recoverable error state instead of leaving the calculator in a half-complete state.
- Use backend-provided error messages when the backend returns a structured error.
- Normalize transport failures into simple user-facing messages.
- Support recovery through `AC` or by starting a fresh input.

The frontend may block a few obvious invalid actions locally for UX, such as divide-by-zero or square root of a negative number, but the backend must still validate them.

## Frontend / Backend Responsibility Split

The solution should keep a clear separation of concerns.

Frontend responsibilities:

- render the calculator UI
- manage input and display state
- implement the immediate-execution interaction model
- call the backend for all calculations
- show loading, success, and error states
- normalize transport-level failures

Backend responsibilities:

- implement arithmetic operations
- validate operation names and operand shapes
- reject mathematically invalid requests
- return structured JSON success and error responses

This split is important for the take-home. The frontend should demonstrate good UI state handling, and the backend should demonstrate clean API behavior and validation.

## Testing Expectations

Testing should be focused, not exhaustive.

Priority test areas:

- backend calculation behavior for supported operations
- backend validation and error mapping
- frontend calculator state logic
- frontend API client behavior, including success, structured errors, and transport failures

Tests should focus on observable behavior and stable contracts rather than internal implementation details. Component rendering tests are optional if time remains, but the most important coverage is around state transitions and the client-server boundary.

Suggested bar for this take-home:

- backend unit tests for operation success and core validation cases
- backend handler tests for response shape and error mapping
- frontend reducer or state-logic tests
- frontend API client tests with mocked network behavior

## Acceptance Criteria

The submission should be considered successful when all of the following are true:

1. The repo contains a working single-page calculator UI.
2. The frontend uses the backend `POST /api/calculate` endpoint for all calculations.
3. The calculator supports add, subtract, multiply, and divide, with power, square root, and percentage included if completed within scope.
4. The UI follows an immediate-execution calculator model rather than expression parsing.
5. The UI provides `AC`, backspace, digit input, decimal input, binary operators, unary operators, and equals.
6. Loading state is visible and prevents duplicate requests.
7. Error state is visible and recoverable.
8. The backend returns structured JSON responses for both success and failure.
9. The frontend and backend responsibilities remain clearly separated.
10. The project includes focused automated tests for backend behavior, frontend state logic, and API client behavior.
11. The app can be run locally with straightforward reviewer setup.

## Notes for Reviewers

This v1 is intentionally scoped to show one polished vertical slice rather than a fully featured calculator. The most important evaluation points are clarity of interaction, correctness of the API boundary, sensible state handling, and disciplined scope management within a short timebox.
