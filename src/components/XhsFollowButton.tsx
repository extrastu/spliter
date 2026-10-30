import { useEffect, useState } from "react"
import { fetchAuthorFollowStatus, followToolAuthor } from "../lib/xhs"
import { cn } from "../lib/utils"

export function XhsFollowButton({ className }: { className?: string }) {
  const [followStatus, setFollowStatus] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function checkStatus() {
      const status = await fetchAuthorFollowStatus()
      if (isMounted && status >= 0) {
        setFollowStatus(status)
      }
    }
    checkStatus()
    return () => {
      isMounted = false
    }
  }, [])

  const handleFollow = async () => {
    if (loading || followStatus === 1 || followStatus === 2) return
    setLoading(true)
    try {
      const res = await followToolAuthor()
      if (res.status >= 0) {
        setFollowStatus(res.status)
      }
    } finally {
      setLoading(false)
    }
  }

  // 关注状态文本与样式映射
  if (followStatus === 1) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium bg-muted text-muted-foreground cursor-default border border-border select-none",
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-emerald-500"></span>
        已关注
      </button>
    )
  }

  if (followStatus === 2) {
    return (
      <span
        className={cn(
          "inline-flex items-center h-7 px-2.5 rounded-full text-xs font-medium text-muted-foreground select-none",
          className
        )}
      >
        作者本人
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleFollow}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-1 h-7 px-3 rounded-full text-xs font-medium transition-all select-none cursor-pointer active:scale-95 shadow-sm",
        "bg-[#ff2442] text-white hover:bg-[#e01d39] disabled:opacity-50",
        className
      )}
      title="关注小工具作者"
    >
      <span>+</span>
      <span>{loading ? "处理中…" : "关注作者"}</span>
    </button>
  )
}
