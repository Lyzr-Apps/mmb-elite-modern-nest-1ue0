'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineChartBar, HiOutlinePhotograph } from 'react-icons/hi'

export interface ContentItem {
  id: string
  title: string
  type: string
  tier: string
  content: string
  status: 'Draft' | 'In Review' | 'Approved' | 'Published'
  date: string
  reviewResult?: Record<string, any> | null
  seoResult?: Record<string, any> | null
  researchSummary?: string
  metaDescription?: string
  suggestedHashtags?: string
  callToAction?: string
  reviewNotes?: string
}

interface DashboardSectionProps {
  contentItems: ContentItem[]
  graphicsCount: number
  onNavigate: (section: string) => void
}

export default function DashboardSection({ contentItems, graphicsCount, onNavigate }: DashboardSectionProps) {
  const totalContent = contentItems.length
  const pendingReviews = contentItems.filter(i => i.status === 'Draft' || i.status === 'In Review').length
  const approvedItems = contentItems.filter(i => i.status === 'Approved')
  const avgSeo = contentItems.reduce((acc, item) => {
    const score = parseInt(item.seoResult?.seo_score ?? '0', 10)
    return acc + (isNaN(score) ? 0 : score)
  }, 0)
  const avgSeoDisplay = totalContent > 0 ? Math.round(avgSeo / totalContent) : 0

  const statusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-muted text-muted-foreground'
      case 'In Review': return 'bg-yellow-900/30 text-yellow-400'
      case 'Approved': return 'bg-green-900/30 text-green-400'
      case 'Published': return 'bg-blue-900/30 text-blue-400'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const tierColor = (tier: string) => {
    if (tier?.includes('1')) return 'bg-red-900/30 text-red-400'
    if (tier?.includes('2')) return 'bg-yellow-900/30 text-yellow-400'
    return 'bg-green-900/30 text-green-400'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-[-0.02em] leading-[1.7]">Dashboard</h1>
        <p className="text-muted-foreground text-sm tracking-[-0.02em] leading-[1.7]">Overview of your content operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Content Created</span>
              <HiOutlineDocumentText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="font-serif text-3xl font-bold">{totalContent}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Pending Reviews</span>
              <HiOutlineClock className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="font-serif text-3xl font-bold">{pendingReviews}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Avg SEO Score</span>
              <HiOutlineChartBar className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="font-serif text-3xl font-bold">{avgSeoDisplay || '--'}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Graphics Generated</span>
              <HiOutlinePhotograph className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="font-serif text-3xl font-bold">{graphicsCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-border bg-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-base font-bold tracking-[-0.02em]">Recent Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              {contentItems.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-sm">No content created yet. Head to Content Studio to get started.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {contentItems.slice().reverse().map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 px-2 border-b border-border last:border-0">
                      <div className="min-w-0 flex-1 mr-4">
                        <p className="text-sm font-medium truncate">{item.title || 'Untitled'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs">{item.type || 'Content'}</Badge>
                        <Badge className={`text-xs ${statusColor(item.status)}`}>{item.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-base font-bold tracking-[-0.02em]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-border" onClick={() => onNavigate('content')}>
              <HiOutlineDocumentText className="h-4 w-4 mr-3" />
              New Content
            </Button>
            <Button variant="outline" className="w-full justify-start border-border" onClick={() => onNavigate('graphics')}>
              <HiOutlinePhotograph className="h-4 w-4 mr-3" />
              New Graphic
            </Button>
            <Button variant="outline" className="w-full justify-start border-border" onClick={() => onNavigate('seo')}>
              <HiOutlineChartBar className="h-4 w-4 mr-3" />
              Run SEO Audit
            </Button>
            <Button variant="outline" className="w-full justify-start border-border" onClick={() => onNavigate('review')}>
              <HiOutlineClock className="h-4 w-4 mr-3" />
              Review Queue
            </Button>
            <Separator className="my-3" />
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Approval Queue</p>
              {contentItems.filter(i => i.status === 'In Review').length === 0 ? (
                <p className="text-xs text-muted-foreground">No items pending approval</p>
              ) : (
                contentItems.filter(i => i.status === 'In Review').slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-1">
                    <span className="text-xs truncate max-w-[140px]">{item.title || 'Untitled'}</span>
                    <Badge className={`text-[10px] ${tierColor(item.tier)}`}>{item.tier || 'Tier 3'}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
