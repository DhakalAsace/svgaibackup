'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Clock, Film, Loader2, Sparkles, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'
interface GeneratedVideo {
  id: string
  prompt: string
  video_url: string
  duration: number
  resolution: string
  credits_used: number
  expires_at: string
  created_at: string
  metadata: {
    fps?: number
    seed?: string
    original_svg?: string
  }
}
export function GeneratedVideos() {
  const [videos, setVideos] = useState<GeneratedVideo[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const fetchVideos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('generated_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      if (error) throw error
      // Map the data to handle the Json type from database
      const mappedVideos: GeneratedVideo[] = (data || []).map(video => ({
        ...video,
        metadata: (video.metadata as any) || {}
      }))
      setVideos(mappedVideos)
    } catch (error) {
      } finally {
      setLoading(false)
    }
  }, [supabase])
  useEffect(() => {
    fetchVideos()
    // Poll for new videos every 10 seconds when component is visible
    const interval = setInterval(() => {
      fetchVideos()
    }, 10000)
    return () => clearInterval(interval)
  }, [fetchVideos])

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return
    
    try {
      const { error } = await supabase
        .from('generated_videos')
        .delete()
        .eq('id', videoId)
        
      if (error) throw error
      
      // Refresh the list
      setVideos(videos.filter(v => v.id !== videoId))
      toast.success('Video deleted successfully')
    } catch (error) {
      console.error('Error deleting video:', error)
      toast.error('Failed to delete video')
    }
  }
  const downloadVideo = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(a.href)
    } catch (error) {
      }
  }
  if (loading && videos.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Film className="w-5 h-5 mr-2 text-[#FF6B35]" />
          Your AI Videos
        </h3>
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading your videos...</p>
        </Card>
      </div>
    )
  }
  if (!loading && videos.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Film className="w-5 h-5 mr-2 text-[#FF6B35]" />
          Your AI Videos
        </h3>
        <Card className="p-8 text-center">
          <Film className="w-12 h-12 mx-auto mb-4 text-[#FF7043]" />
          <h4 className="font-medium mb-2">No videos yet</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first AI-powered video from SVG
          </p>
          <Link href="/tools/svg-to-video">
            <Button className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white hover:opacity-90">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Video
            </Button>
          </Link>
        </Card>
      </div>
    )
  }
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Film className="w-5 h-5 mr-2" />
        Your AI Videos
      </h3>
      <div className="space-y-4">
      <div className="grid gap-4">
        {videos.map((video) => {
          const expiresIn = formatDistanceToNow(new Date(video.expires_at), { addSuffix: true })
          const isExpired = new Date(video.expires_at) < new Date()
          return (
            <Card key={video.id} className={isExpired ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-base line-clamp-1">
                      {video.metadata.original_svg || 'AI Video'}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {video.prompt}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!isExpired && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(video.video_url, '_blank')}
                          className="hover:text-[#FF6B35]"
                        >
                          <Film className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadVideo(video.video_url, `ai-video-${video.id}.mp4`)}
                          className="border-[#FF7043] text-[#FF7043] hover:bg-[#FF7043] hover:text-white"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteVideo(video.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{video.duration}s</span>
                  <span>•</span>
                  <span>{video.resolution}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#4E342E]" />
                    {isExpired ? 'Expired' : `Expires ${expiresIn}`}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      </div>
    </div>
  )
}