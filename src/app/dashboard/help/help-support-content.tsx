"use client"

import { useState } from "react"
import { Search, MessageCircle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/dashboard/ui/button"
import { Input } from "@/components/dashboard/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card"
import { Badge } from "@/components/dashboard/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs"
import { Separator } from "@/components/dashboard/ui/separator"
import { faqData, faqCategories, searchFAQs, getFAQsByCategory, type FAQ } from "@/data/help-support-data"
import { DISCORD_CONFIG, openDiscord } from "@/config/discord"
import { cn } from "@/lib/utils"

export function HelpSupportContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState<FAQ['category']>('getting-started')

  const toggleFAQ = (faqId: string) => {
    const newExpanded = new Set(expandedFAQs)
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId)
    } else {
      newExpanded.add(faqId)
    }
    setExpandedFAQs(newExpanded)
  }

  const filteredFAQs = searchQuery ? searchFAQs(searchQuery) : getFAQsByCategory(activeCategory)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold gradient-heading">Help & Support</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions or get personalized help through our Discord support system
        </p>
      </div>

      {/* Primary Support Channel */}
      <div className="max-w-2xl mx-auto">
        {/* Discord Support Card */}
        <Card className="novel-card cursor-pointer group border-2 border-primary/20 hover:border-primary/40 transition-colors" onClick={openDiscord}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              {DISCORD_CONFIG.joinText}
              <ExternalLink className="h-5 w-5" />
            </CardTitle>
            <Badge variant="default" className="bg-primary">Primary Support Channel</Badge>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground text-lg">
              {DISCORD_CONFIG.description}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                🎫 Professional Support System
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Our Discord features a comprehensive ticketing system for personalized support. Get help with technical issues, account problems, or feature requests directly from our team.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {DISCORD_CONFIG.features.map((feature) => (
                <Badge key={feature} variant="secondary">{feature}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQs Section */}
      <div className="space-y-6">
        {searchQuery ? (
          /* Search Results */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Search Results</h2>
              <Badge variant="outline">{filteredFAQs.length} results</Badge>
            </div>
            {filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No FAQs found matching your search.</p>
                  <Button variant="ghost" onClick={() => setSearchQuery("")} className="mt-2">
                    Clear search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    isExpanded={expandedFAQs.has(faq.id)}
                    onToggle={() => toggleFAQ(faq.id)}
                    showCategory
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Category-based FAQs */
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as FAQ['category'])}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              {Object.entries(faqCategories).map(([key, category]) => {
                const Icon = category.icon
                return (
                  <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.title}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {Object.entries(faqCategories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <div className="text-center space-y-2 mt-8">
                  <h2 className="text-2xl font-semibold flex items-center justify-center gap-2">
                    <category.icon className="h-6 w-6" />
                    {category.title}
                  </h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>

                <div className="space-y-3">
                  {getFAQsByCategory(key as FAQ['category']).map((faq) => (
                    <FAQItem
                      key={faq.id}
                      faq={faq}
                      isExpanded={expandedFAQs.has(faq.id)}
                      onToggle={() => toggleFAQ(faq.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Footer */}
      <Separator />
      <div className="text-center space-y-4 py-8">
        <h3 className="text-lg font-semibold">Need personalized assistance?</h3>
        <p className="text-muted-foreground">
          Join our Discord community above to access our professional ticketing system and get direct help from our support team
        </p>
        <Button variant="outline" onClick={openDiscord} className="mt-4">
          <MessageCircle className="h-4 w-4 mr-2" />
          Open Support Ticket
        </Button>
      </div>
    </div>
  )
}

interface FAQItemProps {
  faq: FAQ
  isExpanded: boolean
  onToggle: () => void
  showCategory?: boolean
}

function FAQItem({ faq, isExpanded, onToggle, showCategory = false }: FAQItemProps) {
  return (
    <Card className="novel-card">
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full p-4 text-left hover:bg-muted/50 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-2">{faq.question}</h3>
              {showCategory && (
                <Badge variant="outline" className="text-xs">
                  {faqCategories[faq.category].title}
                </Badge>
              )}
            </div>
            <div className="ml-4">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </button>
        
        {isExpanded && (
          <div className="px-6 pb-6">
            <Separator className="mb-4" />
            <div className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
            {faq.tags && faq.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-4">
                {faq.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}