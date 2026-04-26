import { useReveal } from "@/hooks/use-reveal"

const meditations = [
  {
    number: "01",
    title: "Утреннее пробуждение",
    category: "Энергия · 7 минут",
    year: "Утро",
    direction: "left",
  },
  {
    number: "02",
    title: "Снятие тревоги",
    category: "Стресс · 10 минут",
    year: "День",
    direction: "right",
  },
  {
    number: "03",
    title: "Глубокий сон",
    category: "Сон · 15 минут",
    year: "Ночь",
    direction: "left",
  },
  {
    number: "04",
    title: "Фокус и ясность",
    category: "Концентрация · 5 минут",
    year: "День",
    direction: "right",
  },
  {
    number: "05",
    title: "Перезагрузка после работы",
    category: "Усталость · 12 минут",
    year: "Вечер",
    direction: "left",
  },
]

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
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
            <MeditationCard key={i} item={item} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MeditationCard({
  item,
  index,
  isVisible,
}: {
  item: { number: string; title: string; category: string; year: string; direction: string }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return item.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <div
      className={`group flex cursor-pointer items-center justify-between border-b border-foreground/10 py-4 transition-all duration-700 hover:border-foreground/30 md:py-5 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex items-baseline gap-4 md:gap-8">
        <span className="font-mono text-sm text-foreground/30 transition-colors group-hover:text-foreground/50 md:text-base">
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
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/20 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="text-xs text-foreground/60">▶</span>
        </div>
      </div>
    </div>
  )
}
