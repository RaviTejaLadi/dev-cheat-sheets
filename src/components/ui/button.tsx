import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400",
  {
    variants: {
      variant: {
        default: "bg-lime-300 px-4 py-2.5 text-slate-950 hover:bg-lime-200",
        outline:
          "border border-[var(--line)] px-3 py-2 hover:bg-[var(--surface)]",
        ghost:
          "p-2 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
export function Button({
  asChild,
  className,
  variant,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={twMerge(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
