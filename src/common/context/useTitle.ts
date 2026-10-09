import { useContext } from 'react'
import { TitleContext } from './titleContextStore'

export const useTitle = () => {
  const context = useContext(TitleContext)
  if (!context) throw new Error('useTitle must be used within TitleProvider')
  return context
}
