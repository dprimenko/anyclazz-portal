import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-2 border-solid align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] w-14 h-14",
  {
    variants: {
      variant: {
        default: "border-[#F7B35A] [border-top-color:#FDD7A5]",
        secondary: "border-[#E0E1E3] [border-top-color:#A4A7AE]",
        muted: "[border-top-color:hsl(var(--muted-foreground))]",
        white: "border-[#FDD7A5] border-t-white",
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
