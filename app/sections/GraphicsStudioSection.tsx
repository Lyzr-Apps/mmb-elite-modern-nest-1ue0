'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { callAIAgent } from '@/lib/aiAgent'
import { HiOutlineDownload, HiOutlinePhotograph } from 'react-icons/hi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const GRAPHICS_AGENT_ID = '69a4946964135d095c56847b'

interface GraphicItem {
  id: string
  imageUrl: string
  graphicType: string
  description: string
  dimensions: string
  brandElements: string
  colorPalette: string
  typographyNotes: string
  usageRecommendations: string
  date: string
}

interface GraphicsStudioSectionProps {
  onGraphicCreated: () => void
  setActiveAgent: (id: string | null) => void
}

export default function GraphicsStudioSection({ onGraphicCreated, setActiveAgent }: GraphicsStudioSectionProps) {
  const [formData, setFormData] = useState({
    graphicType: '',
    description: '',
    dimensions: '',
    brandElements: [] as string[]
  })
  const [loading, setLoading] = useState(false)
  const [gallery, setGallery] = useState<GraphicItem[]>([])
  const [currentGraphic, setCurrentGraphic] = useState<GraphicItem | null>(null)
  const [statusMsg, setStatusMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const toggleBrandElement = (el: string) => {
    setFormData(prev => ({
      ...prev,
      brandElements: prev.brandElements.includes(el)
        ? prev.brandElements.filter(e => e !== el)
        : [...prev.brandElements, el]
    }))
  }

  const handleGenerate = async () => {
    if (!formData.graphicType || !formData.description) {
      setErrorMsg('Please select a graphic type and enter a description.')
      return
    }
    setErrorMsg('')
    setStatusMsg('')
    setLoading(true)
    setCurrentGraphic(null)
    setActiveAgent(GRAPHICS_AGENT_ID)

    const message = `Graphic Type: ${formData.graphicType}\nDescription: ${formData.description}\nDimensions: ${formData.dimensions || '1080x1080'}\nBrand Elements: ${formData.brandElements.length > 0 ? formData.brandElements.join(', ') : 'All'}`

    try {
      const result = await callAIAgent(message, GRAPHICS_AGENT_ID)
      if (result.success) {
        let data = result?.response?.result
        if (typeof data === 'string') {
          try { data = JSON.parse(data) } catch { /* use as-is */ }
        }
        const files = Array.isArray(result?.module_outputs?.artifact_files) ? result.module_outputs.artifact_files : []
        const imageUrl = files?.[0]?.file_url ?? ''

        const graphicItem: GraphicItem = {
          id: `graphic-${Date.now()}`,
          imageUrl,
          graphicType: data?.graphic_type ?? formData.graphicType,
          description: data?.description ?? formData.description,
          dimensions: data?.dimensions ?? formData.dimensions,
          brandElements: data?.brand_elements_used ?? '',
          colorPalette: data?.color_palette ?? '',
          typographyNotes: data?.typography_notes ?? '',
          usageRecommendations: data?.usage_recommendations ?? '',
          date: new Date().toLocaleDateString()
        }
        setCurrentGraphic(graphicItem)
        setGallery(prev => [graphicItem, ...prev])
        onGraphicCreated()
        setStatusMsg('Graphic generated successfully.')
      } else {
        setErrorMsg(result?.error ?? 'Failed to generate graphic.')
      }
    } catch {
      setErrorMsg('An error occurred while generating the graphic.')
    }
    setLoading(false)
    setActiveAgent(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Graphics Studio</h1>
        <p className="text-gray-500 text-sm mt-1">Generate brand-compliant visual assets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphic Brief */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-gray-900">Graphic Brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 block">Graphic Type *</Label>
              <Select value={formData.graphicType} onValueChange={(v) => setFormData(prev => ({ ...prev, graphicType: v }))}>
                <SelectTrigger className="border-gray-200"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Social Media Post">Social Media Post</SelectItem>
                  <SelectItem value="Player Spotlight">Player Spotlight</SelectItem>
                  <SelectItem value="Tournament Recap">Tournament Recap</SelectItem>
                  <SelectItem value="Commitment Announcement">Commitment Announcement</SelectItem>
                  <SelectItem value="Recruiting Material">Recruiting Material</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 block">Description *</Label>
              <Textarea placeholder="Describe the graphic you want to create" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={4} className="border-gray-200" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 block">Dimensions</Label>
              <Select value={formData.dimensions} onValueChange={(v) => setFormData(prev => ({ ...prev, dimensions: v }))}>
                <SelectTrigger className="border-gray-200"><SelectValue placeholder="Select dimensions" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1080x1080">1080 x 1080 (Square)</SelectItem>
                  <SelectItem value="1920x1080">1920 x 1080 (Landscape)</SelectItem>
                  <SelectItem value="1080x1920">1080 x 1920 (Portrait)</SelectItem>
                  <SelectItem value="800x600">800 x 600 (Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 block">Brand Elements</Label>
              <div className="space-y-2">
                {['Logo', 'Team Colors', 'Program Name'].map(el => (
                  <div key={el} className="flex items-center gap-2">
                    <Checkbox checked={formData.brandElements.includes(el)} onCheckedChange={() => toggleBrandElement(el)} id={`brand-${el}`} />
                    <label htmlFor={`brand-${el}`} className="text-sm text-gray-700 cursor-pointer">{el}</label>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={loading || !formData.graphicType || !formData.description} className="w-full bg-[#FF6FF0] text-white hover:bg-[#E560D8]">
              {loading ? <><AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Graphic'}
            </Button>
            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
            {statusMsg && <p className="text-sm text-emerald-600">{statusMsg}</p>}
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-900">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin text-[#FF6FF0]" />
                  <span className="ml-3 text-sm text-gray-500">Generating graphic...</span>
                </div>
              ) : currentGraphic ? (
                <div className="space-y-4">
                  {currentGraphic.imageUrl ? (
                    <div className="border border-gray-200 overflow-hidden rounded-md">
                      <img src={currentGraphic.imageUrl} alt={currentGraphic.description} className="w-full h-auto object-contain max-h-[400px]" />
                    </div>
                  ) : (
                    <div className="border border-gray-200 flex items-center justify-center h-[200px] rounded-md bg-gray-50">
                      <p className="text-sm text-gray-400">No image available</p>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-[#FF6FF0]/10 text-[#FF6FF0] border border-[#FF6FF0]/20">{currentGraphic.graphicType}</Badge>
                    <Badge variant="outline" className="border-gray-200 text-gray-600">{currentGraphic.dimensions || 'N/A'}</Badge>
                  </div>
                  {currentGraphic.imageUrl && (
                    <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-[#0020FF]/5 hover:text-[#0020FF]" onClick={() => window.open(currentGraphic.imageUrl, '_blank')}>
                      <HiOutlineDownload className="mr-2 h-4 w-4" /> Download
                    </Button>
                  )}
                  <div className="space-y-3">
                    {currentGraphic.brandElements && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Brand Elements</p>
                        <p className="text-sm text-gray-700">{currentGraphic.brandElements}</p>
                      </div>
                    )}
                    {currentGraphic.colorPalette && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Color Palette</p>
                        <p className="text-sm text-gray-700">{currentGraphic.colorPalette}</p>
                      </div>
                    )}
                    {currentGraphic.typographyNotes && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Typography Notes</p>
                        <p className="text-sm text-gray-700">{currentGraphic.typographyNotes}</p>
                      </div>
                    )}
                    {currentGraphic.usageRecommendations && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Usage Recommendations</p>
                        <p className="text-sm text-gray-700">{currentGraphic.usageRecommendations}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <HiOutlinePhotograph className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-400">Describe your graphic and generate to see a preview.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {gallery.length > 0 && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-gray-900">Gallery ({gallery.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="grid grid-cols-3 gap-2">
                    {gallery.map(g => (
                      <button key={g.id} onClick={() => setCurrentGraphic(g)} className="border border-gray-200 overflow-hidden rounded-md hover:border-[#FF6FF0] transition-colors">
                        {g.imageUrl ? (
                          <img src={g.imageUrl} alt={g.graphicType} className="w-full h-20 object-cover" />
                        ) : (
                          <div className="w-full h-20 bg-gray-50 flex items-center justify-center">
                            <HiOutlinePhotograph className="h-5 w-5 text-gray-300" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
