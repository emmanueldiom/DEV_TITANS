'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'junior_analyst' | 'senior_analyst' | 'data_scientist' | 'admin' | 'compliance_officer'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for demo purposes
const mockUser: User = {
  id: 'USR-001',
  name: 'Amara Diallo',
  email: 'amara.diallo@fraudshield.com',
  role: 'senior_analyst',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication - accept any non-empty credentials
    if (email && password) {
      setUser({
        ...mockUser,
        email,
      })
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
