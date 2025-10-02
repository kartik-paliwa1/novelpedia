import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { cn } from '@/utils/utils'

interface IconTextProps {
  icon: LucideIcon
  children: ReactNode
  className?: string
  iconClassName?: string
  textClassName?: string
  size?: "xs" | "sm" | "md"
}

export function IconText({ 
  icon: Icon, 
  children, 
  className, 
  iconClassName,
  textClassName,
  size = "sm" 
}: IconTextProps) {
  const sizeClasses = {
    xs: {
      container: "gap-1",
      icon: "h-3 w-3",
      text: "text-xs"
    },
    sm: {
      container: "gap-2", 
      icon: "h-4 w-4",
      text: "text-sm"
    },
    md: {
      container: "gap-2",
      icon: "h-5 w-5", 
      text: "text-base"
    }
  }

  return (
    <div className={cn("flex items-center", sizeClasses[size].container, className)}>
      <Icon className={cn(sizeClasses[size].icon, "text-muted-foreground", iconClassName)} />
      <span className={cn(sizeClasses[size].text, textClassName)}>{children}</span>
    </div>
  )
}
