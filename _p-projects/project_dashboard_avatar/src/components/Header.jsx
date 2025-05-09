
    import React from 'react';
    import { NavLink, useLocation } from 'react-router-dom';
    import { Menu, Sun, Moon, Search, Settings, LayoutDashboard, Columns, CheckSquare, Brain, FolderKanban, Bot, Zap } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useTheme } from '@/context/ThemeProvider';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
      DropdownMenuSeparator,
      DropdownMenuGroup,
      DropdownMenuLabel
    } from "@/components/ui/dropdown-menu";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import { cn } from '@/lib/utils';

    const mainNavItems = [
      { href: '/projects', icon: FolderKanban, label: 'Projects' },
      { href: '/kanban', icon: Columns, label: 'Kanban' },
      { href: '/board', icon: LayoutDashboard, label: 'Board' },
      { href: '/jira', icon: CheckSquare, label: 'Jira' },
      { href: '/nodebase', icon: Brain, label: 'NodeBase' },
      { href: '/modules', icon: Bot, label: 'Modules' },
    ];

    const Header = ({ toggleNodeBaseSidebar, isNodeBaseSidebarOpen }) => { // Added props for NodeBase sidebar
      const { theme, setTheme } = useTheme();
      const location = useLocation();
      const isNodeBaseActive = location.pathname.startsWith('/nodebase');

      return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container-fluid flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-6">
            
            <div className="flex items-center gap-2">
              {/* Hamburger menu for NodeBase specific sidebar, or general mobile nav if needed */}
              {isNodeBaseActive && typeof toggleNodeBaseSidebar === 'function' && (
                <Button variant="ghost" size="icon" onClick={toggleNodeBaseSidebar} className="md:hidden"> {/* Show on mobile for NodeBase */}
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle NodeBase Panel</span>
                </Button>
              )}
              {!isNodeBaseActive && ( /* General Mobile Menu Toggle - if we re-introduce a mobile-only main nav */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open Main Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 md:hidden">
                    <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {mainNavItems.map((item) => (
                      <DropdownMenuItem key={item.label} asChild>
                        <NavLink to={item.href} className="w-full flex items-center">
                          <item.icon className="mr-2 h-4 w-4" /> {item.label}
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                        <NavLink to="/settings" className="w-full flex items-center">
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </NavLink>
                      </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <NavLink to="/" className="flex items-center space-x-2">
                  <Zap className="h-7 w-7 text-primary" /> {/* Changed icon to Zap */}
                  <span className="font-bold text-xl">Horizons</span>
              </NavLink>
            </div>

            <nav className="hidden md:flex flex-grow items-center justify-center gap-1 lg:gap-2 px-4">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-muted hover:text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-50',
                      isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex flex-shrink-0 items-center justify-end space-x-2 md:space-x-4">
              <div className="relative hidden sm:block w-full max-w-[180px] lg:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 h-9 text-sm" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="h-9 w-9">
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span className="sr-only">Toggle Theme</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://avatar.vercel.sh/Hostinger-Horizons.png?text=HH" alt="User Avatar" />
                      <AvatarFallback>HH</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <NavLink to="/projects" className="w-full flex items-center">
                        <FolderKanban className="mr-2 h-4 w-4" /> My Projects
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink to="/settings" className="w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    Profile (Soon)
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    Billing (Soon)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    Log out (Soon)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      );
    };

    export default Header;
  