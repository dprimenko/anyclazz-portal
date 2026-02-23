import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-4 border-solid border-[#E6E6E6] [border-top-color:var(--color-primary-700)] align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] w-14 h-14",
  {
    variants: {
      variant: {
        default: "",
        secondary: "[border-top-color:hsl(var(--secondary))]",
        muted: "[border-top-color:hsl(var(--muted-foreground))]",
        white: "border-[#E6E6E6] border-t-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, variant, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ variant }), className)}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export { Spinner, spinnerVariants }
