'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { KnowledgeBaseUpload } from '@/components/KnowledgeBaseUpload'
import { HiOutlineCog, HiOutlineDocumentText, HiOutlinePhotograph, HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineSearch, HiOutlineUserGroup } from 'react-icons/hi'

const RAG_ID = '69a49414f572c99c0ffc04c0'

interface BrandSettingsSectionProps {
  activeAgentId: string | null
}

const AGENTS = [
  {
    id: '69a49469f82dad1b234415fe',
    name: 'Content Production Manager',
    role: 'Coordinates Research + Writing agents to produce brand content',
    icon: HiOutlineUserGroup,
    type: 'Manager'
  },
  {
    id: '69a494147c6b625dd5bacd01',
    name: 'Research Agent',
    role: 'Gathers contextual info for content creation',
    icon: HiOutlineSearch,
    type: 'Sub-agent'
  },
  {
    id: '69a494357447fbb48963edcc',
    name: 'Writing Agent',
    role: 'Drafts content in Coach Markcus voice',
    icon: HiOutlineDocumentText,
    type: 'Sub-agent'
  },
  {
    id: '69a4949056b99c8e0e6ce794',
    name: 'Coach Markcus Review Agent',
    role: 'Evaluates content against brand standards',
    icon: HiOutlineShieldCheck,
    type: 'Independent'
  },
  {
    id: '69a494350089711ec4bb3305',
    name: 'SEO Analysis Agent',
    role: 'Analyzes content for keyword and SEO optimization',
    icon: HiOutlineChartBar,
    type: 'Independent'
  },
  {
    id: '69a4946964135d095c56847b',
    name: 'Graphics Generation Agent',
    role: 'Creates brand-compliant visual assets',
    icon: HiOutlinePhotograph,
    type: 'Independent'
  }
]

export default function BrandSettingsSection({ activeAgentId }: BrandSettingsSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-[-0.02em]">Brand Settings</h1>
        <p className="text-muted-foreground text-sm tracking-[-0.02em] leading-[1.7]">Manage brand knowledge base and view agent configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-base font-bold">Brand Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Upload brand guidelines, tone documents, and reference materials. These files train the agents to produce content aligned with MMB Elite standards.</p>
            <KnowledgeBaseUpload ragId={RAG_ID} />
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-base font-bold">Brand Guidelines Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Brand Voice</p>
              <p className="text-sm">Professional, elevated, development-focused, faith-rooted. Speaks with the authority and warmth of Coach Markcus.</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Content Tiers</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-900/30 text-red-400 text-xs">Tier 1</Badge>
                  <span className="text-sm">Founder Review Required - Public statements, partnerships, major announcements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-900/30 text-yellow-400 text-xs">Tier 2</Badge>
                  <span className="text-sm">Brand Review - Blog posts, detailed social content, email campaigns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-900/30 text-green-400 text-xs">Tier 3</Badge>
                  <span className="text-sm">Auto-Approved - Schedule updates, routine social posts, internal comms</span>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Visual Identity</p>
              <p className="text-sm">Clean, collegiate aesthetic. Consistent use of team colors, logo placement, and program branding across all materials.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base font-bold">Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENTS.map(agent => {
              const Icon = agent.icon
              const isActive = activeAgentId === agent.id
              return (
                <div key={agent.id} className={`border p-4 transition-colors ${isActive ? 'border-green-600 bg-green-900/10' : 'border-border'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{agent.name}</p>
                      <Badge variant="outline" className="text-[10px] mt-0.5">{agent.type}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-[1.7]">{agent.role}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-muted-foreground/30'}`} />
                    <span className="text-xs text-muted-foreground">{isActive ? 'Active' : 'Ready'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
