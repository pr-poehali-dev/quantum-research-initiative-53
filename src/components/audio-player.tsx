import { useState, useRef, useEffect } from "react"
import Icon from "@/components/ui/icon"

interface AudioPlayerProps {
  title: string
  category: string
  audioUrl: string
  duration: number
  onClose: () => void
}

export function AudioPlayer({ title, category, audioUrl, duration, onClose }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [actualDuration, setActualDuration] = useState(duration)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => {
      if (isFinite(audio.duration)) setActualDuration(audio.duration)
    }
    const onEnded = () => setIsPlaying(false)
    const onCanPlay = () => setIsLoading(false)

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("durationchange", onDurationChange)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("canplay", onCanPlay)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("durationchange", onDurationChange)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("canplay", onCanPlay)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    setIsLoading(true)
    setIsPlaying(false)
    setCurrentTime(0)
    setActualDuration(duration)
    audio.load()
  }, [audioUrl, duration])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }
    }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * actualDuration
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(actualDuration, audio.currentTime + seconds))
  }

  const formatTime = (s: number) => {
    if (!isFinite(s) || s < 0) return "—"
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const progress = actualDuration > 0 ? (currentTime / actualDuration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      <audio ref={audioRef} src={audioUrl} preload="metadata" crossOrigin="anonymous" />

      <div className="border-t border-white/10 bg-black/70 px-4 py-4 backdrop-blur-xl md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm font-light text-white md:text-base">{title}</p>
              <p className="font-mono text-xs text-white/50">{category}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-white/40">
                {formatTime(currentTime)} / {formatTime(actualDuration)}
              </span>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/50 transition-colors hover:border-white/40 hover:text-white"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => skip(-10)}
              className="text-white/50 transition-colors hover:text-white"
              title="-10 сек"
            >
              <Icon name="RotateCcw" size={16} />
            </button>

            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? (
                <Icon name="Loader" size={18} className="animate-spin" />
              ) : (
                <Icon name={isPlaying ? "Pause" : "Play"} size={18} />
              )}
            </button>

            <button
              onClick={() => skip(10)}
              className="text-white/50 transition-colors hover:text-white"
              title="+10 сек"
            >
              <Icon name="RotateCw" size={16} />
            </button>

            <div
              className="relative h-1 flex-1 cursor-pointer rounded-full bg-white/20"
              onClick={seek}
            >
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-lg"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
