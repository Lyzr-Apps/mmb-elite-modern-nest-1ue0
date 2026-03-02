'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { KnowledgeBaseUpload } from '@/components/KnowledgeBaseUpload'
import { HiOutlineCog, HiOutlineDocumentText, HiOutlinePhotograph, HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineSearch, HiOutlineUserGroup } from 'react-icons/hi'

const RAG_ID = '69a49414f572c99c0ffc04c0'
const MMB_LOGO_URL = 'https://asset.lyzr.app/1eGBVs20'

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
        <h1 className="text-2xl font-bold text-gray-900">Brand Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage brand knowledge base and view agent configuration</p>
      </div>

      {/* Brand Identity Card */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <img src={MMB_LOGO_URL} alt="MMB Elite" className="h-16 w-16 rounded-lg object-contain border border-gray-200 p-1" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">MMB Elite</h2>
              <p className="text-sm text-gray-500 mt-1">Faith-Driven Youth Basketball Development Organization</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded bg-[#0020FF]" />
                  <span className="text-xs text-gray-500">Primary Blue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded bg-[#FF6FF0]" />
                  <span className="text-xs text-gray-500">Accent Pink</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded bg-white border border-gray-200" />
                  <span className="text-xs text-gray-500">White</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Base */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-gray-900">Brand Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">Upload brand guidelines, tone documents, and reference materials. These files train the agents to produce content aligned with MMB Elite standards.</p>
            <KnowledgeBaseUpload ragId={RAG_ID} />
          </CardContent>
        </Card>

        {/* Brand Guidelines */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-gray-900">Brand Guidelines Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Brand Voice</p>
              <p className="text-sm text-gray-700">Professional, elevated, development-focused, faith-rooted. Speaks with the authority and warmth of Coach Markcus.</p>
            </div>
            <Separator className="bg-gray-100" />
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Content Tiers</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-50 text-red-600 border border-red-200 text-xs">Tier 1</Badge>
                  <span className="text-sm text-gray-700">Founder Review Required - Public statements, partnerships, major announcements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs">Tier 2</Badge>
                  <span className="text-sm text-gray-700">Brand Review - Blog posts, detailed social content, email campaigns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">Tier 3</Badge>
                  <span className="text-sm text-gray-700">Auto-Approved - Schedule updates, routine social posts, internal comms</span>
                </div>
              </div>
            </div>
            <Separator className="bg-gray-100" />
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Visual Identity</p>
              <p className="text-sm text-gray-700">Clean, collegiate aesthetic. Consistent use of team colors, logo placement, and program branding across all materials.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Configuration */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-gray-900">Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENTS.map(agent => {
              const Icon = agent.icon
              const isActive = activeAgentId === agent.id
              return (
                <div key={agent.id} className={`border p-4 rounded-md transition-colors ${isActive ? 'border-[#0020FF] bg-[#0020FF]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${isActive ? 'bg-[#0020FF]/10' : 'bg-gray-100'}`}>
                      <Icon className={`h-5 w-5 ${isActive ? 'text-[#0020FF]' : 'text-gray-500'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{agent.name}</p>
                      <Badge variant="outline" className="text-[10px] mt-0.5 border-gray-200 text-gray-500">{agent.type}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{agent.role}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-[#0020FF] animate-pulse' : 'bg-emerald-400'}`} />
                    <span className="text-xs text-gray-500">{isActive ? 'Processing' : 'Ready'}</span>
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
