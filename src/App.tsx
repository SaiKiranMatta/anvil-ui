import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MethodSection } from "@/components/method-section";
import { methodCategories } from "@/lib/anvil-methods";
import { ModeToggle } from "./components/mode-toggle";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <div className="flex h-14 items-center justify-between">
            <h1 className="text-xl font-bold">Anvil Web Interface</h1>

            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <span className="text-sm text-muted-foreground">
                Connected to:{" "}
                {import.meta.env.VITE_RPC_URL || "http://localhost:8545"}
              </span>
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className=" px-6 py-6 space-y-8">
          {Object.values(methodCategories).map((category) => (
            <MethodSection
              key={category.title}
              title={category.title}
              methods={category.methods}
            />
          ))}
        </main>
      </div>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
