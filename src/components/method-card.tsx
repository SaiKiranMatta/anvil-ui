import { useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Check, ChevronsUpDown, Grip } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MethodCardProps } from "../types";

export function MethodCard({
  id,
  card,
  methodOptions,
  onRemove,
  onMethodSelect,
  allMethods,
}: MethodCardProps) {
  const [open, setOpen] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const selectedMethod = card.methodName ? allMethods[card.methodName] : null;

  const handleExecute = async (): Promise<void> => {
    if (!selectedMethod) return;

    try {
      setLoading(true);
      setError(null);
      const paramArray =
        selectedMethod.params?.map((param) => paramValues[param.name]) || [];
      const response = await selectedMethod.method(...paramArray);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const dragHandleRef = useRef<HTMLButtonElement>(null);

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="relative ">
      <div className=" flex justify-end h-min absolute w-full pt-1 px-6">
            <Button
              variant="ghost"
              size="icon"
              className=" cursor-move"
              {...listeners}
              ref={dragHandleRef}
            >
              <Grip />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-destructive"
              onClick={onRemove}
            >
              <X  />
            </Button>
          </div>
        <CardHeader className=" mt-6">
       
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {card.methodName || "Select method..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search method..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No method found.</CommandEmpty>
                  <CommandGroup>
                    {methodOptions.map((method) => (
                      <CommandItem
                        key={method.value}
                        value={method.value}
                        onSelect={(currentValue: string) => {
                          onMethodSelect(
                            currentValue === card.methodName ? "" : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        {method.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            card.methodName === method.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardHeader>

        {selectedMethod && (
          <CardContent>
            <div className="space-y-4">
              {selectedMethod.params?.map((param) => (
                <div key={param.name} className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    {param.name}
                  </label>
                  <Input
                    placeholder={param.placeholder}
                    onChange={(e) =>
                      setParamValues({
                        ...paramValues,
                        [param.name]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}

              <Button
                onClick={handleExecute}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Executing..." : "Execute"}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {result !== null && (
                <Alert>
                  <AlertDescription className=" max-h-56 overflow-auto">
                    <pre className="mt-2 w-full  text-sm">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
