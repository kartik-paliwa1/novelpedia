"use client"

import { CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card"
import { Badge } from "@/components/dashboard/ui/badge"

export function BankingTab() {
  return (
    <Card className="novel-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment & Banking Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <CreditCard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-semibold">Banking & Payments</h3>
          <p className="text-muted-foreground max-w-md mx-auto text-base">
            We're working hard to bring you secure payment processing and banking integration. This feature will be available soon!
          </p>
          <Badge variant="outline" className="text-sm px-4 py-1">
            Coming Soon
          </Badge>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-3 max-w-sm">
          <div className="text-center text-xs text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-2">What's coming:</p>
            <ul className="space-y-1 text-left">
              <li>• Secure bank account linking</li>
              <li>• PayPal & Stripe integration</li>
              <li>• Detailed earnings reports</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
