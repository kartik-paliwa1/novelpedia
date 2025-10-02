import { Badge } from '@/common/components/ui/badge'
import { cn } from '@/utils/utils'

type StatusType = "Draft" | "Published" | "Completed" | "Publishing" | "policy" | "contest"
type VariantType = "default" | "overlay" | "subtle"

interface StatusBadgeProps {
  status: StatusType
  variant?: VariantType
  className?: string
}

export function StatusBadge({ status, variant = "default", className }: StatusBadgeProps) {
  const getStatusStyles = (status: StatusType, variant: VariantType) => {
    const styles: Record<StatusType, Record<VariantType, string>> = {
      // Novel/Project statuses
      Draft: {
        default: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        overlay: "bg-amber-500/90 text-white border-amber-500",
        subtle: "bg-amber-500/10 text-amber-400 border-amber-500/20"
      },
      Published: {
        default: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        overlay: "bg-emerald-500/90 text-white border-emerald-500",
        subtle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      },
      Completed: {
        default: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        overlay: "bg-blue-500/90 text-white border-blue-500",
        subtle: "bg-blue-500/10 text-blue-400 border-blue-500/20"
      },
      Publishing: {
        default: "bg-green-500/10 text-green-400 border-green-500/20",
        overlay: "bg-green-500/90 text-white border-green-500",
        subtle: "bg-green-500/10 text-green-400 border-green-500/20"
      },
      // Content type statuses
      policy: {
        default: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        overlay: "bg-blue-500/90 text-white border-blue-500",
        subtle: "bg-blue-500/10 text-blue-400 border-blue-500/20"
      },
      contest: {
        default: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        overlay: "bg-amber-500/90 text-white border-amber-500",
        subtle: "bg-amber-500/10 text-amber-400 border-amber-500/20"
      }
    }

    // Runtime-safe fallback: handle unknown status or variant gracefully
    const safeStyles = (styles as Record<string, Record<VariantType, string>>)[
      status as unknown as string
    ] ?? styles.Draft

    return safeStyles[variant] ?? safeStyles.default
  }

  const getStatusLabel = (status: StatusType) => {
    const labels = {
  Draft: "Draft",
  Published: "Published",
  Completed: "Completed", 
  Publishing: "Publishing",
      policy: "POLICY",
      contest: "CONTEST"
    }
    return labels[status] || status
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        getStatusStyles(status, variant),
        className
      )}
    >
      {getStatusLabel(status)}
    </Badge>
  )
}
