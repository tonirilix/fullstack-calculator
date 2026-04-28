type CalculatorDisplayProps = {
  displayValue: string
  errorMessage: string | null
  isLoading: boolean
}

function CalculatorDisplay({
  displayValue,
  errorMessage,
  isLoading,
}: CalculatorDisplayProps) {
  return (
    <div className="rounded-[2rem] border border-stone-700 bg-stone-950 px-5 py-5 text-stone-50 shadow-[inset_0_2px_16px_rgba(255,255,255,0.08)]">
      <div aria-label="Calculator display" className="min-h-16 overflow-x-auto text-right font-mono text-4xl tracking-tight whitespace-nowrap sm:text-5xl">
        {displayValue}
      </div>
      <div className="mt-3 min-h-5 text-right text-xs tracking-[0.18em] uppercase text-stone-400">
        {errorMessage ? (
          <span className="text-rose-300">{errorMessage}</span>
        ) : isLoading ? (
          "Calculating..."
        ) : (
          <span aria-hidden="true">&nbsp;</span>
        )}
      </div>
    </div>
  )
}

export { CalculatorDisplay }
