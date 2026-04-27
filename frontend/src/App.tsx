import { Calculator } from "./features/calculator/components/calculator"

export function App() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,247,237,1),rgba(231,229,228,1)_55%,rgba(214,211,209,1))] px-4 py-8 sm:px-6">
      <Calculator />
    </main>
  )
}

export default App
