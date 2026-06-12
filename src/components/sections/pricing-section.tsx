import { useReveal } from "@/hooks/use-reveal"
import { MagneticButton } from "@/components/magnetic-button"
import Icon from "@/components/ui/icon"

const plans = [
  {
    name: "Старт",
    price: "15 000 ₽",
    description: "Один скил для одной задачи",
    features: [
      "1 кастомный скил",
      "Проектирование промта",
      "Базовая настройка логики",
      "1 раунд правок",
      "Инструкция по внедрению",
    ],
    highlight: false,
    direction: "left",
  },
  {
    name: "Бизнес",
    price: "25 000 ₽",
    description: "Комплексный ИИ-ассистент под роль",
    features: [
      "До 3 скилов в связке",
      "Глубокая настройка логики",
      "Контекст под ваш бизнес",
      "3 раунда правок",
      "Онбординг и поддержка 30 дней",
    ],
    highlight: true,
    direction: "top",
  },
  {
    name: "Премиум",
    price: "50 000 ₽",
    description: "Экосистема ИИ-ассистентов под команду",
    features: [
      "Неограниченное число скилов",
      "Интеграция с вашими инструментами",
      "Уникальная база знаний",
      "Итерационные правки",
      "Поддержка и апдейты 3 месяца",
    ],
    highlight: false,
    direction: "right",
  },
]

export function PricingSection({ scrollToSection }: { scrollToSection?: (index: number) => void }) {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-10 transition-all duration-700 md:mb-14 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Тарифы
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Выберите свой пакет</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {plans.map((plan, i) => {
            const getRevealClass = () => {
              if (!isVisible) {
                switch (plan.direction) {
                  case "left": return "-translate-x-16 opacity-0"
                  case "right": return "translate-x-16 opacity-0"
                  case "top": return "-translate-y-16 opacity-0"
                  default: return "translate-y-12 opacity-0"
                }
              }
              return "translate-x-0 translate-y-0 opacity-100"
            }

            return (
              <div
                key={i}
                className={`group relative flex flex-col justify-between border p-6 transition-all duration-700 md:p-8 ${
                  plan.highlight
                    ? "border-foreground/40 bg-foreground/10 backdrop-blur-md"
                    : "border-foreground/15 bg-foreground/5 backdrop-blur-sm hover:border-foreground/25"
                } ${getRevealClass()}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {plan.highlight && (
                  <div className="absolute -top-px left-6 right-6 h-px bg-foreground/60" />
                )}

                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs text-foreground/50 mb-1">0{i + 1}</p>
                      <h3 className="font-sans text-2xl font-light text-foreground">{plan.name}</h3>
                    </div>
                    {plan.highlight && (
                      <span className="font-mono text-xs text-foreground/70 border border-foreground/30 px-2 py-0.5">
                        Хит
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="font-sans text-3xl font-light text-foreground md:text-4xl">{plan.price}</p>
                    <p className="mt-1 font-mono text-xs text-foreground/50">{plan.description}</p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 font-mono text-xs text-foreground/70">
                        <Icon name="Check" size={12} className="text-foreground/50 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <MagneticButton
                  variant={plan.highlight ? "primary" : "secondary"}
                  className="w-full"
                  onClick={() => scrollToSection?.(5)}
                >
                  Выбрать
                </MagneticButton>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}