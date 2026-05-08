'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse">
        <div className="w-12 h-12 rounded-lg bg-primary/20" />
      </div>
    </div>
  )
}
