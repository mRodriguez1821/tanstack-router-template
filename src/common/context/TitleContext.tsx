import React, { useState } from 'react'
import { useLocation } from "@tanstack/react-router";
import { TitleContext } from './titleContextStore'

const defaultTitles: Record<string, string> = {
  '/': '',
}

const getFallbackTitle = (pathname: string) => {
  for (const key in defaultTitles) {
    if (pathname.startsWith(key)) {
      return defaultTitles[key]
    }
  }
  return 'Dashboard'
}

export const TitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [customTitle, setCustomTitle] = useState<string | null>(null)
  const location = useLocation()
  const [prevPathname, setPrevPathname] = useState(location.pathname)

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname)
    setCustomTitle(null)
  }

  const title = customTitle || getFallbackTitle(location.pathname)

  return (
    <TitleContext.Provider value={{ title, setTitle: setCustomTitle }}>
      {children}
    </TitleContext.Provider>
  )
}
