"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TopNav } from "@/modules/dashboard/components/layout/top-nav"
import { Sidebar } from "@/modules/dashboard/components/layout/sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} isMobile={isMobile} />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen && !isMobile ? "lg:ml-64" : isMobile ? "ml-0" : "lg:ml-20"
        }`}
      >
        <TopNav toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
