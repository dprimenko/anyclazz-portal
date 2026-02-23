import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Text } from "@/ui-library/components/ssr/text/Text";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center border transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: 'bg-[rgba(255,253,251,1)] border-[rgba(213,215,218,1)] shadow-[0_1px_2px_0_rgba(10,13,18,0.05)] [box-shadow:inset_0_-2px_0_0_rgba(10,13,18,0.05)] hover:bg-gray-50',
        ghost: "border-transparent hover:bg-white/10 px-[5px] py-0 w-auto h-auto",
      },
      size: {
        default: "rounded-lg w-12 h-12",
        xxs: "rounded-md w-6 h-6",
        xs: "rounded-md w-8 h-8",
        sm: "rounded-lg w-10 h-10",
        md: "rounded-lg w-12 h-12",
        lg: "rounded-lg w-14 h-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "ghost",
        class: "!w-auto !h-auto",
      },
    ],
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: string;
  highlighted?: boolean;
  iconSize?: number;
  label?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'default', size, icon, iconSize = 24, label, highlighted, ...props }, ref) => {

    const cns = cn(
      iconButtonVariants({ variant, size, className }), 
      { "border-[var(--color-primary-700)] bg-[var(--color-primary-200)]" : highlighted && variant === 'default' },
    );
    if (label) {
      return (
        <div className="flex flex-col items-center gap-[0.25rem]">
          <button
            className={cns} // Remove padding for icon-only button
            ref={ref}
            {...props}
          >
            <Icon 
              icon={icon} iconWidth={iconSize} 
              iconHeight={iconSize} 
              {...(variant === "default" && highlighted ? { iconColor: "#F4A43A" } : {})} 
              {...(variant === "ghost" && highlighted ? { iconColor: "#F4A43A" } : {})} 
              {...(variant === "ghost" && !highlighted ? { iconColor: "#FFFFFF" } : {})} 
            />
          </button>
          <Text size="text-xs" weight="medium" color={variant === "ghost" ? "#FFFFFF" : "var(--color-neutral-600)"} textalign="center">
            {label}
          </Text>
        </div>
      );
    }

    return (
      <button
        className={cns}
        ref={ref}
        {...props}
      >
        <Icon icon={icon} iconWidth={iconSize} iconHeight={iconSize} {...(variant === "ghost" ? { iconColor: "#FFFFFF" } : {})} />
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
