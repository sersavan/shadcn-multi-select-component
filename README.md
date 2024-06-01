### Installation and Integration of Multi-Select Component in Next.js with shadcn

#### Prerequisites

Ensure you have a Next.js project set up. If not, create one using the following command:

```bash
npx create-next-app@latest my-nextjs-app
cd my-nextjs-app
```

#### Step 1: Install Dependencies

Install the required dependencies including shadcn components, react-hook-form for form handling, and zod for validation.

```bash
npm install @shadcn/ui lucide-react @hookform/resolvers react-hook-form zod class-variance-authority
```

#### Step 2: Install shadcn Components

To use shadcn components, you need to install them. You can install the specific components required for the multi-select component as follows:

```bash
npm install @shadcn/ui/popover @shadcn/ui/button @shadcn/ui/separator @shadcn/ui/badge @shadcn/ui/command
```

#### Step 3: Create the Multi-Select Component

Create a new file named `MultiSelectFormField.tsx` in your components directory and add the following code:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
  WandSparkles,
} from "lucide-react";

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

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 drop-shadow-md text-foreground bg-card hover:bg-card/80",
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
  }
);

interface MultiSelectFormFieldProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  asChild?: boolean;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  defaultValue?: string[];
  disabled?: boolean;
  placeholder: string;
  className?: string;
  animation?: number;
  onValueChange: (value: string[]) => void;
}

const MultiSelectFormField = React.forwardRef<
  HTMLButtonElement,
  MultiSelectFormFieldProps
>(
  (
    {
      className,
      variant,
      asChild = false,
      options,
      defaultValue,
      onValueChange,
      disabled,
      placeholder,
      animation = 0,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      defaultValue || []
    );
    const selectedValuesSet = React.useRef(new Set(selectedValues));
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(animation > 0);

    React.useEffect(() => {
      setSelectedValues(defaultValue || []);
      selectedValuesSet.current = new Set(defaultValue);
    }, [defaultValue]);

    const handleInputKeyDown = (event: any) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.target.value) {
        selectedValues.pop();
        setSelectedValues([...selectedValues]);
        selectedValuesSet.current.delete(
          selectedValues[selectedValues.length - 1]
        );
        onValueChange([...selectedValues]);
      }
    };

    const toggleOption = (value: string) => {
      if (selectedValuesSet.current.has(value)) {
        selectedValuesSet.current.delete(value);
        setSelectedValues(selectedValues.filter((v) => v !== value));
      } else {
        selectedValuesSet.current.add(value);
        setSelectedValues([...selectedValues, value]);
      }
      onValueChange(Array.from(selectedValuesSet.current));
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-card"
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center">
                  {selectedValues.map((value) => {
                    const option = options.find((o) => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        className={cn(
                          isAnimating ? "animate-bounce" : "",
                          multiSelectVariants({ variant, className })
                        )}
                        style={{
                          animationDuration: `${animation}s`,
                        }}
                      >
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 mr-2" />
                        )}
                        {option?.label}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value);
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
                      setSelectedValues([]);
                      selectedValuesSet.current.clear();
                      onValueChange([]);
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
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[200px] p-0 drop-shadow-sm"
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
                {options.map((option) => {
                  const isSelected = selectedValuesSet.current.has(
                    option.value
                  );
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      style={{
                        pointerEvents: "auto",
                        opacity: 1,
                      }}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={() => {
                          setSelectedValues([]);
                          selectedValuesSet.current.clear();
                          onValueChange([]);
                        }}
                        style={{
                          pointerEvents: "auto",
                          opacity: 1,
                        }}
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
                  <CommandSeparator />
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    style={{
                      pointerEvents: "auto",
                      opacity: 1,
                    }}
                    className="flex-1 justify-center cursor-pointer"
                  >
                    Close
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <WandSparkles
            className

={cn(
              "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
              isAnimating ? "" : "text-muted-foreground"
            )}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    );
  }
);

MultiSelectFormField.displayName = "MultiSelectFormField";

export default MultiSelectFormField;
```

#### Step 4: Integrate the Multi-Select Component in a Form

Create or update a page/component where you want to use the multi-select component with form validation using Zod.

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import MultiSelectFormField from "@/components/ui/multi-select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

const frameworksList = [
  {
    value: "next.js",
    label: "Next.js",
    icon: Icons.dog,
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    icon: Icons.cat,
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    icon: Icons.turtle,
  },
  {
    value: "remix",
    label: "Remix",
    icon: Icons.rabbit,
  },
  {
    value: "astro",
    label: "Astro",
    icon: Icons.fish,
  },
];

const FormSchema = z.object({
  frameworks: z
    .array(z.string().min(1))
    .min(1)
    .nonempty("Please select at least one framework."),
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      frameworks: ["next.js", "nuxt.js", "astro"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast(
      `You have selected following frameworks: ${data.frameworks.join(", ")}.`
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start space-y-3 p-3">
      <PageHeader>
        <PageHeaderHeading>Multi select component</PageHeaderHeading>
        <PageHeaderDescription>assembled with shadcn/ui</PageHeaderDescription>
        <PageActions>
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://github.com/sersavan/shadcn-multi-select-component"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Link>
        </PageActions>
      </PageHeader>
      <Card className="w-full max-w-2xl p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="frameworks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frameworks</FormLabel>
                  <FormControl>
                    <MultiSelectFormField
                      options={frameworksList}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select options"
                      variant="inverted"
                      animation={2}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose the frameworks you are interested in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="outline" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </Card>
    </main>
  );
}
```

#### Step 5: Using Variants and Animations

You can control the appearance of the component by using different variants and enabling/disabling animations. Modify the `variant` and `animation` props in the `MultiSelectFormField` component to see the changes.

Example with secondary variant and no animation:

```tsx
<MultiSelectFormField
  options={frameworksList}
  defaultValue={field.value}
  onValueChange={field.onChange}
  placeholder="Select options"
  variant="secondary"
  animation={0}
/>
```

#### Step 6: Deploying and Testing

Run your Next.js project to see the multi-select component in action.

```bash
npm run dev
```

Visit `http://localhost:3000` to see the form with the multi-select component integrated.

### Conclusion

You have successfully integrated a multi-select component in your Next.js project using shadcn, with form validation powered by Zod. Customize the component further as per your needs, and explore various shadcn components to enhance your project.
