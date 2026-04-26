import { useState, useRef, useEffect } from "react"
import Icon from "@/components/ui/icon"

interface AudioPlayerProps {
  title: string
  category: string
  onClose: () => void
}

export function AudioPlayer({ title, category, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const durationMap: Record<string, number> = {
    "Энергия · 7 минут": 7 * 60,
    "Стресс · 10 минут": 10 * 60,
    "Сон · 15 минут": 15 * 60,
    "Концентрация · 5 минут": 5 * 60,
    "Усталость · 12 минут": 12 * 60,
  }

  useEffect(() => {
    const d = durationMap[category] ?? 7 * 60
    setDuration(d)
  }, [category])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            clearInterval(intervalRef.current)
            return 0
          }
          const next = prev + 1
          setProgress((next / duration) * 100)
          return next
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, duration])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const newTime = Math.floor(ratio * duration)
    setCurrentTime(newTime)
    setProgress(ratio * 100)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="border-t border-white/10 bg-black/60 px-4 py-4 backdrop-blur-xl md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm font-light text-white md:text-base">{title}</p>
              <p className="font-mono text-xs text-white/50">{category}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-white/40">
                {formatTime(currentTime)} / {formatTime(duration)}
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
              onClick={() => setCurrentTime((t) => Math.max(0, t - 10))}
              className="text-white/50 transition-colors hover:text-white"
            >
              <Icon name="RotateCcw" size={16} />
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={18} />
            </button>

            <button
              onClick={() => setCurrentTime((t) => Math.min(duration, t + 10))}
              className="text-white/50 transition-colors hover:text-white"
            >
              <Icon name="RotateCw" size={16} />
            </button>

            <div
              className="relative h-1 flex-1 cursor-pointer rounded-full bg-white/20"
              onClick={handleProgressClick}
            >
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-lg transition-all duration-300"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
