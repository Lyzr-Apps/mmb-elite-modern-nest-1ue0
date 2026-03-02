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
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-3 mb-1 text-gray-900">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-3 mb-1 text-gray-900">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-4 mb-2 text-gray-900">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm text-gray-700">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-sm text-gray-700">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm text-gray-700">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900">{part}</strong> : part)
}

export default function ReviewQueueSection({ contentItems, onContentUpdated, setActiveAgent }: ReviewQueueSectionProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [reviewLoading, setReviewLoading] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const reviewableItems = contentItems.filter(i => i.status === 'Draft' || i.status === 'In Review')
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
    if (tier?.includes('1')) return 'bg-red-50 text-red-600 border border-red-200'
    if (tier?.includes('2')) return 'bg-amber-50 text-amber-700 border border-amber-200'
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  }

  const verdictColor = (verdict: string) => {
    const v = (verdict ?? '').toUpperCase()
    if (v.includes('APPROVED')) return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    if (v.includes('REVISION')) return 'bg-amber-50 text-amber-700 border border-amber-200'
    return 'bg-red-50 text-red-600 border border-red-200'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Queue</h1>
        <p className="text-gray-500 text-sm mt-1">Review and approve content with Coach Markcus AI</p>
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-900">Pending Review ({reviewableItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {reviewableItems.length === 0 ? (
                  <div className="flex items-center justify-center py-10">
                    <p className="text-sm text-gray-400">No content items pending review. Generate content in Content Studio first.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reviewableItems.map(item => (
                      <div key={item.id} className={`border p-4 cursor-pointer transition-colors rounded-md ${selectedItemId === item.id ? 'bg-[#0020FF]/5 border-[#0020FF]/30' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => setSelectedItemId(item.id)}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{item.title || 'Untitled'}</p>
                          <Badge className={`text-[10px] ${tierColor(item.tier)}`}>{item.tier || 'Tier 3'}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">{item.type}</Badge>
                            <span className="text-xs text-gray-400">{item.date}</span>
                          </div>
                          <Button variant="outline" size="sm" className="border-gray-200 text-xs h-7 hover:bg-[#0020FF]/5 hover:text-[#0020FF] hover:border-[#0020FF]/30" onClick={(e) => { e.stopPropagation(); handleRunReview(item) }} disabled={reviewLoading === item.id}>
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

        {/* Review Details */}
        <div className="lg:col-span-3">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-900">Review Details</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedItem ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <HiOutlineShieldCheck className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-400">Select an item from the queue to view or run a review.</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6 pr-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedItem.title || 'Untitled'}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="border-gray-200 text-gray-600">{selectedItem.type}</Badge>
                        <Badge className={tierColor(selectedItem.tier)}>{selectedItem.tier || 'Tier 3'}</Badge>
                        <span className="text-xs text-gray-400">{selectedItem.date}</span>
                      </div>
                    </div>

                    {selectedItem.reviewResult ? (
                      <>
                        <Separator className="bg-gray-100" />
                        <div className="flex items-center gap-4 flex-wrap">
                          <Badge className={`text-sm px-3 py-1 ${verdictColor(selectedItem.reviewResult?.verdict ?? '')}`}>
                            {selectedItem.reviewResult?.verdict ?? 'Pending'}
                          </Badge>
                          <div className="text-center">
                            <p className="text-xs text-gray-400">Overall</p>
                            <p className="text-2xl font-bold text-gray-900">{selectedItem.reviewResult?.overall_score ?? '--'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Brand Alignment', value: selectedItem.reviewResult?.brand_alignment_score },
                            { label: 'Tone', value: selectedItem.reviewResult?.tone_score },
                            { label: 'Faith Integration', value: selectedItem.reviewResult?.faith_integration_score },
                            { label: 'Mission Alignment', value: selectedItem.reviewResult?.mission_alignment_score },
                          ].map(s => (
                            <div key={s.label} className="bg-gray-50 border border-gray-100 p-3 rounded-md">
                              <p className="text-xs text-gray-500">{s.label}</p>
                              <p className="text-lg font-bold text-gray-900">{s.value ?? '--'}</p>
                            </div>
                          ))}
                        </div>

                        {selectedItem.reviewResult?.specific_feedback && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Specific Feedback</p>
                            {renderMarkdown(selectedItem.reviewResult.specific_feedback)}
                          </div>
                        )}

                        {selectedItem.reviewResult?.required_changes && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Required Changes</p>
                            {renderMarkdown(selectedItem.reviewResult.required_changes)}
                          </div>
                        )}

                        {selectedItem.reviewResult?.tier_assessment && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Tier Assessment</p>
                            <p className="text-sm text-gray-700">{selectedItem.reviewResult.tier_assessment}</p>
                          </div>
                        )}

                        {selectedItem.reviewResult?.escalation_reason && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Escalation Reason</p>
                            <p className="text-sm text-red-600">{selectedItem.reviewResult.escalation_reason}</p>
                          </div>
                        )}

                        <Separator className="bg-gray-100" />

                        <div className="flex gap-3">
                          <Button onClick={() => handleApprove(selectedItem.id)} className="bg-emerald-600 text-white hover:bg-emerald-700">
                            <HiOutlineCheckCircle className="mr-2 h-4 w-4" /> Approve
                          </Button>
                          <Button onClick={() => handleReject(selectedItem.id)} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                            <HiOutlineXCircle className="mr-2 h-4 w-4" /> Send Back
                          </Button>
                          <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                            <HiOutlineExclamation className="mr-2 h-4 w-4" /> Escalate
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Separator className="bg-gray-100" />
                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-md">
                          <p className="text-sm text-gray-500">No review has been run for this item yet.</p>
                          <Button variant="outline" size="sm" className="mt-3 border-gray-200 hover:bg-[#0020FF]/5 hover:text-[#0020FF]" onClick={() => handleRunReview(selectedItem)} disabled={reviewLoading === selectedItem.id}>
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
