"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const Popover = ({...props}: React.HTMLAttributes<HTMLDivElement>) => <div {...props}/>

const PopoverTrigger = ({...props}: React.HTMLAttributes<HTMLButtonElement>) => <button {...props} />

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: "center" | "start" | "end", sideOffset?: number}
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <div>
    <div
      ref={ref}
      // align and sideOffset are not directly mappable to simple HTML/CSS without more logic
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </div>
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
