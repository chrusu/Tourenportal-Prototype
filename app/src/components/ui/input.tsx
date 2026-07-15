import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // SAC styleguide: flat inputs, 50px height, 20px left padding,
          // light #e9e9e9 border, gray-dark border on focus (no ring).
          "flex h-[50px] w-full border border-sac-gray bg-white px-5 py-2 text-sm text-sac-black",
          "placeholder:text-[#bfbfbf] placeholder:font-light",
          "transition-[border-color] duration-[180ms] ease-[cubic-bezier(0,0,0.2,1)]",
          "focus-visible:outline-none focus-visible:border-sac-gray-dark focus-visible:ring-0 focus-visible:ring-offset-0",
          "disabled:cursor-not-allowed disabled:bg-sac-gray-light disabled:text-sac-gray-medium",
          "read-only:bg-sac-gray-light read-only:text-sac-gray-medium",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
