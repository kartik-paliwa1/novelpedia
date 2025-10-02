"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, Home, Lightbulb, MessageSquare, PenLine, Users, X } from "lucide-react"
import { cn } from '@/utils/utils'
import { Button } from '@/common/components/ui/button'
import { ScrollArea } from '@/common/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu'
import { Settings, User, LogOut, CreditCard, HelpCircle } from "lucide-react"
import Link from "next/link"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isMobile: boolean
}

export function Sidebar({ isOpen, setIsOpen, isMobile }: SidebarProps) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm transition-all duration-100"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card transition-all duration-300 ease-in-out",
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : isOpen
              ? "translate-x-0 w-64"
              : "w-20 translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className={cn("flex items-center", !isOpen && !isMobile && "hidden")}>
            <div className="relative">
              <PenLine className="h-6 w-6 text-primary" />
              <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            </div>
            <span className="ml-2 text-lg font-semibold">Inkosei</span>
          </div>
          <div className={cn("hidden", !isOpen && !isMobile ? "block mx-auto" : "")}>
            {!isOpen && !isMobile && (
              <div className="relative">
                <PenLine className="h-6 w-6 text-primary" />
                <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              </div>
            )}
          </div>

          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-2 px-2">
            <div
              className={cn(
                "mb-2 px-4 text-xs font-medium text-muted-foreground",
                !isOpen && !isMobile && "px-2 text-center",
              )}
            >
              {isOpen || isMobile ? "MENU" : "MENU"}
            </div>

            <SidebarLink href="/" icon={Home} label="Overview" isOpen={isOpen || isMobile} active={pathname === "/"} />
            <SidebarLink
              href="/editor"
              icon={PenLine}
              label="Workspace"
              isOpen={isOpen || isMobile}
              active={pathname === "/editor"}
            />
            <SidebarLink
              href="/messages"
              icon={MessageSquare}
              label="Messages"
              isOpen={isOpen || isMobile}
              active={pathname === "/messages"}
            />
            <SidebarLink
              href="/ideas"
              icon={Lightbulb}
              label="Ideas"
              isOpen={isOpen || isMobile}
              active={pathname === "/ideas"}
            />
            <SidebarLink
              href="/community"
              icon={Users}
              label="Community"
              isOpen={isOpen || isMobile}
              active={pathname === "/community"}
            />
          </nav>
        </ScrollArea>

        <div className="mt-auto border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-3 cursor-pointer hover:bg-secondary rounded-lg p-2 transition-colors",
                  !isOpen && !isMobile && "justify-center",
                )}
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">A</span>
                  </div>
                  <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                {(isOpen || isMobile) && (
                  <div>
                    <div className="text-sm font-medium">Author Name</div>
                    <div className="text-xs text-muted-foreground">Free Plan</div>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}

interface SidebarLinkProps {
  href: string
  icon: React.ComponentType<{ className?: string }>;
  label: string
  isOpen: boolean
  active?: boolean
}

function SidebarLink({ href, icon: Icon, label, isOpen, active = false }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "sidebar-link group relative",
        active ? "sidebar-link-active" : "sidebar-link-inactive",
        !isOpen && "justify-center px-0",
      )}
    >
      <div className="relative">
        <Icon className="h-5 w-5" />
        {active && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary"></span>}
      </div>

      {isOpen && <span>{label}</span>}

      {/* Tooltip for collapsed state */}
      {!isOpen && (
        <div className="absolute left-full ml-2 rounded-md bg-popover px-2 py-1 text-xs opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
          {label}
        </div>
      )}
    </Link>
  )
}
