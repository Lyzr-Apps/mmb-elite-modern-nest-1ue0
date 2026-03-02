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
  const avgSeo = contentItems.reduce((acc, item) => {
    const score = parseInt(item.seoResult?.seo_score ?? '0', 10)
    return acc + (isNaN(score) ? 0 : score)
  }, 0)
  const avgSeoDisplay = totalContent > 0 ? Math.round(avgSeo / totalContent) : 0

  const statusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-600'
      case 'In Review': return 'bg-amber-50 text-amber-700 border border-amber-200'
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      case 'Published': return 'bg-[#0020FF]/10 text-[#0020FF] border border-[#0020FF]/20'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const tierColor = (tier: string) => {
    if (tier?.includes('1')) return 'bg-red-50 text-red-600 border border-red-200'
    if (tier?.includes('2')) return 'bg-amber-50 text-amber-700 border border-amber-200'
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your content operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Content Created</span>
              <div className="h-9 w-9 rounded-lg bg-[#0020FF]/10 flex items-center justify-center">
                <HiOutlineDocumentText className="h-5 w-5 text-[#0020FF]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalContent}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Pending Reviews</span>
              <div className="h-9 w-9 rounded-lg bg-[#FF6FF0]/10 flex items-center justify-center">
                <HiOutlineClock className="h-5 w-5 text-[#FF6FF0]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{pendingReviews}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Avg SEO Score</span>
              <div className="h-9 w-9 rounded-lg bg-[#0020FF]/10 flex items-center justify-center">
                <HiOutlineChartBar className="h-5 w-5 text-[#0020FF]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgSeoDisplay || '--'}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Graphics Generated</span>
              <div className="h-9 w-9 rounded-lg bg-[#FF6FF0]/10 flex items-center justify-center">
                <HiOutlinePhotograph className="h-5 w-5 text-[#FF6FF0]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{graphicsCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Content + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-gray-900">Recent Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              {contentItems.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-sm">No content created yet. Head to Content Studio to get started.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {contentItems.slice().reverse().map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 px-2 border-b border-gray-100 last:border-0">
                      <div className="min-w-0 flex-1 mr-4">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title || 'Untitled'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">{item.type || 'Content'}</Badge>
                        <Badge className={`text-xs ${statusColor(item.status)}`}>{item.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700 hover:bg-[#0020FF]/5 hover:text-[#0020FF] hover:border-[#0020FF]/30" onClick={() => onNavigate('content')}>
              <HiOutlineDocumentText className="h-4 w-4 mr-3 text-[#0020FF]" />
              New Content
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700 hover:bg-[#FF6FF0]/5 hover:text-[#FF6FF0] hover:border-[#FF6FF0]/30" onClick={() => onNavigate('graphics')}>
              <HiOutlinePhotograph className="h-4 w-4 mr-3 text-[#FF6FF0]" />
              New Graphic
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700 hover:bg-[#0020FF]/5 hover:text-[#0020FF] hover:border-[#0020FF]/30" onClick={() => onNavigate('seo')}>
              <HiOutlineChartBar className="h-4 w-4 mr-3 text-[#0020FF]" />
              Run SEO Audit
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" onClick={() => onNavigate('review')}>
              <HiOutlineClock className="h-4 w-4 mr-3 text-amber-500" />
              Review Queue
            </Button>
            <Separator className="my-3 bg-gray-100" />
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Approval Queue</p>
              {contentItems.filter(i => i.status === 'In Review').length === 0 ? (
                <p className="text-xs text-gray-400">No items pending approval</p>
              ) : (
                contentItems.filter(i => i.status === 'In Review').slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-1">
                    <span className="text-xs text-gray-700 truncate max-w-[140px]">{item.title || 'Untitled'}</span>
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
