'use client'

import React, { useState, useCallback } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { HiOutlineViewGrid, HiOutlineDocumentText, HiOutlinePhotograph, HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineCog, HiOutlineBell, HiOutlineMenuAlt2, HiOutlineX } from 'react-icons/hi'

import DashboardSection from './sections/DashboardSection'
import ContentStudioSection from './sections/ContentStudioSection'
import GraphicsStudioSection from './sections/GraphicsStudioSection'
import SEOToolsSection from './sections/SEOToolsSection'
import ReviewQueueSection from './sections/ReviewQueueSection'
import BrandSettingsSection from './sections/BrandSettingsSection'
import type { ContentItem } from './sections/DashboardSection'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground text-sm">Try again</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { key: 'content', label: 'Content Studio', icon: HiOutlineDocumentText },
  { key: 'graphics', label: 'Graphics Studio', icon: HiOutlinePhotograph },
  { key: 'seo', label: 'SEO Tools', icon: HiOutlineChartBar },
  { key: 'review', label: 'Review Queue', icon: HiOutlineShieldCheck },
  { key: 'settings', label: 'Brand Settings', icon: HiOutlineCog },
]

const SAMPLE_CONTENT: ContentItem[] = [
  {
    id: 'sample-1', title: 'Summer Skills Camp Announcement', type: 'Blog Post',
    tier: 'Tier 2 - Brand Review', content: 'MMB Elite is proud to announce our annual Summer Skills Camp, designed to elevate young athletes to the next level of their basketball journey...', status: 'Approved',
    date: '2/28/2026', reviewResult: { overall_score: '9/10', verdict: 'APPROVED', brand_alignment_score: '9', tone_score: '9', faith_integration_score: '8', mission_alignment_score: '9', specific_feedback: 'Strong brand voice. Excellent alignment with program values.' },
    seoResult: { seo_score: '85' }, researchSummary: '', metaDescription: 'Join MMB Elite Summer Skills Camp for elite basketball training.', suggestedHashtags: '#MMBElite #SummerCamp #Basketball', callToAction: 'Register today at mmbelite.com', reviewNotes: ''
  },
  {
    id: 'sample-2', title: 'Player Development: The MMB Way', type: 'Social Caption',
    tier: 'Tier 3 - Auto-Approved', content: 'Development over everything. At MMB Elite, we build players who lead on and off the court. Faith, discipline, and relentless improvement.', status: 'Published',
    date: '2/27/2026', reviewResult: null, seoResult: { seo_score: '72' },
    researchSummary: '', metaDescription: '', suggestedHashtags: '#MMBElite #PlayerDevelopment #BasketballLife', callToAction: 'Follow our journey', reviewNotes: ''
  },
  {
    id: 'sample-3', title: 'Recruiting Night Recap Video Script', type: 'Video Script',
    tier: 'Tier 1 - Founder Review Required', content: 'Last night was special. Coaches from 12 Division I programs came to see our athletes compete at the highest level...', status: 'In Review',
    date: '2/26/2026', reviewResult: null, seoResult: null,
    researchSummary: '', metaDescription: '', suggestedHashtags: '', callToAction: '', reviewNotes: ''
  },
  {
    id: 'sample-4', title: 'Weekly Practice Schedule Update', type: 'Schedule Update',
    tier: 'Tier 3 - Auto-Approved', content: 'Updated practice schedule for the week of March 3rd. 14U practice moves to Wednesday 6pm. 16U adds a Saturday morning film session.', status: 'Draft',
    date: '2/25/2026', reviewResult: null, seoResult: null,
    researchSummary: '', metaDescription: '', suggestedHashtags: '', callToAction: '', reviewNotes: ''
  }
]

export default function Page() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [graphicsCount, setGraphicsCount] = useState(0)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sampleData, setSampleData] = useState(false)

  const displayItems = sampleData ? [...SAMPLE_CONTENT, ...contentItems] : contentItems

  const handleContentCreated = useCallback((item: ContentItem) => {
    setContentItems(prev => [...prev, item])
  }, [])

  const handleContentUpdated = useCallback((id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }, [])

  const handleGraphicCreated = useCallback(() => {
    setGraphicsCount(prev => prev + 1)
  }, [])

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section)
  }, [])

  const handleSetActiveAgent = useCallback((id: string | null) => {
    setActiveAgentId(id)
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <div className="flex h-screen overflow-hidden">
          <aside className={`${sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'} flex-shrink-0 border-r border-border bg-card transition-all duration-200 flex flex-col`}>
            <div className="p-6">
              <h1 className="font-serif text-lg font-bold tracking-[-0.02em]">MMB Elite</h1>
              <p className="text-xs text-muted-foreground mt-0.5 tracking-[-0.02em]">Marketing Command Center</p>
            </div>
            <Separator />
            <nav className="flex-1 p-3 space-y-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon
                const isActive = activeSection === item.key
                return (
                  <button key={item.key} onClick={() => setActiveSection(item.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${isActive ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="tracking-[-0.02em]">{item.label}</span>
                  </button>
                )
              })}
            </nav>
            <Separator />
            <div className="p-4">
              {activeAgentId ? (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Agent processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground">All agents ready</span>
                </div>
              )}
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card flex-shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(prev => !prev)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {sidebarOpen ? <HiOutlineX className="h-5 w-5" /> : <HiOutlineMenuAlt2 className="h-5 w-5" />}
                </button>
                <h2 className="font-serif text-base font-bold tracking-[-0.02em]">
                  {NAV_ITEMS.find(n => n.key === activeSection)?.label ?? 'Dashboard'}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={sampleData} onCheckedChange={setSampleData} id="sample-toggle" />
                  <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground cursor-pointer">Sample Data</Label>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors relative">
                  <HiOutlineBell className="h-5 w-5" />
                  {displayItems.filter(i => i.status === 'In Review').length > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full" />
                  )}
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              {activeSection === 'dashboard' && (
                <DashboardSection contentItems={displayItems} graphicsCount={sampleData ? 3 + graphicsCount : graphicsCount} onNavigate={handleNavigate} />
              )}
              {activeSection === 'content' && (
                <ContentStudioSection onContentCreated={handleContentCreated} onContentUpdated={handleContentUpdated} setActiveAgent={handleSetActiveAgent} />
              )}
              {activeSection === 'graphics' && (
                <GraphicsStudioSection onGraphicCreated={handleGraphicCreated} setActiveAgent={handleSetActiveAgent} />
              )}
              {activeSection === 'seo' && (
                <SEOToolsSection setActiveAgent={handleSetActiveAgent} />
              )}
              {activeSection === 'review' && (
                <ReviewQueueSection contentItems={displayItems} onContentUpdated={handleContentUpdated} setActiveAgent={handleSetActiveAgent} />
              )}
              {activeSection === 'settings' && (
                <BrandSettingsSection activeAgentId={activeAgentId} />
              )}
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
