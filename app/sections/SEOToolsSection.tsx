'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { callAIAgent } from '@/lib/aiAgent'
import { HiOutlineChartBar, HiOutlineSearch } from 'react-icons/hi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const SEO_AGENT_ID = '69a494350089711ec4bb3305'

interface SEOToolsSectionProps {
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

export default function SEOToolsSection({ setActiveAgent }: SEOToolsSectionProps) {
  const [contentInput, setContentInput] = useState('')
  const [keywordInput, setKeywordInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [seoResult, setSeoResult] = useState<Record<string, any> | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleAnalyze = async () => {
    if (!contentInput.trim()) {
      setErrorMsg('Please paste content to analyze.')
      return
    }
    setErrorMsg('')
    setLoading(true)
    setSeoResult(null)
    setActiveAgent(SEO_AGENT_ID)

    const message = `Please analyze the following content for SEO optimization.\n\nTarget Keywords: ${keywordInput || 'Not specified'}\n\nContent:\n${contentInput}`

    try {
      const result = await callAIAgent(message, SEO_AGENT_ID)
      if (result.success) {
        let data = result?.response?.result
        if (typeof data === 'string') {
          try { data = JSON.parse(data) } catch { /* use as-is */ }
        }
        setSeoResult(data ?? {})
      } else {
        setErrorMsg(result?.error ?? 'SEO analysis failed.')
      }
    } catch {
      setErrorMsg('An error occurred during SEO analysis.')
    }
    setLoading(false)
    setActiveAgent(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SEO Tools</h1>
        <p className="text-gray-500 text-sm mt-1">Analyze and optimize content for search engines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-gray-900">Content Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 block">Content to Analyze *</Label>
              <Textarea placeholder="Paste your content here for SEO analysis..." value={contentInput} onChange={(e) => setContentInput(e.target.value)} rows={12} className="border-gray-200 font-mono text-sm" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 block">Target Keywords</Label>
              <Input placeholder="e.g., youth basketball, recruiting, player development" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} className="border-gray-200" />
            </div>
            <Button onClick={handleAnalyze} disabled={loading || !contentInput.trim()} className="w-full bg-[#0020FF] text-white hover:bg-[#0018CC]">
              {loading ? <><AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><HiOutlineSearch className="mr-2 h-4 w-4" /> Run SEO Analysis</>}
            </Button>
            {errorMsg && <p className="text-sm text-red-600 mt-2">{errorMsg}</p>}
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-gray-900">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin text-[#0020FF]" />
                <span className="ml-3 text-sm text-gray-500">Running SEO analysis...</span>
              </div>
            ) : seoResult ? (
              <ScrollArea className="h-[500px]">
                <div className="space-y-6 pr-4">
                  <div className="flex items-center gap-6">
                    <div className="text-center p-4 bg-[#0020FF]/5 border border-[#0020FF]/10 rounded-lg">
                      <p className="text-xs uppercase tracking-wider text-[#0020FF] mb-1 font-medium">SEO Score</p>
                      <p className="text-4xl font-bold text-[#0020FF]">{seoResult?.seo_score ?? '--'}</p>
                    </div>
                    <div className="text-center p-4 bg-[#FF6FF0]/5 border border-[#FF6FF0]/10 rounded-lg">
                      <p className="text-xs uppercase tracking-wider text-[#FF6FF0] mb-1 font-medium">Readability</p>
                      <p className="text-4xl font-bold text-[#FF6FF0]">{seoResult?.readability_score ?? '--'}</p>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  {seoResult?.primary_keywords && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Primary Keywords</p>
                      {renderMarkdown(seoResult.primary_keywords)}
                    </div>
                  )}

                  {seoResult?.secondary_keywords && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Secondary Keywords</p>
                      {renderMarkdown(seoResult.secondary_keywords)}
                    </div>
                  )}

                  <Separator className="bg-gray-100" />

                  {seoResult?.title_tag_suggestion && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Title Tag Suggestion</p>
                      <div className="bg-[#0020FF]/5 border border-[#0020FF]/10 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-900">{seoResult.title_tag_suggestion}</p>
                      </div>
                    </div>
                  )}

                  {seoResult?.meta_description_suggestion && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Meta Description Suggestion</p>
                      <div className="bg-gray-50 border border-gray-100 p-3 rounded-md">
                        <p className="text-sm text-gray-700">{seoResult.meta_description_suggestion}</p>
                      </div>
                    </div>
                  )}

                  {seoResult?.keyword_recommendations && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Keyword Recommendations</p>
                      {renderMarkdown(seoResult.keyword_recommendations)}
                    </div>
                  )}

                  {seoResult?.content_structure_feedback && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Content Structure Feedback</p>
                      {renderMarkdown(seoResult.content_structure_feedback)}
                    </div>
                  )}

                  {seoResult?.optimization_suggestions && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Optimization Suggestions</p>
                      {renderMarkdown(seoResult.optimization_suggestions)}
                    </div>
                  )}

                  {seoResult?.priority_actions && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Priority Actions</p>
                      {renderMarkdown(seoResult.priority_actions)}
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <HiOutlineChartBar className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-400">Paste content and run analysis to see SEO results.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
