import { useRef, useState, useEffect, useCallback } from "react"
import { Shader, ChromaFlow, Swirl } from "shaders/react"

interface ShaderBackgroundProps {
  overlay?: string
}

export function ShaderBackground({ overlay = "bg-black/20" }: ShaderBackgroundProps) {
  const [key, setKey] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleRecover = useCallback(() => {
    setKey((k) => k + 1)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onError = (e: ErrorEvent) => {
      if (e.message?.toLowerCase().includes("webgpu") || e.message?.toLowerCase().includes("device lost")) {
        setTimeout(handleRecover, 1000)
      }
    }

    window.addEventListener("error", onError)
    return () => window.removeEventListener("error", onError)
  }, [handleRecover])

  return (
    <div ref={containerRef} className="fixed inset-0 z-0" style={{ contain: "strict" }}>
      <Shader key={key} className="h-full w-full">
        <Swirl
          colorA="#1275d8"
          colorB="#e19136"
          speed={0.8}
          detail={0.8}
          blend={50}
          coarseX={40}
          coarseY={40}
          mediumX={40}
          mediumY={40}
          fineX={40}
          fineY={40}
        />
        <ChromaFlow
          baseColor="#0066ff"
          upColor="#0066ff"
          downColor="#d1d1d1"
          leftColor="#e19136"
          rightColor="#e19136"
          intensity={0.9}
          radius={1.8}
          momentum={25}
          maskType="alpha"
          opacity={0.97}
        />
      </Shader>
      <div className={`absolute inset-0 ${overlay}`} />
    </div>
  )
}
