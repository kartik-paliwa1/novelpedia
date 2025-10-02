// Writing tools component - currently shows Coming Soon for MVP
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/modules/dashboard/components/ui/card"
import { Button } from "@/modules/dashboard/components/ui/button"
import { WritingTool } from "@/types/ideas"
import { Wrench, Clock } from "lucide-react"

interface WritingToolsProps {
  tools?: WritingTool[]
  onToolAction?: (tool: WritingTool) => void
}

// MVP: Feature disabled - Coming Soon
// const defaultTools: WritingTool[] = [
//   {
//     id: 1,
//     title: "Character Name Generator",
//     description: "Generate unique character names for your stories",
//     category: "Character Development",
//     action: "Try Generator",
//   },
//   {
//     id: 2,
//     title: "Plot Structure Template",
//     description: "Three-act structure template for organizing your story",
//     category: "Story Structure",
//     action: "Download Template",
//   },
//   {
//     id: 3,
//     title: "World Building Worksheet",
//     description: "Comprehensive worksheet for creating fictional worlds",
//     category: "World Building",
//     action: "Get Worksheet",
//   },
// ]

export function WritingTools({ tools = [], onToolAction }: WritingToolsProps) {
  // MVP: Suppress unused parameter warnings
  void tools
  void onToolAction

  return (
    <div className="space-y-6">
      {/* MVP: Coming Soon Section */}
      <Card className="neumorphic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-500" />
            Writing Tools & Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Coming Soon!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Powerful writing tools are in development! Character generators, plot templates, 
                world-building worksheets, and more productivity tools will be available soon.
              </p>
            </div>
            <Button variant="outline" disabled className="bg-transparent">
              Get Early Access
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MVP: Commented out full functionality
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.id} className="neumorphic">
            <CardHeader>
              <CardTitle className="text-base">{tool.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {tool.description}
              </p>
              <Button 
                className="w-full"
                onClick={() => onToolAction?.(tool)}
              >
                {tool.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      */}
    </div>
  )
}
