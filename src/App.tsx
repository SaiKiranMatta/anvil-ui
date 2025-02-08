import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/mode-toggle";
import { MethodCard } from "./components/method-card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { methodCategories } from "@/lib/anvil-methods";
import { Plus } from "lucide-react";
import { Card, MethodCategory, MethodConfig, MethodOption } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Flatten methods for easier search
const allMethods = Object.values(methodCategories).reduce<MethodConfig>(
  (acc, category: MethodCategory) => {
    return { ...acc, ...category.methods };
  },
  {}
);

// Convert methods to format needed for combobox
const methodOptions: MethodOption[] = Object.entries(allMethods).map(
  ([value]) => ({
    value,
    label: value,
  })
);

console.log(methodOptions);

// Default configuration - most used methods
const DEFAULT_METHODS = ["setBalance", "getBalance", "getBlockNumber"];

function App() {
  const [cards, setCards] = useState<Card[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const savedCards = localStorage.getItem("anvil-cards");
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    } else {
      const defaultCards = DEFAULT_METHODS.map((methodName) => ({
        id: crypto.randomUUID(),
        methodName,
      }));
      setCards(defaultCards);
      localStorage.setItem("anvil-cards", JSON.stringify(defaultCards));
    }
  }, []);

  const saveCards = (newCards: Card[]): void => {
    setCards(newCards);
    localStorage.setItem("anvil-cards", JSON.stringify(newCards));
  };

  const addCard = (): void => {
    const newCards = [...cards, { id: crypto.randomUUID(), methodName: null }];
    saveCards(newCards);
  };

  const removeCard = (cardId: string): void => {
    const newCards = cards.filter((card) => card.id !== cardId);
    console.log("remove card ", cardId);
    saveCards(newCards);
  };

  const updateCardMethod = (cardId: string, methodName: string): void => {
    const newCards = cards.map((card) =>
      card.id === cardId ? { ...card, methodName } : card
    );
    saveCards(newCards);
  };

  const addAllMethods = (): void => {
    const allCards = Object.keys(allMethods).map((methodName) => ({
      id: crypto.randomUUID(),
      methodName,
    }));
    saveCards(allCards);
  };

  const removeAllCards = (): void => {
    saveCards([]);
  };

  const resetToDefault = (): void => {
    const defaultCards = DEFAULT_METHODS.map((methodName) => ({
      id: crypto.randomUUID(),
      methodName,
    }));
    saveCards(defaultCards);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <div className="flex h-14 items-center justify-between">
            <h1 className="text-xl font-bold">Anvil Web Interface</h1>

            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={addAllMethods}>
                      Add All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add all available methods</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={removeAllCards}>
                      Remove All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear all methods</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={resetToDefault}>
                      Default
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset to default methods</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm text-muted-foreground ml-4">
                Connected to:{" "}
                {import.meta.env.VITE_RPC_URL || "http://localhost:8545"}
              </span>
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={cards.map((card) => card.id)}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                  <MethodCard
                    key={card.id}
                    id={card.id}
                    card={card}
                    methodOptions={methodOptions}
                    onRemove={() => removeCard(card.id)}
                    onMethodSelect={(method) =>
                      updateCardMethod(card.id, method)
                    }
                    allMethods={allMethods}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Button
            onClick={addCard}
            variant="outline"
            size="lg"
            className="mt-4 w-full border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Card
          </Button>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
