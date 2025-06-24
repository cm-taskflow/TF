import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LogOut, Users, FileText, BarChart3, Plus } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: FileText },
  ]

  const isActive = (href: string) => {
    return location.pathname === href || (href !== '/' && location.pathname.startsWith(href))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold">TF Project</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                          isActive(item.href)
                            ? 'bg-indigo-700 text-white'
                            : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                {/* Quick Actions */}
                <Link
                  to="/clients/new"
                  className="bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Client
                </Link>
                <Link
                  to="/tasks/new"
                  className="bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Task
                </Link>
                
                {/* User Info */}
                <div className="text-indigo-100 text-sm">
                  {user?.email}
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-indigo-100 hover:text-white flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}