import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "../lib/utils"
import { PostPreview } from "./PostPreview"
import { TileGrid } from "./TileGrid"
import { PhotoPlusIcon, DownloadIcon } from "./Icons"

export interface SplitPart {
  index: number
  url: string
  filename: string
  width: number
  height: number
}

function getBasename(name: string) {
  const lastDot = name.lastIndexOf(".")
  return lastDot > 0 ? name.slice(0, lastDot) : name
}

async function splitImage(file: File): Promise<SplitPart[]> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("无法将该文件作为有效图片读取。"))
    }
    image.src = objectUrl
  })

  const partWidth = Math.floor(img.naturalWidth / 3)
  const height = img.naturalHeight

  if (partWidth < 1) {
    throw new Error("图片宽度过小，无法分为三等份。")
  }

  const baseName = getBasename(file.name)
  const parts: SplitPart[] = []

  for (let i = 0; i < 3; i++) {
    const canvas = document.createElement("canvas")
    canvas.width = partWidth
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      throw new Error("当前浏览器环境不支持图片 Canvas 绘制。")
    }
    ctx.drawImage(img, i * partWidth, 0, partWidth, height, 0, 0, partWidth, height)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("切片导出失败。"))),
        "image/png"
      )
    })

    parts.push({
      index: i + 1,
      url: URL.createObjectURL(blob),
      filename: `${baseName} (${i + 1}).png`,
      width: partWidth,
      height,
    })
  }

  return parts
}

function downloadPart(part: SplitPart) {
  const a = document.createElement("a")
  a.href = part.url
  a.download = part.filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function Splitter() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [parts, setParts] = useState<SplitPart[]>([])
  const [filename, setFilename] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateParts = (newParts: SplitPart[]) => {
    setParts((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url))
      return newParts
    })
  }

  const handleFile = useCallback(async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("仅支持图片文件，请上传 PNG、JPG 或 WebP 格式。")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await splitImage(file)
      updateParts(result)
      setFilename(file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理图片时发生错误，请重试。")
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const downloadAll = async () => {
    for (const part of parts) {
      downloadPart(part)
      await new Promise((r) => setTimeout(r, 300))
    }
  }

  const resetAll = () => {
    updateParts([])
    setFilename("")
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const items = Array.from(e.clipboardData?.items ?? [])
      const imageItem = items.find((item) => item.type.startsWith("image/"))
      const file = imageItem?.getAsFile()
      if (file) {
        handleFile(file)
      }
    }

    window.addEventListener("paste", onPaste)
    return () => window.removeEventListener("paste", onPaste)
  }, [handleFile])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      parts.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [parts])

  const dropZone = (
    <label
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-12 sm:px-6 sm:py-16 text-center transition-colors",
        "focus-within:border-x hover:border-x/60",
        isDragging && "border-x bg-x/5"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      <PhotoPlusIcon className="size-8 text-x" />
      <div>
        <p className="font-bold text-base sm:text-lg">
          {isProcessing ? "正在切割…" : "拖入图片到这里"}
        </p>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          或点击选择图片，支持直接截图粘贴 (Ctrl+V / ⌘V)
        </p>
      </div>
    </label>
  )

  if (parts.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {dropZone}
        {error && (
          <p role="alert" className="text-sm text-destructive text-center font-medium">
            {error}
          </p>
        )}
      </div>
    )
  }

  const tiles = parts.map((part) => (
    <img
      key={part.index}
      src={part.url}
      alt={`Part ${part.index} of 3`}
      className="absolute inset-0 size-full object-cover select-none"
      draggable={false}
    />
  ))

  const tileAspect = parts[0].width / parts[0].height

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-5 w-full">
      <PostPreview
        text={`${getBasename(filename)}，三等分切片`}
        media={
          <TileGrid
            tiles={tiles}
            tileAspect={tileAspect}
            renderAction={(idx) => (
              <button
                type="button"
                aria-label={`下载第 ${idx + 1} 张`}
                title={`下载第 ${idx + 1} 张`}
                className="size-7 inline-flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer active:scale-90"
                onClick={() => downloadPart(parts[idx])}
              >
                <DownloadIcon className="size-3.5 sm:size-4" />
              </button>
            )}
          />
        }
      />

      <div className="flex flex-col items-center gap-3 w-full sm:w-auto mt-1">
        <button
          type="button"
          onClick={() => void downloadAll()}
          className="group/button inline-flex w-full sm:w-auto shrink-0 items-center justify-center border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none h-11 rounded-full bg-x px-6 text-[15px] font-bold text-background hover:bg-x/90 cursor-pointer gap-2 shadow-sm active:scale-[0.98]"
        >
          <DownloadIcon className="size-4" />
          下载全部三张切片
        </button>

        <button
          type="button"
          onClick={resetAll}
          className="rounded-sm text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none cursor-pointer py-1"
        >
          更换其他图片
        </button>
      </div>
    </div>
  )
}
