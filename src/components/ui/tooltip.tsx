"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const TooltipProvider = ({...props}: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />

const Tooltip = ({...props}: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />

const TooltipTrigger = ({...props}: React.HTMLAttributes<HTMLButtonElement>) => <button {...props} />

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number, hidden?: boolean }
>(({ className, sideOffset = 4, hidden, ...props }, ref) => {
  if (hidden) return null;
  return (
    <div
      ref={ref}
      // sideOffset is not directly applicable in simple HTML/CSS
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
