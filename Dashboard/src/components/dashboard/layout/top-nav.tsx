"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/dashboard/ui/button"
import { ThemeToggle } from "@/components/dashboard/layout/theme-toggle"

interface TopNavProps {
  toggleSidebar: () => void
}

export function TopNav({ toggleSidebar }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden md:flex items-center">
        <span className="text-xl font-bold gradient-heading">Inkosei</span>
        <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Author</span>
      </div>

      <div className="relative ml-auto flex items-center gap-4">
        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        </Button>
      </div>
    </header>
  )
}
