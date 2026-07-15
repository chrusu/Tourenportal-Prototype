import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// SAC styleguide: 16×16 px square checkbox, border #706f6f (gray-dark),
// red (#E30613) checkmark on checked state.
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "h-4 w-4 shrink-0 border border-sac-gray-dark bg-white",
      "transition-colors duration-[180ms] ease-[cubic-bezier(0,0,0.2,1)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sac-red/30 focus-visible:ring-offset-1",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-sac-red data-[state=checked]:bg-white",
      className
    )}
    {...props}
  >
    {/* group/ind: children can target data-state=indeterminate on the Indicator */}
    <CheckboxPrimitive.Indicator
      className={cn("group/ind flex items-center justify-center text-sac-red")}
    >
      <Check className="h-3.5 w-3.5 stroke-[2.5] group-data-[state=indeterminate]/ind:hidden" />
      <Minus className="hidden h-3.5 w-3.5 stroke-[2.5] group-data-[state=indeterminate]/ind:block" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
