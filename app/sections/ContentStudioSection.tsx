'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { callAIAgent } from '@/lib/aiAgent'
import { HiOutlineClipboardCopy, HiOutlineShieldCheck, HiOutlineChartBar } from 'react-icons/hi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import type { ContentItem } from './DashboardSection'

const CONTENT_MANAGER_ID = '69a49469f82dad1b234415fe'
const REVIEW_AGENT_ID = '69a4949056b99c8e0e6ce794'

interface ContentStudioSectionProps {
  onContentCreated: (item: ContentItem) => void
  onContentUpdated: (id: string, updates: Partial<ContentItem>) => void
  setActiveAgent: (id: string | null) => void
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-sm">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part)
}

export default function ContentStudioSection({ onContentCreated, onContentUpdated, setActiveAgent }: ContentStudioSectionProps) {
  const [formData, setFormData] = useState({
    contentType: '',
    topic: '',
    audience: '',
    keyPoints: '',
    tier: '',
    contextNotes: ''
  })
  const [loading, setLoading] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<Record<string, any> | null>(null)
  const [currentItemId, setCurrentItemId] = useState<string | null>(null)
  const [reviewResult, setReviewResult] = useState<Record<string, any> | null>(null)
  const [statusMsg, setStatusMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleGenerate = async () => {
    if (!formData.contentType || !formData.topic) {
      setErrorMsg('Please select a content type and enter a topic.')
      return
    }
    setErrorMsg('')
    setStatusMsg('')
    setLoading(true)
    setGeneratedContent(null)
    setReviewResult(null)
    setActiveAgent(CONTENT_MANAGER_ID)

    const message = `Content Type: ${formData.contentType}\nTopic: ${formData.topic}\nTarget Audience: ${formData.audience || 'General'}\nKey Points: ${formData.keyPoints || 'None specified'}\nContent Tier: ${formData.tier || 'Tier 3 - Auto-Approved'}\nAdditional Context: ${formData.contextNotes || 'None'}`

    try {
      const result = await callAIAgent(message, CONTENT_MANAGER_ID)
      if (result.success) {
        let data = result?.response?.result
        if (typeof data === 'string') {
          try { data = JSON.parse(data) } catch { /* use as-is */ }
        }
        setGeneratedContent(data ?? {})
        const itemId = `content-${Date.now()}`
        setCurrentItemId(itemId)
        const newItem: ContentItem = {
          id: itemId,
          title: data?.title ?? formData.topic,
          type: data?.content_type ?? formData.contentType,
          tier: data?.tier ?? formData.tier,
          content: data?.content ?? '',
          status: 'Draft',
          date: new Date().toLocaleDateString(),
          researchSummary: data?.research_summary,
          metaDescription: data?.meta_description,
          suggestedHashtags: data?.suggested_hashtags,
          callToAction: data?.call_to_action,
          reviewNotes: data?.review_notes
        }
        onContentCreated(newItem)
        setStatusMsg('Content generated successfully.')
      } else {
        setErrorMsg(result?.error ?? 'Failed to generate content.')
      }
    } catch {
      setErrorMsg('An error occurred while generating content.')
    }
    setLoading(false)
    setActiveAgent(null)
  }

  const handleBrandReview = async () => {
    if (!generatedContent?.content) {
      setErrorMsg('No content to review.')
      return
    }
    setErrorMsg('')
    setReviewLoading(true)
    setReviewResult(null)
    setActiveAgent(REVIEW_AGENT_ID)

    const message = `Please review the following content for brand alignment:\n\nTitle: ${generatedContent?.title ?? 'Untitled'}\nContent Type: ${generatedContent?.content_type ?? 'Unknown'}\nTier: ${generatedContent?.tier ?? 'Tier 3'}\n\nContent:\n${generatedContent?.content ?? ''}`

    try {
      const result = await callAIAgent(message, REVIEW_AGENT_ID)
      if (result.success) {
        let data = result?.response?.result
        if (typeof data === 'string') {
          try { data = JSON.parse(data) } catch { /* use as-is */ }
        }
        setReviewResult(data ?? {})
        if (currentItemId) {
          onContentUpdated(currentItemId, { status: 'In Review', reviewResult: data })
        }
        setStatusMsg('Brand review complete.')
      } else {
        setErrorMsg(result?.error ?? 'Brand review failed.')
      }
    } catch {
      setErrorMsg('An error occurred during brand review.')
    }
    setReviewLoading(false)
    setActiveAgent(null)
  }

  const handleCopy = () => {
    const text = generatedContent?.content ?? ''
    if (text) {
      navigator.clipboard.writeText(text)
      setStatusMsg('Content copied to clipboard.')
    }
  }

  const verdictColor = (verdict: string) => {
    const v = (verdict ?? '').toUpperCase()
    if (v.includes('APPROVED')) return 'bg-green-900/30 text-green-400'
    if (v.includes('REVISION')) return 'bg-yellow-900/30 text-yellow-400'
    return 'bg-red-900/30 text-red-400'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-[-0.02em]">Content Studio</h1>
        <p className="text-muted-foreground text-sm tracking-[-0.02em] leading-[1.7]">Create, review, and refine brand content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-base font-bold">Content Brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Content Type *</Label>
              <Select value={formData.contentType} onValueChange={(v) => setFormData(prev => ({ ...prev, contentType: v }))}>
                <SelectTrigger className="border-border"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blog Post">Blog Post</SelectItem>
                  <SelectItem value="Social Caption">Social Caption</SelectItem>
                  <SelectItem value="Video Script">Video Script</SelectItem>
                  <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                  <SelectItem value="Schedule Update">Schedule Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Topic *</Label>
              <Input placeholder="Enter content topic" value={formData.topic} onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))} className="border-border" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Target Audience</Label>
              <Select value={formData.audience} onValueChange={(v) => setFormData(prev => ({ ...prev, audience: v }))}>
                <SelectTrigger className="border-border"><SelectValue placeholder="Select audience" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parents">Parents</SelectItem>
                  <SelectItem value="Players">Players</SelectItem>
                  <SelectItem value="Recruits">Recruits</SelectItem>
                  <SelectItem value="Coaches">Coaches</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Key Points</Label>
              <Textarea placeholder="List the main points to cover" value={formData.keyPoints} onChange={(e) => setFormData(prev => ({ ...prev, keyPoints: e.target.value }))} rows={3} className="border-border" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Content Tier</Label>
              <Select value={formData.tier} onValueChange={(v) => setFormData(prev => ({ ...prev, tier: v }))}>
                <SelectTrigger className="border-border"><SelectValue placeholder="Select tier" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tier 1 - Founder Review Required">Tier 1 - Founder Review</SelectItem>
                  <SelectItem value="Tier 2 - Brand Review">Tier 2 - Brand Review</SelectItem>
                  <SelectItem value="Tier 3 - Auto-Approved">Tier 3 - Auto-Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Context Notes</Label>
              <Textarea placeholder="Optional context or instructions" value={formData.contextNotes} onChange={(e) => setFormData(prev => ({ ...prev, contextNotes: e.target.value }))} rows={2} className="border-border" />
            </div>
            <Button onClick={handleGenerate} disabled={loading || !formData.contentType || !formData.topic} className="w-full bg-foreground text-background hover:bg-foreground/90">
              {loading ? <><AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Content'}
            </Button>
            {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
            {statusMsg && <p className="text-sm text-green-400">{statusMsg}</p>}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-base font-bold">Generated Output</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-sm text-muted-foreground">Creating content with Research + Writing agents...</span>
                </div>
              ) : generatedContent ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {generatedContent?.content_type && <Badge variant="outline">{generatedContent.content_type}</Badge>}
                      {generatedContent?.tier && <Badge variant="outline">{generatedContent.tier}</Badge>}
                    </div>
                    <h2 className="font-serif text-xl font-bold tracking-[-0.02em]">{generatedContent?.title ?? 'Untitled'}</h2>
                    {generatedContent?.research_summary && (
                      <div className="bg-secondary/50 border border-border p-4">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Research Summary</p>
                        {renderMarkdown(generatedContent.research_summary)}
                      </div>
                    )}
                    <Separator />
                    <div>{renderMarkdown(generatedContent?.content ?? '')}</div>
                    <Separator />
                    {generatedContent?.meta_description && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Meta Description</p>
                        <p className="text-sm">{generatedContent.meta_description}</p>
                      </div>
                    )}
                    {generatedContent?.suggested_hashtags && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Hashtags</p>
                        <p className="text-sm font-mono">{generatedContent.suggested_hashtags}</p>
                      </div>
                    )}
                    {generatedContent?.call_to_action && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Call to Action</p>
                        <p className="text-sm">{generatedContent.call_to_action}</p>
                      </div>
                    )}
                    {generatedContent?.review_notes && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Review Notes</p>
                        {renderMarkdown(generatedContent.review_notes)}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center py-16">
                  <p className="text-sm text-muted-foreground">Fill in the brief and generate content to see output here.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {generatedContent && (
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" onClick={handleBrandReview} disabled={reviewLoading} className="border-border">
                {reviewLoading ? <><AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" /> Reviewing...</> : <><HiOutlineShieldCheck className="mr-2 h-4 w-4" /> Run Brand Review</>}
              </Button>
              <Button variant="outline" onClick={handleCopy} className="border-border">
                <HiOutlineClipboardCopy className="mr-2 h-4 w-4" /> Copy Content
              </Button>
            </div>
          )}

          {reviewResult && (
            <Card className="border border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-base font-bold">Brand Review Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={verdictColor(reviewResult?.verdict ?? '')}>{reviewResult?.verdict ?? 'Unknown'}</Badge>
                  <span className="text-2xl font-serif font-bold">{reviewResult?.overall_score ?? '--'}</span>
                  <span className="text-xs text-muted-foreground">Overall Score</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Brand Alignment', value: reviewResult?.brand_alignment_score },
                    { label: 'Tone', value: reviewResult?.tone_score },
                    { label: 'Faith Integration', value: reviewResult?.faith_integration_score },
                    { label: 'Mission Alignment', value: reviewResult?.mission_alignment_score },
                  ].map(s => (
                    <div key={s.label} className="bg-secondary/50 border border-border p-3">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-lg font-serif font-bold">{s.value ?? '--'}</p>
                    </div>
                  ))}
                </div>
                {reviewResult?.specific_feedback && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Specific Feedback</p>
                    {renderMarkdown(reviewResult.specific_feedback)}
                  </div>
                )}
                {reviewResult?.required_changes && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Required Changes</p>
                    {renderMarkdown(reviewResult.required_changes)}
                  </div>
                )}
                {reviewResult?.tier_assessment && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Tier Assessment</p>
                    <p className="text-sm">{reviewResult.tier_assessment}</p>
                  </div>
                )}
                {reviewResult?.escalation_reason && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Escalation Reason</p>
                    <p className="text-sm text-destructive">{reviewResult.escalation_reason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
