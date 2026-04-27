import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CalculatorButtonProps = {
  label: string
  onPress: () => void
  disabled?: boolean
  className?: string
  tone?: "digit" | "utility" | "operator" | "equals"
}

const toneClasses: Record<NonNullable<CalculatorButtonProps["tone"]>, string> = {
  digit:
    "h-16 rounded-2xl border border-stone-300/80 bg-stone-100 text-stone-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] hover:bg-stone-200",
  utility:
    "h-16 rounded-2xl border border-amber-300/80 bg-amber-100 text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] hover:bg-amber-200",
  operator:
    "h-16 rounded-2xl border border-orange-300/80 bg-orange-400 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-orange-500",
  equals:
    "h-16 rounded-2xl border border-emerald-300/80 bg-emerald-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-emerald-600",
}

function CalculatorButton({
  label,
  onPress,
  disabled = false,
  className,
  tone = "digit",
}: CalculatorButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onPress}
      disabled={disabled}
      className={cn(
        "text-lg font-semibold tracking-wide disabled:opacity-50",
        toneClasses[tone],
        className
      )}
    >
      {label}
    </Button>
  )
}

export { CalculatorButton }
