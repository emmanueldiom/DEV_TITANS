'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Shield,
  AlertTriangle,
  BarChart3,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/dashboard/transactions', icon: Shield },
  { name: 'Alertes', href: '/dashboard/alerts', icon: AlertTriangle },
  { name: 'Analytique', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Équipe', href: '/dashboard/team', icon: Users },
  { name: 'Analyser', href: '/dashboard/analyze', icon: PlusCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-card border-border"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">FraudShield</h1>
              <p className="text-xs text-muted-foreground">Détection de fraude</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary">
                <span className="text-sm font-semibold">
                  {user?.name?.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 justify-start text-muted-foreground hover:text-sidebar-foreground"
                asChild
              >
                <Link href="/dashboard/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
