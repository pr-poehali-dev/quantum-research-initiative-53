import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"
import { AudioPlayer } from "@/components/audio-player"
import Icon from "@/components/ui/icon"

const meditations = [
  {
    number: "01",
    title: "Утреннее пробуждение",
    category: "Энергия · 10 минут",
    year: "Утро",
    direction: "left",
    audioUrl: "https://ia601905.us.archive.org/30/items/jamendo-559810/01-2153953-Crystal%20Wave-Binaural%20Meditation.mp3",
    duration: 593,
  },
  {
    number: "02",
    title: "Снятие тревоги",
    category: "Стресс · 23 минуты",
    year: "День",
    direction: "right",
    audioUrl: "https://ia600107.us.archive.org/12/items/ipc-calming-overthinking-396hz-theta-8d/23%20Min%20Calm%20Overthink%208d_mix.mp3",
    duration: 1405,
  },
  {
    number: "03",
    title: "Глубокий сон",
    category: "Сон · 60 минут",
    year: "Ночь",
    direction: "left",
    audioUrl: "https://ia600803.us.archive.org/21/items/meditation-gamma-binaural-waves-for-transcendental-focus-2/Meditation%20gamma%20binaural%20waves%20for%20transcendental%20focus%20%282%29.mp3",
    duration: 3600,
  },
  {
    number: "04",
    title: "Фокус и ясность",
    category: "Концентрация · Бинауральные ритмы",
    year: "День",
    direction: "right",
    audioUrl: "https://ia601905.us.archive.org/30/items/jamendo-559810/01-2153953-Crystal%20Wave-Binaural%20Meditation.mp3",
    duration: 593,
  },
  {
    number: "05",
    title: "Перезагрузка после работы",
    category: "Усталость · 23 минуты",
    year: "Вечер",
    direction: "left",
    audioUrl: "https://ia600107.us.archive.org/12/items/ipc-calming-overthinking-396hz-theta-8d/23%20Min%20Calm%20Overthink%208d_mix.mp3",
    duration: 1405,
  },
]

type Meditation = typeof meditations[0]

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [activeMeditation, setActiveMeditation] = useState<Meditation | null>(null)

  return (
    <>
      <section
        ref={ref}
        className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div
            className={`mb-8 transition-all duration-700 md:mb-12 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
          >
            <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Медитации
            </h2>
            <p className="font-mono text-sm text-foreground/60 md:text-base">/ Готовые практики для каждого состояния</p>
          </div>

          <div className="space-y-2 md:space-y-4">
            {meditations.map((item, i) => (
              <MeditationCard
                key={i}
                item={item}
                index={i}
                isVisible={isVisible}
                isActive={activeMeditation?.title === item.title}
                onPlay={() => setActiveMeditation(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {activeMeditation && (
        <AudioPlayer
          title={activeMeditation.title}
          category={activeMeditation.category}
          audioUrl={activeMeditation.audioUrl}
          duration={activeMeditation.duration}
          onClose={() => setActiveMeditation(null)}
        />
      )}
    </>
  )
}

function MeditationCard({
  item,
  index,
  isVisible,
  isActive,
  onPlay,
}: {
  item: Meditation
  index: number
  isVisible: boolean
  isActive: boolean
  onPlay: () => void
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return item.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <div
      onClick={onPlay}
      className={`group flex cursor-pointer items-center justify-between border-b py-4 transition-all duration-700 md:py-5 ${
        isActive
          ? "border-foreground/40 bg-white/5"
          : "border-foreground/10 hover:border-foreground/30"
      } ${getRevealClass()}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-baseline gap-4 md:gap-8">
        <span className={`font-mono text-sm transition-colors md:text-base ${isActive ? "text-foreground/70" : "text-foreground/30 group-hover:text-foreground/50"}`}>
          {item.number}
        </span>
        <div>
          <h3 className="mb-0.5 font-sans text-xl font-light text-foreground transition-transform duration-300 group-hover:translate-x-2 md:text-2xl lg:text-3xl">
            {item.title}
          </h3>
          <p className="font-mono text-xs text-foreground/50 md:text-sm">{item.category}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-foreground/30 md:text-sm">{item.year}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
          isActive
            ? "border-foreground/60 opacity-100 bg-white/10"
            : "border-foreground/20 opacity-0 group-hover:opacity-100"
        }`}>
          <Icon name={isActive ? "Pause" : "Play"} size={12} className="text-foreground/80" />
        </div>
      </div>
    </div>
  )
}
