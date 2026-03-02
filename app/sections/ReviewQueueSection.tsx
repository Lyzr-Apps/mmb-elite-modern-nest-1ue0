'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { callAIAgent } from '@/lib/aiAgent'
import { HiOutlineShieldCheck, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineExclamation } from 'react-icons/hi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import type { ContentItem } from './DashboardSection'

const REVIEW_AGENT_ID = '69a4949056b99c8e0e6ce794'

interface ReviewQueueSectionProps {
  contentItems: ContentItem[]
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

export default function ReviewQueueSection({ contentItems, onContentUpdated, setActiveAgent }: ReviewQueueSectionProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [reviewLoading, setReviewLoading] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const reviewableItems = contentItems.filter(i => i.status === 'Draft' || i.status === 'In Review')
  const reviewedItems = contentItems.filter(i => i.reviewResult)
  const selectedItem = contentItems.find(i => i.id === selectedItemId)

  const handleRunReview = async (item: ContentItem) => {
    setErrorMsg('')
    setReviewLoading(item.id)
    setSelectedItemId(item.id)
    setActiveAgent(REVIEW_AGENT_ID)

    const message = `Please review the following content for brand alignment:\n\nTitle: ${item.title ?? 'Untitled'}\nContent Type: ${item.type ?? 'Unknown'}\nTier: ${item.tier ?? 'Tier 3'}\n\nContent:\n${item.content ?? ''}`

    try {
      const result = await callAIAgent(message, REVIEW_AGENT_ID)
      if (result.success) {
        let data = result?.response?.result
        if (typeof data === 'string') {
          try { data = JSON.parse(data) } catch { /* use as-is */ }
        }
        onContentUpdated(item.id, { status: 'In Review', reviewResult: data })
      } else {
        setErrorMsg(result?.error ?? 'Review failed.')
      }
    } catch {
      setErrorMsg('An error occurred during review.')
    }
    setReviewLoading(null)
    setActiveAgent(null)
  }

  const handleApprove = (id: string) => {
    onContentUpdated(id, { status: 'Approved' })
  }

  const handleReject = (id: string) => {
    onContentUpdated(id, { status: 'Draft' })
  }

  const tierColor = (tier: string) => {
    if (tier?.includes('1')) return 'bg-red-900/30 text-red-400'
    if (tier?.includes('2')) return 'bg-yellow-900/30 text-yellow-400'
    return 'bg-green-900/30 text-green-400'
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
        <h1 className="font-serif text-2xl font-bold tracking-[-0.02em]">Review Queue</h1>
        <p className="text-muted-foreground text-sm tracking-[-0.02em] leading-[1.7]">Review and approve content with Coach Markcus AI</p>
      </div>

      {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-base font-bold">Pending Review ({reviewableItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {reviewableItems.length === 0 ? (
                  <div className="flex items-center justify-center py-10">
                    <p className="text-sm text-muted-foreground">No content items pending review. Generate content in Content Studio first.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reviewableItems.map(item => (
                      <div key={item.id} className={`border border-border p-4 cursor-pointer transition-colors ${selectedItemId === item.id ? 'bg-secondary/50 border-foreground/30' : 'hover:bg-secondary/30'}`} onClick={() => setSelectedItemId(item.id)}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium truncate max-w-[200px]">{item.title || 'Untitled'}</p>
                          <Badge className={`text-[10px] ${tierColor(item.tier)}`}>{item.tier || 'Tier 3'}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{item.type}</Badge>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                          <Button variant="outline" size="sm" className="border-border text-xs h-7" onClick={(e) => { e.stopPropagation(); handleRunReview(item) }} disabled={reviewLoading === item.id}>
                            {reviewLoading === item.id ? <AiOutlineLoading3Quarters className="h-3 w-3 animate-spin" /> : <HiOutlineShieldCheck className="h-3 w-3" />}
                            <span className="ml-1">Review</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="border border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-base font-bold">Review Details</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedItem ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <HiOutlineShieldCheck className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Select an item from the queue to view or run a review.</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6 pr-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold">{selectedItem.title || 'Untitled'}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{selectedItem.type}</Badge>
                        <Badge className={tierColor(selectedItem.tier)}>{selectedItem.tier || 'Tier 3'}</Badge>
                        <span className="text-xs text-muted-foreground">{selectedItem.date}</span>
                      </div>
                    </div>

                    {selectedItem.reviewResult ? (
                      <>
                        <Separator />
                        <div className="flex items-center gap-4 flex-wrap">
                          <Badge className={`text-sm px-3 py-1 ${verdictColor(selectedItem.reviewResult?.verdict ?? '')}`}>
                            {selectedItem.reviewResult?.verdict ?? 'Pending'}
                          </Badge>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Overall</p>
                            <p className="text-2xl font-serif font-bold">{selectedItem.reviewResult?.overall_score ?? '--'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Brand Alignment', value: selectedItem.reviewResult?.brand_alignment_score },
                            { label: 'Tone', value: selectedItem.reviewResult?.tone_score },
                            { label: 'Faith Integration', value: selectedItem.reviewResult?.faith_integration_score },
                            { label: 'Mission Alignment', value: selectedItem.reviewResult?.mission_alignment_score },
                          ].map(s => (
                            <div key={s.label} className="bg-secondary/50 border border-border p-3">
                              <p className="text-xs text-muted-foreground">{s.label}</p>
                              <p className="text-lg font-serif font-bold">{s.value ?? '--'}</p>
                            </div>
                          ))}
                        </div>

                        {selectedItem.reviewResult?.specific_feedback && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Specific Feedback</p>
                            {renderMarkdown(selectedItem.reviewResult.specific_feedback)}
                          </div>
                        )}

                        {selectedItem.reviewResult?.required_changes && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Required Changes</p>
                            {renderMarkdown(selectedItem.reviewResult.required_changes)}
                          </div>
                        )}

                        {selectedItem.reviewResult?.tier_assessment && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Tier Assessment</p>
                            <p className="text-sm">{selectedItem.reviewResult.tier_assessment}</p>
                          </div>
                        )}

                        {selectedItem.reviewResult?.escalation_reason && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Escalation Reason</p>
                            <p className="text-sm text-destructive">{selectedItem.reviewResult.escalation_reason}</p>
                          </div>
                        )}

                        <Separator />

                        <div className="flex gap-3">
                          <Button onClick={() => handleApprove(selectedItem.id)} className="bg-green-900/30 text-green-400 hover:bg-green-900/50 border border-green-800/50">
                            <HiOutlineCheckCircle className="mr-2 h-4 w-4" /> Approve
                          </Button>
                          <Button onClick={() => handleReject(selectedItem.id)} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                            <HiOutlineXCircle className="mr-2 h-4 w-4" /> Send Back
                          </Button>
                          <Button variant="outline" className="border-yellow-700 text-yellow-400 hover:bg-yellow-900/20">
                            <HiOutlineExclamation className="mr-2 h-4 w-4" /> Escalate
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Separator />
                        <div className="bg-secondary/50 border border-border p-4">
                          <p className="text-sm text-muted-foreground">No review has been run for this item yet.</p>
                          <Button variant="outline" size="sm" className="mt-3 border-border" onClick={() => handleRunReview(selectedItem)} disabled={reviewLoading === selectedItem.id}>
                            {reviewLoading === selectedItem.id ? <><AiOutlineLoading3Quarters className="mr-2 h-3 w-3 animate-spin" /> Reviewing...</> : <><HiOutlineShieldCheck className="mr-2 h-3 w-3" /> Run Brand Review</>}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
