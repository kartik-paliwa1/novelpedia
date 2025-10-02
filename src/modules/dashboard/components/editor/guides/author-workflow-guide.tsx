'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/modules/dashboard/components/ui/card';
import { Button } from "@/modules/dashboard/components/ui/button";
import { Badge } from "@/modules/dashboard/components/ui/badge";
import { 
  BookOpen, 
  Edit3, 
  Save, 
  Eye, 
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap,
  Target,
  X
} from 'lucide-react';
import { cn } from '@/utils/utils';

interface AuthorWorkflowGuideProps {
  onDismiss?: () => void;
  variant?: 'new-chapter' | 'first-time' | 'tips';
  className?: string;
}

export function AuthorWorkflowGuide({ 
  onDismiss, 
  variant = 'new-chapter',
  className 
}: AuthorWorkflowGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const workflowSteps = [
    {
      icon: BookOpen,
      title: "Start Writing",
      description: "Begin with your ideas. Don't worry about perfection - just get your story flowing.",
      tips: [
        "Write in the editor below - it auto-saves every 30 seconds",
        "Use Focus Mode (eye icon) to minimize distractions",
        "Aim for at least 100 words to mark chapter as 'completed'"
      ],
      shortcut: "Just start typing!",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Edit3,
      title: "Format & Style",
      description: "Use the toolbar to format your text and make it reader-friendly.",
      tips: [
        "Use bold/italic for emphasis",
        "Create dialogue with the dialogue style",
        "Add scene breaks between sections",
        "Use the chapter title style for major sections"
      ],
      shortcut: "Select text to see formatting options",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Save,
      title: "Save Progress",
      description: "Your work is automatically saved, but you can manually save anytime.",
      tips: [
        "Auto-save runs every 30 seconds when you're typing",
        "Press Ctrl+S for immediate save",
        "See save status in the top-right corner",
        "Green 'Completed' badge appears when you have 100+ words"
      ],
      shortcut: "Ctrl+S",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Eye,
      title: "Preview & Read",
      description: "Switch to Reader Mode to see exactly how your readers will experience your chapter.",
      tips: [
        "Use the toggle in your novel management page",
        "Reader mode hides all editing tools",
        "Perfect for proofreading and final review",
        "Share this view with beta readers"
      ],
      shortcut: "Toggle in novel settings",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      icon: CheckCircle,
      title: "Publish & Share",
      description: "When you're happy with your chapter, you can mark it as complete.",
      tips: [
        "Completed chapters show a green checkmark",
        "Readers can access completed chapters",
        "You can always edit published chapters",
        "Track views and engagement in your dashboard"
      ],
      shortcut: "Automatic when 100+ words",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  const quickTips = [
    {
      icon: Zap,
      title: "Quick Tips",
      items: [
        "Use Ctrl+S to save anytime",
        "F11 for fullscreen mode",
        "Focus Mode removes distractions",
        "Auto-save works even when offline"
      ]
    },
    {
      icon: Target,
      title: "Best Practices",
      items: [
        "Write 500-2000 words per chapter",
        "Use dialogue to bring characters to life",
        "Add scene breaks for pacing",
        "Edit in small chunks for better focus"
      ]
    },
    {
      icon: Lightbulb,
      title: "Pro Author Tips",
      items: [
        "Write every day, even if just 100 words",
        "Don't edit while writing - just flow",
        "Use reader mode to spot issues",
        "Track your word count goals"
      ]
    }
  ];

  const currentStepData = workflowSteps[currentStep];

  if (variant === 'tips') {
    return (
      <Card className={cn("border-l-4 border-l-blue-500", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Author Quick Reference</h3>
            </div>
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickTips.map((section, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-sm">{section.title}</h4>
                </div>
                <ul className="space-y-1 text-xs text-gray-600">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-l-4 border-l-blue-500", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">
              {variant === 'new-chapter' ? 'Chapter Writing Guide' : 'Welcome to Your Author Workspace'}
            </h3>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Step {currentStep + 1} of {workflowSteps.length}</span>
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / workflowSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className={cn("p-4 rounded-lg", currentStepData.bgColor)}>
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg bg-white shadow-sm")}>
              <currentStepData.icon className={cn("h-5 w-5", currentStepData.color)} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{currentStepData.title}</h4>
              <p className="text-sm text-gray-700 mb-3">{currentStepData.description}</p>
              
              <div className="space-y-2">
                {currentStepData.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  💡 Quick tip: {currentStepData.shortcut}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {workflowSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentStep ? "bg-blue-600" : "bg-gray-300"
                )}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < workflowSteps.length - 1 ? (
              <Button 
                size="sm"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="gap-2"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                size="sm"
                onClick={onDismiss}
                className="gap-2"
              >
                Start Writing
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
