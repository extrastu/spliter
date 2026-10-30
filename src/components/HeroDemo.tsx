import { useState, useRef, useEffect } from "react"
import { TileGrid } from "./TileGrid"
import { ScissorsIcon } from "./Icons"
import { XhsFollowButton } from "./XhsFollowButton"

export function HeroDemo() {
  const [status, setStatus] = useState<"before" | "cutting" | "after">("before")
  const timeoutRef = useRef<number | undefined>(undefined)

  const triggerSplit = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStatus("after")
    } else {
      setStatus("cutting")
      timeoutRef.current = window.setTimeout(() => {
        setStatus("after")
      }, 650)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const tiles = [0, 1, 2].map((idx) => (
    <div
      key={idx}
      className="absolute top-1/2 w-[300%] -translate-y-1/2"
      style={{ left: `${-(100 * idx)}%` }}
    >
      <img
        src="/demo.jpg"
        alt={idx === 0 ? "沿海公路日落全景大片" : ""}
        width={1376}
        height={768}
        className="block h-auto w-full select-none"
        draggable={false}
      />
    </div>
  ))

  const isAfter = status === "after"

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        aria-label={isAfter ? "重新演示切割" : "切割图片"}
        disabled={status === "cutting"}
        onClick={isAfter ? () => setStatus("before") : triggerSplit}
        className="group block w-full cursor-pointer rounded-xl text-left focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-default"
      >
        <TileGrid
          tiles={tiles}
          tileAspect={1376 / 3 / 768}
          split={isAfter}
          className="rounded-xl shadow-sm"
        >
          {status === "cutting" &&
            [1, 2].map((bladeIdx) => (
              <span
                key={bladeIdx}
                aria-hidden={true}
                className="blade"
                style={{
                  left: `calc(${(100 * bladeIdx) / 3}% - 1px)`,
                  animationDelay: `${(bladeIdx - 1) * 90}ms`,
                }}
              />
            ))}
          {status === "before" && (
            <span
              aria-hidden={true}
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30"
            >
              <span className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-[13px] font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100 shadow-sm">
                <ScissorsIcon className="size-4" />
                切开看看
              </span>
            </span>
          )}
        </TileGrid>
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 px-0.5">
        {isAfter ? (
          <>
            <p className="text-[12px] sm:text-[13px] leading-tight text-muted-foreground">
              三等分切片完成！按顺序拼接或排版，连贯展开宛如一整幅全景画卷。
            </p>
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <XhsFollowButton className="h-6.5 px-2.5 text-[11px]" />
              <button
                type="button"
                className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer underline-offset-4 hover:underline"
                onClick={() => setStatus("before")}
              >
                重新演示
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-[12px] sm:text-[13px] leading-tight text-muted-foreground">
              这是一整张宽画幅全景大片，点击体验无缝三联切图效果。
            </p>
            <button
              type="button"
              className="self-start sm:self-auto group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding text-sm whitespace-nowrap transition-all outline-none select-none border-border bg-background hover:bg-muted hover:text-foreground dark:bg-transparent dark:hover:bg-input/30 h-8 sm:h-7 gap-1.5 rounded-full px-3.5 font-medium cursor-pointer disabled:opacity-50 active:scale-95"
              disabled={status === "cutting"}
              onClick={triggerSplit}
            >
              <ScissorsIcon className="size-4" />
              {status === "cutting" ? "正在切割…" : "切开看看"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
