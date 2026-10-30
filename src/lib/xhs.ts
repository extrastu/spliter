import type { XhsMiniTool } from "../types/xhs"

/**
 * 判断当前是否处于小红书小工具容器环境
 */
export function isXhsContainer(): boolean {
  if (typeof window === "undefined") return false
  const miniTool = window.xhs?.miniTool
  const ua = navigator.userAgent.toLowerCase()
  return (
    Boolean(miniTool && typeof miniTool.postNote === "function") ||
    ua.includes("xhs") ||
    ua.includes("xiaohongshu")
  )
}

function getMiniTool(): XhsMiniTool | undefined {
  if (typeof window === "undefined") return undefined
  return window.xhs?.miniTool
}

/**
 * 保存图片到系统相册（小红书容器）或触发网页下载（浏览器环境）
 */
export async function saveImageToAlbum(
  dataUrl: string,
  filename = "slice.png",
  blobUrl?: string
): Promise<{ success: boolean; message: string }> {
  const miniTool = getMiniTool()

  if (miniTool && typeof miniTool.saveImageToPhotosAlbum === "function") {
    try {
      let targetPath = dataUrl

      // 大图优先调用 writeTempFile 落成临时文件，再保存到相册
      if (typeof miniTool.writeTempFile === "function") {
        try {
          const tempRes = await miniTool.writeTempFile({ data: dataUrl })
          if (tempRes.filePath) {
            targetPath = tempRes.filePath
          }
        } catch {
          // writeTempFile 失败时回退使用原始 dataUrl
        }
      }

      await miniTool.saveImageToPhotosAlbum({ filePath: targetPath })
      return { success: true, message: "已保存到系统相册" }
    } catch (err: unknown) {
      const errMsg =
        err && typeof err === "object" && "errMsg" in err
          ? String((err as { errMsg: string }).errMsg)
          : err instanceof Error
          ? err.message
          : "保存相册失败"
      return { success: false, message: errMsg }
    }
  }

  // 浏览器降级：使用 standard a[download]
  try {
    const a = document.createElement("a")
    a.href = blobUrl || dataUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    return { success: true, message: "已触发下载" }
  } catch {
    return { success: false, message: "下载失败，请长按图片保存" }
  }
}

/**
 * 唤起小红书发布笔记页面并带入三联切片
 */
export async function publishNoteToXhs(params: {
  title?: string
  content?: string
  images: string[] // dataUrl 列表
}): Promise<{ success: boolean; message: string }> {
  const miniTool = getMiniTool()

  if (!miniTool || typeof miniTool.postNote !== "function") {
    return {
      success: false,
      message: "发布笔记仅在小红书 App 小工具容器内支持，请在小红书打开",
    }
  }

  try {
    // 优先尝试将 base64 转为临时文件路径以提高端上稳定性
    const imageResources: Array<{ url: string }> = []

    for (const imgData of params.images) {
      let url = imgData
      if (typeof miniTool.writeTempFile === "function") {
        try {
          const temp = await miniTool.writeTempFile({ data: imgData })
          if (temp.filePath) {
            url = temp.filePath
          }
        } catch {
          // 回退使用 base64
        }
      }
      imageResources.push({ url })
    }

    await miniTool.postNote({
      title: params.title || "三联无缝全景图",
      content:
        params.content ||
        "用 Spliter 生成的三联画卷，滑动查看连贯全景长图效果~ 📸 #全景图 #三联图 #摄影",
      pageType: "photo_publish",
      mediaInfo: {
        image_resources: imageResources,
      },
    })

    return { success: true, message: "已成功唤起小红书发布页" }
  } catch (err: unknown) {
    const errMsg =
      err && typeof err === "object" && "errMsg" in err
        ? String((err as { errMsg: string }).errMsg)
        : err instanceof Error
        ? err.message
        : "唤起发布页失败"
    return { success: false, message: errMsg }
  }
}

/**
 * 查询当前用户与小工具作者的关注状态
 * -1: 接口失败；0: 未关注；1: 已关注；2: 作者本人
 */
export async function fetchAuthorFollowStatus(): Promise<number> {
  const miniTool = getMiniTool()
  if (!miniTool || typeof miniTool.getFollowStatus !== "function") {
    return -1
  }

  try {
    const res = await miniTool.getFollowStatus()
    return typeof res.follow_status === "number" ? res.follow_status : -1
  } catch {
    return -1
  }
}

/**
 * 引导关注当前小工具作者
 */
export async function followToolAuthor(): Promise<{
  success: boolean
  status: number
  message: string
}> {
  const miniTool = getMiniTool()
  if (!miniTool || typeof miniTool.followAuthor !== "function") {
    return {
      success: false,
      status: -1,
      message: "关注功能仅在小红书容器内支持",
    }
  }

  try {
    const res = await miniTool.followAuthor()
    const status = res.follow_status
    if (status === 1) {
      return { success: true, status: 1, message: "关注成功" }
    } else if (status === 2) {
      return { success: true, status: 2, message: "您是当前小工具作者本人" }
    } else {
      return { success: false, status, message: "关注未完成" }
    }
  } catch (err: unknown) {
    const errCode =
      err && typeof err === "object" && "errCode" in err
        ? Number((err as { errCode: number }).errCode)
        : undefined

    if (errCode === 20002) {
      return { success: false, status: 0, message: "已取消关注" }
    }
    if (errCode === 15404) {
      return { success: false, status: 0, message: "今日关注引导次数已达上限" }
    }
    if (errCode === 10003) {
      return { success: false, status: 0, message: "关注流程仍在进行中" }
    }

    const errMsg =
      err && typeof err === "object" && "errMsg" in err
        ? String((err as { errMsg: string }).errMsg)
        : "关注操作失败"
    return { success: false, status: -1, message: errMsg }
  }
}
