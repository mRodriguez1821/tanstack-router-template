import { createContext } from 'react'

export type TitleContextType = {
  title: string
  setTitle: (title: string) => void
}

export const TitleContext = createContext<TitleContextType | undefined>(undefined)
