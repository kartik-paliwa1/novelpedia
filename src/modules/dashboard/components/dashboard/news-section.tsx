import { Card, CardContent, CardHeader } from "@/common/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/tabs"
import { Button } from "@/common/components/ui/button"
import { ChevronRight } from "lucide-react"

export function NewsSection() {
  return (
    <Card>
      <Tabs defaultValue="news" className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex-1">
            <TabsList className="bg-card">
              <TabsTrigger value="news">NEWS</TabsTrigger>
              <TabsTrigger value="inbox">INBOX</TabsTrigger>
            </TabsList>
          </div>
          <Button variant="link" size="sm" className="text-xs text-primary">
            SEE&nbsp;ALL <ChevronRight className="h-3 w-3" />
          </Button>
        </CardHeader>

        <CardContent>
          <TabsContent value="news" className="mt-0 space-y-4">
            <NewsItem title="Do not use AI to edit your contract application!" date="17 Jul 2025" />
            <NewsItem title="Spam Comment Detection Upgraded" date="26 May 2025" />
            <NewsItem title="Plagiarism & Use of AI & Abusing MS5/win-win" date="14 Mar 2025" />
            <NewsItem title="Notes in Inkstone and WebNovel app Available" date="10 Jan 2025" />
            <NewsItem title="These AI-created works are not welcomed!" date="23 Oct 2024" />
          </TabsContent>

          <TabsContent value="inbox" className="mt-0 space-y-4">
            <NewsItem title="Your chapter has been approved" date="16 Jul 2025" />
            <NewsItem title="New comment on your story" date="15 Jul 2025" />
            <NewsItem title="Payment processed" date="10 Jul 2025" />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

interface NewsItemProps {
  title: string
  date: string
}

function NewsItem({ title, date }: NewsItemProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="text-sm">{title}</div>
      <div className="text-xs text-muted-foreground">{date}</div>
    </div>
  )
}
