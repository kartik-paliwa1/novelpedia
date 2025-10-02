'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/dashboard/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { Bell, Settings, User, LogOut, BookOpen, PenTool, BarChart3 } from 'lucide-react';

export function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <PenTool className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Inkosei Dashboard</h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={() => handleNavigation('/dashboard')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </Button>
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={() => handleNavigation('/dashboard/novels')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                My Novels
              </Button>
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={() => handleNavigation('/dashboard/editor')}
              >
                <PenTool className="h-4 w-4 mr-2" />
                Write
              </Button>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}