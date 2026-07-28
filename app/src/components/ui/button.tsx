import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Mirrors the official SAC button styleguide (`.c-button` family), see
// https://saccas-frontend.netlify.app/preview/styleguide/components-buttons
// and technische-anforderungen.md § 4.4 for the full class/colour mapping.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-[180ms] ease-[cubic-bezier(0,0,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // c-button (primary CTA), e.g. "Details anzeigen"
        default:
          "rounded-none bg-sac-red text-xs font-semibold uppercase tracking-wide text-white hover:bg-sac-red-hover disabled:bg-sac-red/50",
        // c-button--positive-cta, e.g. "Anmelden"
        positive:
          "rounded-none bg-sac-green text-xs font-semibold uppercase tracking-wide text-white hover:bg-sac-green-hover disabled:bg-sac-green/50",
        // c-button--secondary, outlined secondary actions
        outline:
          "rounded-none border border-sac-gray-dark bg-transparent text-xs font-semibold uppercase tracking-wide text-sac-gray-dark hover:border-sac-black hover:bg-sac-black hover:text-white disabled:border-sac-gray disabled:bg-sac-gray disabled:text-sac-gray-dark",
        // c-button--tertiary, muted outlined actions
        tertiary:
          "rounded-none border border-sac-gray bg-sac-gray-light text-xs font-semibold uppercase tracking-wide text-sac-gray-dark hover:border-sac-gray-dark disabled:opacity-50",
        // c-button--pill, rounded filter/toggle pills (use aria-pressed for the "is-active" state)
        pill:
          "rounded-full border border-sac-gray bg-transparent text-[15px] font-semibold normal-case text-sac-gray-dark hover:border-sac-red-30 hover:text-sac-red aria-pressed:border-sac-red aria-pressed:text-sac-red aria-pressed:pointer-events-none",
        // c-button--select, sharp-cornered select/toggle button
        select:
          "rounded-none border border-sac-gray bg-transparent text-xs font-semibold uppercase tracking-wide text-sac-gray-dark hover:border-sac-gray-dark aria-pressed:border-sac-gray aria-pressed:bg-sac-gray aria-pressed:pointer-events-none",
        // c-button-text, e.g. "Reset", "Zurücksetzen"
        ghost:
          "rounded-none bg-transparent text-current hover:text-sac-red disabled:opacity-50",
        // c-button-text--red, destructive text action
        destructive:
          "rounded-none bg-transparent text-sac-red hover:text-sac-red-hover disabled:opacity-50",
        link: "rounded-none bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[50px] px-8",
        sm: "h-8 px-3",
        lg: "h-[60px] px-10 text-sm",
        icon: "h-[50px] w-[50px] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
