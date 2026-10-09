import { createContext } from 'react'
import type { CurrentUserDto } from '../types/apiTypes'

export type AuthContextValue = {
  isAuthenticated: boolean
  currentUser: CurrentUserDto | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
