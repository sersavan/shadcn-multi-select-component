"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import MultiSelectFormField from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
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
import { Toast } from "@/components/ui/toast";

const frameworksList = [
  {
    value: "next.js",
    label: "Next.js",
    icon: Dog,
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    icon: Cat,
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    icon: Turtle,
  },
  {
    value: "remix",
    label: "Remix",
    icon: Rabbit,
  },
  {
    value: "astro",
    label: "Astro",
    icon: Fish,
  },
];

const FormSchema = z.object({
  frameworks: z
    .array(z.string())
    .nonempty("Please select at least one framework."),
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      frameworks: [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast(
      `You have selected following frameworks: ${data.frameworks.join(", ")}.`
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-full max-w-3xl p-5">
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
                      onValueChange={field.onChange}
                      placeholder="Select options"
                    />
                  </FormControl>
                  <FormDescription>
                    Choose the frameworks you are interested in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </Card>
    </main>
  );
}
