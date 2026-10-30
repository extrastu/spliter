import type { ReactNode } from "react"
import { cn } from "../lib/utils"

export interface TileGridProps {
  tiles: ReactNode[]
  tileAspect?: number
  split?: boolean
  renderAction?: (index: number) => ReactNode
  children?: ReactNode
  className?: string
}

export function TileGrid({
  tiles,
  tileAspect,
  split = true,
  renderAction,
  children,
  className,
}: TileGridProps) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-3 overflow-hidden rounded-xl border transition-[gap] duration-500 ease-out",
        split ? "gap-1.5" : "gap-0",
        className
      )}
    >
      {tiles.map((tile, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden bg-secondary"
          style={{ aspectRatio: tileAspect }}
        >
          {tile}
          <span
            aria-hidden={!split}
            className={cn(
              "absolute top-2 left-2 flex size-5 items-center justify-center rounded-full bg-background/90 text-[11px] font-medium text-foreground transition-opacity duration-300 pointer-events-none select-none",
              split ? "opacity-100 delay-300" : "opacity-0"
            )}
          >
            {idx + 1}
          </span>
          {renderAction && (
            <span className="absolute top-2 right-2 z-20">
              {renderAction(idx)}
            </span>
          )}
        </div>
      ))}
      {children}
    </div>
  )
}
