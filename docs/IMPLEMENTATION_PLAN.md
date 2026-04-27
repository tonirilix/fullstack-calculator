1. Expand backend operation contract
   Add subtract, multiply, divide, power, sqrt, and percentage. Keep strict arity and structured errors.

2. Add backend tests
   Cover service operations, domain errors, invalid operands, invalid JSON, and handler response mapping.

3. Create a basic calculator UI shell
   Build the card, display, keypad, and button layout. Keep behavior minimal.

4. Add frontend calculator types/constants
   Define operation types, button metadata, operation-to-label mappings, initial state, and display helpers.

5. Add frontend API client
   Implement `calculate()` for `POST /api/calculate`. Connect one happy-path calculation from the UI to prove the vertical slice.

6. Add reducer and `useCalculator` incrementally
   Move interaction behavior out of the UI into reducer + hook. Add digit input, decimal, binary ops, equals, unary ops, clear, and backspace step by step.

7. Add frontend tests
   Cover reducer behavior and API client success/error paths. Keep component tests optional.

8. Polish UI states
   Add loading state, recoverable errors, disabled controls while loading, mobile responsiveness, and final visual polish.

9. Update README and AI prompts
   Add setup, run commands, test commands, API examples, design rationale, and prompts used.