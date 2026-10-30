import type { ReactNode } from "react"
import { cn } from "../lib/utils"
import { MessageCircleIcon, RepeatIcon, HeartIcon, Share2Icon } from "./Icons"

export interface PostPreviewProps {
  media: ReactNode
  name?: string
  handle?: string
  text?: string
  className?: string
}

export function PostPreview({
  media,
  name = "你",
  handle = "@you",
  text = "一图三拼，无缝连贯",
  className,
}: PostPreviewProps) {
  return (
    <article
      className={cn(
        "w-full rounded-2xl border bg-card px-3 sm:px-4 pt-3 pb-3 text-[14px] sm:text-[15px] leading-5 text-card-foreground shadow-sm",
        className
      )}
    >
      <div className="flex gap-2.5 sm:gap-3">
        <div className="size-9 sm:size-10 shrink-0 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-semibold text-sm">
          {name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1 truncate text-xs sm:text-[13px]">
            <span className="font-bold text-[14px] sm:text-[15px]">{name}</span>
            <span className="text-muted-foreground">{handle}</span>
            <span className="text-muted-foreground">· 2分钟前</span>
          </div>
          <p className="mt-0.5 font-normal">{text}</p>
          <div className="mt-2.5 sm:mt-3">{media}</div>
          <div className="mt-3 flex max-w-md justify-between text-muted-foreground [&_svg]:size-[16px] sm:[&_svg]:size-[18px]">
            <span className="flex items-center gap-1 text-[13px] hover:text-foreground cursor-pointer transition-colors">
              <MessageCircleIcon className="size-[18px]" /> 48
            </span>
            <span className="flex items-center gap-1 text-[13px] hover:text-foreground cursor-pointer transition-colors">
              <RepeatIcon className="size-[18px]" /> 312
            </span>
            <span className="flex items-center gap-1 text-[13px] hover:text-foreground cursor-pointer transition-colors">
              <HeartIcon className="size-[18px]" /> 2.4K
            </span>
            <span className="flex items-center gap-1 text-[13px] hover:text-foreground cursor-pointer transition-colors">
              <Share2Icon className="size-[18px]" />
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
