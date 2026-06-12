import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border-[1.5px] border-transparent font-heading text-[0.84rem] font-extrabold uppercase tracking-wide ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gold text-ink shadow-sm hover:-translate-y-0.5 hover:bg-gold-bright hover:shadow-gold",
        forest:
          "bg-forest text-white shadow-sm hover:-translate-y-0.5 hover:bg-forest-400",
        outline:
          "border-white/20 bg-transparent text-bone hover:-translate-y-0.5 hover:border-gold hover:text-gold-bright",
        ghost: "hover:bg-white/5 hover:text-gold-bright",
        dark: "bg-ink-800 text-bone hover:bg-ink-800/80",
        link: "text-gold underline-offset-4 hover:text-gold-bright hover:underline",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4",
        lg: "h-14 px-7 text-[0.9rem]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
