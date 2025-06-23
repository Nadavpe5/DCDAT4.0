import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-300 ease-out relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-slate-800/80 border border-slate-700/50 text-white font-bold hover:bg-slate-700/80",
        destructive: "bg-red-900/80 border border-red-800/50 text-white font-bold hover:bg-red-800/80",
        outline: "bg-slate-900/60 text-foreground hover:text-primary border border-slate-800/50 hover:bg-slate-800/60",
        secondary: "bg-slate-800/60 border border-slate-700/50 text-secondary-foreground hover:bg-slate-700/60",
        ghost: "hover:bg-slate-800/40 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "glass-button text-foreground hover:text-primary",
        success: "bg-green-900/80 border border-green-800/50 text-white font-bold hover:bg-green-800/80",
        "gradient-purple": "bg-purple-900/80 border border-purple-800/50 text-white font-bold hover:bg-purple-800/80",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-xl px-4 py-2 text-xs",
        lg: "h-16 rounded-2xl px-8 py-4 text-base",
        icon: "h-12 w-12",
        "icon-sm": "h-8 w-8 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
