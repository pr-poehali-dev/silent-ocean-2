import { useState } from "react"
import { MagneticButton } from "@/components/magnetic-button"
import { GrainOverlay } from "@/components/grain-overlay"
import { CustomCursor } from "@/components/custom-cursor"
import { Shader, ChromaFlow, Swirl } from "shaders/react"
import Icon from "@/components/ui/icon"

const GENERATE_URL = "https://functions.poehali.dev/c56c21d7-9348-4d67-89f6-562aaf629eed"

const TONES = ["Профессиональный", "Дружелюбный", "Строгий", "Вдохновляющий", "Нейтральный"]

export default function Generator() {
  const [form, setForm] = useState({ role: "", business: "", tasks: "", tone: "Профессиональный" })
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!form.role || !form.business || !form.tasks) {
      setError("Заполните все поля")
      return
    }
    setError("")
    setLoading(true)
    setResult("")

    try {
      const res = await fetch(GENERATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data.prompt)
      }
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="relative min-h-screen w-full bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div className="fixed inset-0 z-0" style={{ contain: "strict" }}>
        <Shader className="h-full w-full">
          <Swirl colorA="#1275d8" colorB="#e19136" speed={0.5} detail={0.6} blend={50} coarseX={40} coarseY={40} mediumX={40} mediumY={40} fineX={40} fineY={40} />
          <ChromaFlow baseColor="#0066ff" upColor="#0066ff" downColor="#d1d1d1" leftColor="#e19136" rightColor="#e19136" intensity={0.9} radius={1.8} momentum={25} maskType="alpha" opacity={0.97} />
        </Shader>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 md:px-12">
        {/* Header */}
        <a href="/" className="mb-12 flex items-center gap-2 transition-opacity hover:opacity-70 inline-flex">
          <Icon name="ArrowLeft" size={16} className="text-foreground/60" />
          <span className="font-mono text-xs text-foreground/60">На главную</span>
        </a>

        <div className="mb-10">
          <div className="mb-4 inline-block rounded-full border border-foreground/20 bg-foreground/15 px-4 py-1.5 backdrop-blur-md">
            <p className="font-mono text-xs text-foreground/90">Генератор скилов</p>
          </div>
          <h1 className="font-sans text-5xl font-light leading-tight tracking-tight text-foreground md:text-6xl">
            Создай своего<br />
            <span className="text-foreground/50">ИИ-эксперта</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-foreground/70">
            Опишите задачу — Claude сгенерирует готовый промт, который превратит обычный чат-бот в вашего персонального эксперта.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Form */}
          <div className="space-y-6 rounded-lg border border-foreground/15 bg-foreground/5 p-6 backdrop-blur-sm md:p-8">
            <div>
              <label className="mb-2 block font-mono text-xs text-foreground/60">Роль ассистента *</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Методолог курсов, копирайтер, менеджер..."
                className="w-full border-b border-foreground/30 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs text-foreground/60">Сфера бизнеса *</label>
              <input
                type="text"
                value={form.business}
                onChange={(e) => setForm({ ...form, business: e.target.value })}
                placeholder="Онлайн-школа, e-commerce, юридические услуги..."
                className="w-full border-b border-foreground/30 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs text-foreground/60">Ключевые задачи *</label>
              <textarea
                rows={3}
                value={form.tasks}
                onChange={(e) => setForm({ ...form, tasks: e.target.value })}
                placeholder="Что должен делать ассистент? Какие вопросы решать?"
                className="w-full resize-none border-b border-foreground/30 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-3 block font-mono text-xs text-foreground/60">Тон общения</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, tone: t })}
                    className={`rounded-full border px-3 py-1 font-mono text-xs transition-all ${
                      form.tone === t
                        ? "border-foreground/50 bg-foreground/20 text-foreground"
                        : "border-foreground/20 text-foreground/50 hover:border-foreground/30 hover:text-foreground/70"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="font-mono text-xs text-red-400">{error}</p>}

            <MagneticButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleGenerate}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Генерирую промт...
                </span>
              ) : (
                "Сгенерировать скил"
              )}
            </MagneticButton>
          </div>

          {/* Result */}
          <div className="flex flex-col rounded-lg border border-foreground/15 bg-foreground/5 p-6 backdrop-blur-sm md:p-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-xs text-foreground/60">Готовый промт</p>
              {result && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 font-mono text-xs text-foreground/60 transition-colors hover:text-foreground"
                >
                  <Icon name={copied ? "Check" : "Copy"} size={12} />
                  {copied ? "Скопировано!" : "Копировать"}
                </button>
              )}
            </div>

            {!result && !loading && (
              <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                <Icon name="Sparkles" size={32} className="mb-4 text-foreground/20" />
                <p className="font-mono text-xs text-foreground/40">Заполните форму слева<br />и нажмите «Сгенерировать»</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-1 flex-col items-center justify-center py-12">
                <Icon name="Loader2" size={32} className="animate-spin text-foreground/30" />
                <p className="mt-4 font-mono text-xs text-foreground/40">Claude думает...</p>
              </div>
            )}

            {result && (
              <div className="flex-1 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80">{result}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
