import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'
import {
  endSession,
  getAccessToken,
  setTokens,
  subscribeToAuthChanges,
} from '../lib/auth'
import { encryptedLocalStorage } from '../lib/storage'
import { AuthContext } from './authContextStore'
import type { AuthResponse, CurrentUserDto } from '../types/apiTypes'

const USER_STORAGE_KEY = 'user'

const getStoredUser = (): CurrentUserDto | null => {
  try {
    return encryptedLocalStorage.getItem<CurrentUserDto>(USER_STORAGE_KEY)
  } catch {
    return null
  }
}

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(getAccessToken()),
  )
  const [currentUser, setCurrentUser] = useState<CurrentUserDto | null>(getStoredUser)
  const queryClient = useQueryClient()

  const fetchCurrentUser = useCallback(async () => {
    if (!getAccessToken()) {
      setCurrentUser(null)
      encryptedLocalStorage.removeItem(USER_STORAGE_KEY)
      return null
    }

    try {
      const res = await apiFetch<CurrentUserDto>('/auth/me', { silentErrors: true })
      if (res.isSuccess && res.data) {
        setCurrentUser(res.data)
        encryptedLocalStorage.setItem(USER_STORAGE_KEY, res.data)
        return res.data
      }
    } catch {
      // ignore
    }
    return null
  }, [])

  useEffect(() => {
    return subscribeToAuthChanges(() => {
      const authenticated = Boolean(getAccessToken())
      setIsAuthenticated(authenticated)
      if (!authenticated) {
        setCurrentUser(null)
        encryptedLocalStorage.removeItem(USER_STORAGE_KEY)
        queryClient.clear()
      } else {
        fetchCurrentUser()
      }
    })
  }, [queryClient, fetchCurrentUser])

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser()
    }
  }, [isAuthenticated, fetchCurrentUser])

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      const result = await apiFetch<AuthResponse>('/auth/login/credentials', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })

      if (result.isSuccess && result.data) {
        const { accessToken, refreshToken, user } = result.data

        setTokens(accessToken, refreshToken)
        queryClient.clear()

        if (user) {
          setCurrentUser(user)
          encryptedLocalStorage.setItem(USER_STORAGE_KEY, user)
        } else {
          await fetchCurrentUser()
        }

        setIsAuthenticated(true)
        return true
      }

      return false
    },
    [queryClient, fetchCurrentUser],
  )

  const logout = useCallback(() => {
    endSession()
    encryptedLocalStorage.removeItem(USER_STORAGE_KEY)
    queryClient.clear()
    setIsAuthenticated(false)
    setCurrentUser(null)
  }, [queryClient])

  const value = useMemo(
    () => ({
      isAuthenticated,
      currentUser,
      login,
      logout,
    }),
    [isAuthenticated, currentUser, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
