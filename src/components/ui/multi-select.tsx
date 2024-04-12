import React, { useState, useEffect, useCallback } from "react";
import { CheckIcon, XCircle, ChevronDown, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface MultiSelectFormFieldProps {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  defaultValue?: string[];
  onValueChange: (value: string[]) => void;
  disabled?: boolean;
  placeholder: string;
}

const MultiSelectFormField = ({
  options,
  defaultValue,
  onValueChange,
  disabled,
  placeholder,
}: MultiSelectFormFieldProps) => {
  const [selectedValues, setSelectedValues] = useState(
    new Set(defaultValue || [])
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    setSelectedValues(new Set(defaultValue));
  }, [defaultValue]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          setIsPopoverOpen(true);
          break;
        case "Escape":
          setIsPopoverOpen(false);
          break;
        case "Backspace":
          const values = Array.from(selectedValues);
          values.pop();
          setSelectedValues(new Set(values));
          onValueChange(values);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedValues, onValueChange]);

  const toggleOption = useCallback(
    (value: string) => {
      const newSelectedValues = new Set(selectedValues);
      if (newSelectedValues.has(value)) {
        newSelectedValues.delete(value);
      } else {
        newSelectedValues.add(value);
      }
      setSelectedValues(newSelectedValues);
      onValueChange(Array.from(newSelectedValues));
    },
    [selectedValues, onValueChange]
  );

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className="flex w-full rounded-md border min-h-10 h-auto items-center justify-between bg-inside"
        >
          {Array.from(selectedValues).length > 0 ? (
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-wrap items-center">
                {Array.from(selectedValues).map((value) => {
                  const option = options.find((o) => o.value === value);
                  const IconComponent = option?.icon;
                  return (
                    <Badge
                      key={value}
                      variant="outline"
                      className="m-1 bg-card"
                    >
                      {IconComponent && (
                        <IconComponent className="h-4 w-4 mr-2" />
                      )}
                      {option?.label}
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(event) => {
                          toggleOption(value);
                          event.stopPropagation();
                        }}
                      />
                    </Badge>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <XIcon
                  className="h-4 mx-2 cursor-pointer text-muted-foreground"
                  onClick={(event) => {
                    setSelectedValues(new Set([]));
                    onValueChange(Array.from(new Set([])));
                    event.stopPropagation();
                  }}
                />
                <Separator
                  orientation="vertical"
                  className="flex min-h-6 h-full"
                />
                <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full mx-auto">
              <span className="text-sm text-muted-foreground mx-3">
                {placeholder}
              </span>
              <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0"
        align="start"
        onInteractOutside={(event) => {
          if (!event.defaultPrevented) {
            setIsPopoverOpen(false);
          }
        }}
      >
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      toggleOption(option.value);
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setSelectedValues(new Set([]));
                      onValueChange(Array.from(new Set([])));
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectFormField;
