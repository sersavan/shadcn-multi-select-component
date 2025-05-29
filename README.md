## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sersavan/shadcn-multi-select-component&type=Date)](https://star-history.com/#sersavan/shadcn-multi-select-component&Date)

## Multi-Select Component Setup in Next.js

- This is a fork of the original [Shadcn Multi-Select Component which changes](https://shadcn-multi-select-component.vercel.app/):
  - React19 Support
  - Sub-options support
    - **Note:** This makes it such that ONLY the sub-options can be values, not the options itself
    - See the `page.tsx` example in **Step 3.** below
  - Fixed a bug with deleting options not working
  - Removes the "Magic Wand" bouncing animation

### Prerequisites

Ensure you have a Next.js/React project set up. If not, you can create create one:

Next.JS:

```bash
npx create-next-app my-app --typescript
cd my-app
```

React:

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
```

### Step 1: Install shadcn Components

Install required shadcn components:

```bash
npx shadcn@latest init
npx shadcn@latest add command popover button separator badge
```

### Step 2: Create the Multi-Select Component

Create `multi-select.tsx` in your `components` directory:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105! duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface Option {
  /** The text to display for the option. */
  label: string;
  /** The unique value associated with the option. */
  value: string;
  /** Optional icon component to display alongside the option. */
  icon?: React.ComponentType<{ className?: string }>;
  iconClass?: string;
  subCategories?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    iconClass?: string;
  }[];
}

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: Option[];

  selectedValues: string[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  setSelectedValues: (value: string[]) => void;

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      selectedValues,
      setSelectedValues,
      variant,
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const selectedValuesSet = React.useMemo(() => {
      return new Set(selectedValues);
    }, [selectedValues]);
    const fullListOptions = React.useMemo(() => {
      const allOptions = [];
      for (const option of options) {
        if (option.subCategories) {
          allOptions.push(...option.subCategories);
        } else allOptions.push(option);
      }
      return allOptions;
    }, [options]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
      }
    };

    const toggleOption = (option: Option) => {
      if (option.subCategories) {
        const subCatValues = option.subCategories.map((subCat) => subCat.value);

        const isSubCatSelected = option.subCategories.every((subCat) =>
          selectedValuesSet.has(subCat.value),
        );
        if (isSubCatSelected) {
          for (const subCatValue of subCatValues) {
            selectedValuesSet.delete(subCatValue);
          }
        } else {
          for (const subCatValue of subCatValues) {
            selectedValuesSet.add(subCatValue);
          }
        }
      } else {
        if (selectedValuesSet.has(option.value))
          selectedValuesSet.delete(option.value);
        else selectedValuesSet.add(option.value);
      }
      setSelectedValues(Array.from(selectedValuesSet));
    };

    const handleClear = () => {
      setSelectedValues([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedValues.length === fullListOptions.length) {
        handleClear();
      } else setSelectedValues(fullListOptions.map((option) => option.value));
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild={asChild}>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "transition-all flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto",
              className,
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map((value) => {
                    let option = null;

                    exitLabel: for (const o of options) {
                      if (o.value === value) {
                        option = o;
                        break;
                      }
                      if (o.subCategories) {
                        for (const subCat of o.subCategories) {
                          if (subCat.value === value) {
                            option = subCat;
                            break exitLabel;
                          }
                        }
                      }
                    }

                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        className={multiSelectVariants({ variant })}
                        style={{ animationDuration: `${animation}s` }}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleOption(option!);
                        }}
                      >
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 mr-2" />
                        )}
                        {option?.label}
                        <XCircle className="ml-1 h-4 w-4 cursor-pointer" />
                      </Badge>
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                        multiSelectVariants({ variant }),
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {`+ ${selectedValues.length - maxCount} more`}
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearExtraOptions();
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="transition-all h-4 mx-2 cursor-pointer text-muted-foreground hover:opacity-50"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
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
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandInput
              placeholder="Search..."
              onKeyDown={handleInputKeyDown}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      "mr-1 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedValues.length === fullListOptions.length
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible",
                    )}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <span>(Select All)</span>
                </CommandItem>
                {options.map((option) => {
                  const isSelected = option.subCategories
                    ? option.subCategories.every((subCat) =>
                        selectedValuesSet.has(subCat.value),
                      )
                    : selectedValuesSet.has(option.value);
                  return (
                    <React.Fragment key={option.value}>
                      <CommandItem
                        key={option.value}
                        onSelect={() => toggleOption(option)}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <CheckIcon className="h-4 w-4 text-primary-foreground" />
                        </div>
                        {option.icon && (
                          <option.icon
                            className={`mr-1 h-4 w-4 text-muted-foreground ${option.iconClass}`}
                          />
                        )}
                        <span>{option.label}</span>
                      </CommandItem>
                      <div className="ml-4">
                        {option.subCategories?.map((subCategory) => {
                          const isSelected = selectedValuesSet.has(
                            subCategory.value,
                          );
                          return (
                            <CommandItem
                              key={`${option.value}-${subCategory.value}`}
                              onSelect={() => toggleOption(subCategory)}
                              className="cursor-pointer"
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible",
                                )}
                              >
                                <CheckIcon className="h-4 w-4 text-primary-foreground" />
                              </div>
                              {subCategory.icon && (
                                <subCategory.icon
                                  className={`mr-1 h-4 w-4 text-muted-foreground ${subCategory.iconClass}`}
                                />
                              )}
                              <span>{subCategory.label}</span>
                            </CommandItem>
                          );
                        })}
                      </div>
                    </React.Fragment>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 justify-center cursor-pointer"
                      >
                        Clear
                      </CommandItem>
                      <Separator
                        orientation="vertical"
                        className="flex min-h-6 h-full"
                      />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="flex-1 justify-center cursor-pointer max-w-full"
                  >
                    Close
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiSelect.displayName = "MultiSelect";
```

### Step 3: Integrate the Component

Update `page.tsx`:

```tsx
// src/app/page.tsx

"use client";

import React, { useState } from "react";
import { MultiSelect } from "@/components/multi-select";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";

const frameworksList = [
  {
    value: "react",
    label: "React",
    icon: Turtle,
    subCategories: [
      {
        value: "next.js",
        label: "next.js",
        icon: Turtle,
      },
      {
        value: "preact",
        label: "Preact",
        icon: Turtle,
      },
    ],
  },
  { value: "angular", label: "Angular", icon: Cat },
  { value: "vue", label: "Vue", icon: Dog },
  { value: "svelte", label: "Svelte", icon: Rabbit },
  { value: "ember", label: "Ember", icon: Fish },
];

function Home() {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([
    "next.js", // IMPORTANT: Notice the values here are the SUB-VALUES of "react", the actual value itself SHOULD NOT be included
    "preact",
    "angular",
  ]);

  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Multi-Select Component</h1>
      <MultiSelect
        options={frameworksList}
        selectedValues={selectedFrameworks}
        setSelectedValues={setSelectedFrameworks}
        placeholder="Select frameworks"
        variant="inverted"
        animation={2}
        maxCount={3}
      />
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Selected Frameworks:</h2>
        <ul className="list-disc list-inside">
          {selectedFrameworks.map((framework) => (
            <li key={framework}>{framework}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
```

### Step 4: Run Your Project

```bash
npm run dev
```
