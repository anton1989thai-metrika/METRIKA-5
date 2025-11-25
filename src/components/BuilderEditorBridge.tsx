"use client"

import { useEffect } from "react"

const BUILDER_EDITOR_SRC = "https://cdn.builder.io/js/editor"

function isBuilderDesignMode(): boolean {
  if (typeof window === "undefined") return false

  const searchParams = new URLSearchParams(window.location.search)
  const builderMode = searchParams.get("builder.mode")
  const isDesignModeParam = builderMode === "design"
  const isEditorParam = searchParams.has("builder.preview") || searchParams.has("builder.editing")

  const referrer = document.referrer || ""
  const isEmbeddedInBuilder = window.self !== window.top && /\.builder\.(io|codes)/i.test(referrer)

  return isDesignModeParam || isEditorParam || isEmbeddedInBuilder
}

export default function BuilderEditorBridge() {
  useEffect(() => {
    if (!isBuilderDesignMode()) {
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${BUILDER_EDITOR_SRC}"]`)
    if (existingScript) {
      return
    }

    const previousBodyPointerEvents = document.body.style.pointerEvents
    const previousHtmlPointerEvents = document.documentElement.style.pointerEvents
    document.body.style.pointerEvents = document.body.style.pointerEvents || "auto"
    document.documentElement.style.pointerEvents = document.documentElement.style.pointerEvents || "auto"

    const script = document.createElement("script")
    script.src = BUILDER_EDITOR_SRC
    script.async = true
    script.dataset.builderEditor = "true"

    document.head.appendChild(script)

    return () => {
      script.remove()
      document.body.style.pointerEvents = previousBodyPointerEvents
      document.documentElement.style.pointerEvents = previousHtmlPointerEvents
    }
  }, [])

  return null
}
