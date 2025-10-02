// Writing prompts component - currently shows Coming Soon for MVP
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/modules/dashboard/components/ui/card"
import { Button } from "@/modules/dashboard/components/ui/button"
import { Lightbulb, Clock } from "lucide-react"

interface WritingPromptsProps {
  prompts?: string[]
  onUsePrompt?: (prompt: string) => void
  onSavePrompt?: (prompt: string) => void
  onGenerateNew?: () => void
}

// MVP: Feature disabled - Coming Soon
// const defaultPrompts = [
//   "A character discovers they can hear the thoughts of books.",
//   "In a world where emotions are currency, your protagonist is bankrupt.",
//   "Every lie told in your city becomes physically manifest.",
//   "A librarian discovers that fictional characters are escaping from books.",
//   "Time moves backwards for one person in a forward-moving world.",
// ]

export function WritingPrompts({ 
  prompts = [], 
  onUsePrompt, 
  onSavePrompt, 
  onGenerateNew 
}: WritingPromptsProps) {
  // MVP: Suppress unused parameter warnings
  void prompts
  void onUsePrompt
  void onSavePrompt
  void onGenerateNew

  return (
    <Card className="neumorphic">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Daily Writing Prompts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MVP: Coming Soon Section */}
        <div className="text-center py-12 space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Coming Soon!</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We&apos;re working on an amazing writing prompts feature that will help spark your creativity. 
              Daily prompts, custom generators, and inspiration tools are on their way!
            </p>
          </div>
          <Button variant="outline" disabled className="bg-transparent">
            Notify Me When Available
          </Button>
        </div>

        {/* MVP: Commented out full functionality
        {prompts.map((prompt, index) => (
          <div 
            key={index} 
            className="p-4 rounded-lg border bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <p className="text-sm mb-3">&quot;{prompt}&quot;</p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-transparent"
                onClick={() => onUsePrompt?.(prompt)}
              >
                Use This Prompt
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onSavePrompt?.(prompt)}
              >
                Save for Later
              </Button>
            </div>
          </div>
        ))}
        <Button 
          className="w-full bg-transparent" 
          variant="outline"
          onClick={onGenerateNew}
        >
          Generate New Prompts
        </Button>
        */}
      </CardContent>
    </Card>
  )
}
