export interface XhsRect {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

export interface XhsWindowInfo {
  errMsg: string
  pixelRatio?: number
  screenWidth?: number
  screenHeight?: number
  windowWidth?: number
  windowHeight?: number
  statusBarHeight?: number
  screenTop?: number
  safeArea?: XhsRect
  menuButtons?: {
    back?: XhsRect | null
    share?: XhsRect | null
    me?: XhsRect | null
  }
}

export interface XhsMiniTool {
  getWindowInfo?(options?: {
    success?: (res: XhsWindowInfo) => void
    fail?: (err: { errMsg: string }) => void
    complete?: () => void
  }): Promise<XhsWindowInfo>

  postNote(options: {
    title?: string
    content?: string
    pageType?: "photo_publish" | "video_publish" | "slides_edit"
    mediaInfo: {
      image_resources?: Array<{ url: string }>
      video_resources?: { video_url: string; cover_url?: string }
      live_photo_sources?: Array<{ url: string; video_url: string }>
    }
    success?: (res: { errMsg: string }) => void
    fail?: (err: { errMsg: string; errCode?: number }) => void
    complete?: () => void
  }): Promise<{ errMsg: string }>

  saveImageToPhotosAlbum(options: {
    filePath: string
    success?: (res: { errMsg: string }) => void
    fail?: (err: { errMsg: string; errCode?: number }) => void
    complete?: () => void
  }): Promise<{ errMsg: string }>

  writeTempFile?(options: {
    data: string
    success?: (res: { errMsg: string; filePath: string }) => void
    fail?: (err: { errMsg: string; errCode?: number }) => void
    complete?: () => void
  }): Promise<{ errMsg: string; filePath: string }>

  followAuthor(options?: {
    success?: (res: { errMsg: string; follow_status: number }) => void
    fail?: (err: { errMsg: string; errCode?: number }) => void
    complete?: () => void
  }): Promise<{ errMsg: string; follow_status: number }>

  getFollowStatus(options?: {
    success?: (res: { errMsg: string; follow_status: number }) => void
    fail?: (err: { errMsg: string; errCode?: number }) => void
    complete?: () => void
  }): Promise<{ errMsg: string; follow_status: number }>
}

declare global {
  interface Window {
    xhs?: {
      miniTool?: XhsMiniTool
    }
  }
}
