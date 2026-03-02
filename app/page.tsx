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

const MMB_LOGO_URL = 'https://asset.lyzr.app/1eGBVs20'

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
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-[#0020FF] text-white text-sm rounded-md hover:bg-[#0018CC]">Try again</button>
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
      <div className="min-h-screen bg-white text-foreground font-sans">
        <div className="flex h-screen overflow-hidden">
          {/* Blue Brand Sidebar */}
          <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-[#0020FF] transition-all duration-200 flex flex-col`}>
            {/* Logo Section */}
            <div className="p-5 flex items-center gap-3">
              <img src={MMB_LOGO_URL} alt="MMB Elite" className="h-10 w-10 rounded-md object-contain bg-white/10 p-0.5" />
              <div>
                <h1 className="text-white text-base font-bold tracking-tight leading-none">MMB Elite</h1>
                <p className="text-white/60 text-[10px] font-medium tracking-wide uppercase mt-0.5">Marketing Command Center</p>
              </div>
            </div>
            <div className="mx-4 border-t border-white/15" />
            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-0.5 mt-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon
                const isActive = activeSection === item.key
                return (
                  <button key={item.key} onClick={() => setActiveSection(item.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors ${isActive ? 'bg-white/20 text-white font-medium' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
            <div className="mx-4 border-t border-white/15" />
            {/* Agent Status */}
            <div className="p-4">
              {activeAgentId ? (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#FF6FF0] animate-pulse" />
                  <span className="text-xs text-white/70">Agent processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-white/30" />
                  <span className="text-xs text-white/70">All agents ready</span>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(prev => !prev)} className="text-gray-400 hover:text-[#0020FF] transition-colors">
                  {sidebarOpen ? <HiOutlineX className="h-5 w-5" /> : <HiOutlineMenuAlt2 className="h-5 w-5" />}
                </button>
                {!sidebarOpen && (
                  <img src={MMB_LOGO_URL} alt="MMB Elite" className="h-7 w-7 rounded object-contain" />
                )}
                <h2 className="text-base font-bold text-gray-900">
                  {NAV_ITEMS.find(n => n.key === activeSection)?.label ?? 'Dashboard'}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={sampleData} onCheckedChange={setSampleData} id="sample-toggle" />
                  <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground cursor-pointer">Sample Data</Label>
                </div>
                <button className="text-gray-400 hover:text-[#0020FF] transition-colors relative">
                  <HiOutlineBell className="h-5 w-5" />
                  {displayItems.filter(i => i.status === 'In Review').length > 0 && (
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-[#FF6FF0] rounded-full flex items-center justify-center">
                      <span className="text-[9px] text-white font-bold">{displayItems.filter(i => i.status === 'In Review').length}</span>
                    </span>
                  )}
                </button>
              </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50/50">
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
