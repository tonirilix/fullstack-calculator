import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Calculator } from "../calculator"
import * as calculatorApi from "../../api"
import { binaryOperationLabels } from "../../constants"

describe("Calculator", () => {
  it("shows a loading state when operation is triggered", async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    expect(screen.queryByText(/Calculating/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "2" }))
    await user.click(screen.getByRole("button", { name: "+" }))
    await user.click(screen.getByRole("button", { name: "2" }))
    await user.click(screen.getByRole("button", { name: "=" }))

    expect(await screen.findByText(/Calculating/i)).toBeInTheDocument()
  })

  it("shows an error state when invalid operation is triggered", async () => {
    vi.spyOn(calculatorApi, "calculate").mockRejectedValueOnce(
      new calculatorApi.CalculatorApiError(
        "DIVISION_BY_ZERO",
        "Cannot divide by zero."
      )
    )

    const user = userEvent.setup()
    render(<Calculator />)

    expect(screen.queryByText(/Calculating/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "2" }))
    await user.click(
      screen.getByRole("button", { name: binaryOperationLabels.divide })
    )
    await user.click(screen.getByRole("button", { name: "0" }))
    await user.click(screen.getByRole("button", { name: "=" }))

    expect(
      await screen.findByText(/Cannot divide by zero./i)
    ).toBeInTheDocument()
  })

  // TODO: Decouple from the mocked api. A MSW might be a better choice
  it("performs a basic calculation through the API", async () => {
    vi.spyOn(calculatorApi, "calculate").mockResolvedValueOnce({ result: 4 })

    const user = userEvent.setup()
    render(<Calculator />)

    await user.click(screen.getByRole("button", { name: "2" }))
    await user.click(screen.getByRole("button", { name: "+" }))
    await user.click(screen.getByRole("button", { name: "2" }))
    await user.click(screen.getByRole("button", { name: "=" }))

    expect(calculatorApi.calculate).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: "add",
        operands: [2, 2],
      })
    )

    expect(
      await screen.findByLabelText(/calculator display/i)
    ).toHaveTextContent("4")
  })
})
