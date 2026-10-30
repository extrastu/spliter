import { useState, useEffect } from "react"
import { ThemeToggle } from "./components/ThemeToggle"
import { ArrowRightIcon } from "./components/Icons"
import { HeroDemo } from "./components/HeroDemo"
import { Splitter } from "./components/Splitter"
import { XhsFollowButton } from "./components/XhsFollowButton"

export default function App() {
  const [route, setRoute] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname === "/split" ? "/split" : "/"
    }
    return "/"
  })

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname === "/split" ? "/split" : "/")
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path)
      setRoute(path)
      window.scrollTo(0, 0)
    }
  }

  const Logo = (
    <a
      className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight cursor-pointer select-none"
      onClick={() => navigate("/")}
    >
      <span aria-hidden="true" className="flex h-3.5 w-6 gap-[2px]">
        <span className="flex-1 rounded-l-[2px] bg-foreground"></span>
        <span className="flex-1 bg-foreground"></span>
        <span className="flex-1 rounded-r-[2px] bg-foreground/40"></span>
      </span>
      Spliter
    </a>
  )

  const FooterInfo = (
    <span className="text-muted-foreground select-none">
      纯本地无损处理 · 保护隐私安全
    </span>
  )

  if (route === "/split") {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col px-4 sm:px-6">
        <nav className="flex h-14 sm:h-16 items-center justify-between">
          {Logo}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <XhsFollowButton />
            <ThemeToggle />
          </div>
        </nav>

        <section className="pt-6 pb-6 sm:pt-8 sm:pb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            图片等分切割
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            上传一张宽画幅全景图，自动等分为 3 部分并实时预览发布效果。
          </p>
        </section>

        <Splitter />

        <footer className="mt-auto flex items-center justify-between border-t py-5 sm:py-6 text-xs sm:text-sm text-muted-foreground">
          <span>Spliter</span>
          {FooterInfo}
        </footer>
      </main>
    )
  }

  // Home page route
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-4 sm:px-6">
      <nav className="flex h-14 sm:h-16 items-center justify-between">
        {Logo}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <XhsFollowButton />
          <ThemeToggle />
          <a
            className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            onClick={() => navigate("/split")}
          >
            开始切图
            <ArrowRightIcon className="size-3.5" />
          </a>
        </div>
      </nav>

      <section className="flex flex-1 flex-col items-center justify-center gap-8 py-10 sm:gap-10 sm:py-16 text-center">
        <div className="flex max-w-lg flex-col items-center gap-4 sm:gap-5">
          <h1 className="text-[1.85rem] sm:text-[2.5rem] md:text-[3rem] leading-tight font-bold sm:font-medium tracking-tight text-balance">
            顺应潮流，发布你的三联图
          </h1>
          <p className="max-w-md text-[14px] sm:text-[15px] leading-relaxed sm:leading-tight text-muted-foreground text-pretty">
            X (Twitter) 上的创作者正在将一张宽幅大片切成三等份发布，连续滚动宛如一幅画卷。Spliter 秒级完成切割。
          </p>
          <div className="mt-1 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/split")}
              className="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:scale-95 bg-primary text-primary-foreground hover:bg-primary/80 h-10 sm:h-9 rounded-full px-5 sm:px-4 text-[14px] sm:text-[13px] font-medium cursor-pointer shadow-sm"
            >
              立即制作三联图
            </button>
          </div>
        </div>

        <div className="w-full max-w-xl text-left">
          <HeroDemo />
        </div>
      </section>

      <section aria-label="工作原理" className="grid gap-6 border-t pt-8 pb-12 sm:pb-16 sm:grid-cols-3">
        <div className="flex gap-4 sm:flex-col sm:gap-2">
          <span className="w-5 shrink-0 text-[13px] text-muted-foreground tabular-nums">01</span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">上传宽幅全景图</p>
            <p className="text-[13px] leading-tight text-muted-foreground">
              横屏效果最佳，任何宽度大于高度的摄影、截图均可。
            </p>
          </div>
        </div>
        <div className="flex gap-4 sm:flex-col sm:gap-2">
          <span className="w-5 shrink-0 text-[13px] text-muted-foreground tabular-nums">02</span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">下载三等分切片</p>
            <p className="text-[13px] leading-tight text-muted-foreground">
              高度完全一致，宽度均分各占三分之一，纯本地处理。
            </p>
          </div>
        </div>
        <div className="flex gap-4 sm:flex-col sm:gap-2">
          <span className="w-5 shrink-0 text-[13px] text-muted-foreground tabular-nums">03</span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">按序号发布到 X</p>
            <p className="text-[13px] leading-tight text-muted-foreground">
              按 1、2、3 顺序添加图片，X 将连贯展示为一组完整画卷。
            </p>
          </div>
        </div>
      </section>

      <footer className="flex items-center justify-between border-t py-4 sm:py-5 text-xs sm:text-[13px] text-muted-foreground">
        <span>Spliter</span>
        {FooterInfo}
      </footer>
    </main>
  )
}
