import type { ReactNode } from "react"
import { cn } from "../lib/utils"
import { MessageCircleIcon, HeartIcon, Share2Icon, StarIcon } from "./Icons"

export interface PostPreviewProps {
  media: ReactNode
  name?: string
  title?: string
  text?: string
  className?: string
}

export function PostPreview({
  media,
  name = "全景摄影日记",
  title = "无缝全景长图 ｜ 横滑看大片 🏔️",
  text = "把全景切成三联发小红书，左右横滑无缝衔接太绝了！发布笔记时按 1、2、3 顺序添加即可 ✨",
  className,
}: PostPreviewProps) {
  return (
    <article
      className={cn(
        "w-full rounded-2xl border bg-card px-3.5 sm:px-4 pt-3.5 pb-3 text-[14px] sm:text-[15px] leading-5 text-card-foreground shadow-sm",
        className
      )}
    >
      {/* 创作者信息栏 */}
      <div className="flex items-center justify-between pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="size-8 sm:size-9 shrink-0 rounded-full bg-gradient-to-tr from-[#ff2442] to-[#ff6b81] flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm select-none">
            {name.slice(0, 1)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[13px] sm:text-[14px] leading-tight text-foreground">
              {name}
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight mt-0.5">
              刚刚 · 小红书笔记预览
            </span>
          </div>
        </div>
        <span className="inline-flex items-center h-6 px-3 rounded-full text-xs font-medium text-[#ff2442] bg-[#ff2442]/10 select-none">
          + 关注
        </span>
      </div>

      {/* 切片展示区 */}
      <div className="mt-1">{media}</div>

      {/* 笔记标题与正文文案 */}
      <div className="mt-3 space-y-1.5 px-0.5">
        <h3 className="font-bold text-[14px] sm:text-[15px] leading-snug text-foreground">
          {title}
        </h3>
        <p className="font-normal text-[13px] sm:text-[14px] leading-relaxed text-muted-foreground text-pretty">
          {text}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-0.5 text-[12px] font-medium text-[#13386c] dark:text-[#6ba1ff]">
          <span>#小红书三联图</span>
          <span>#全景大片</span>
          <span>#摄影技巧</span>
          <span>#横滑画卷</span>
        </div>
      </div>

      {/* 底部互动指标栏 */}
      <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-muted-foreground [&_svg]:size-[16px] sm:[&_svg]:size-[18px]">
        <span className="flex items-center gap-1.5 text-[12px] sm:text-[13px] hover:text-[#ff2442] cursor-pointer transition-colors">
          <HeartIcon className="size-[17px] text-[#ff2442]" /> 2.8万
        </span>
        <span className="flex items-center gap-1.5 text-[12px] sm:text-[13px] hover:text-amber-500 cursor-pointer transition-colors">
          <StarIcon className="size-[17px] text-amber-500" /> 1.6万
        </span>
        <span className="flex items-center gap-1.5 text-[12px] sm:text-[13px] hover:text-foreground cursor-pointer transition-colors">
          <MessageCircleIcon className="size-[17px]" /> 864
        </span>
        <span className="flex items-center gap-1.5 text-[12px] sm:text-[13px] hover:text-foreground cursor-pointer transition-colors">
          <Share2Icon className="size-[17px]" /> 分享
        </span>
      </div>
    </article>
  )
}
