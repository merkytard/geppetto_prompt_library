
    import React from 'react';
    import { NavLink, useLocation } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Home, LayoutDashboard, Columns, CheckSquare, Brain, Settings, FolderKanban, Bot, Users, MessageSquare, Zap } from 'lucide-react';
    import { cn } from '@/lib/utils';
    import { Button } from '@/components/ui/button';

    const mainNavItems = [
      { href: '/projects', icon: FolderKanban, label: 'Projects' },
      { href: '/kanban', icon: Columns, label: 'Kanban Board' },
      { href: '/board', icon: LayoutDashboard, label: 'App Portfolio' },
      { href: '/jira', icon: CheckSquare, label: 'Jira Overview' },
      { href: '/nodebase', icon: Brain, label: 'NodeBase Canvas' },
    ];
    
    const secondaryNavItems = [
      { href: '/modules', icon: Bot, label: 'AI Modules' },
      // { href: '/community', icon: Users, label: 'Community (Soon)' },
      // { href: '/feedback', icon: MessageSquare, label: 'Feedback (Soon)' },
    ];

    const settingsNavItem = { href: '/settings', icon: Settings, label: 'Settings' };


    const sidebarVariants = {
      open: { width: '260px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
      closed: { width: '60px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };

    const itemVariants = {
      open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 20, delay: 0.1 } },
      closed: { opacity: 0, x: -20, transition: { duration: 0.1 } },
    };
    
    const iconVariants = {
      open: { rotate: 0 },
      closed: { rotate: 0 }, // Can add rotate effect if desired for closed state
    };

    const Sidebar = ({ isOpen, toggleSidebar }) => {
      const location = useLocation();

      const NavListItem = ({ item, isSidebarOpen }) => (
         <NavLink
            key={item.label}
            to={item.href}
            onClick={() => { if (window.innerWidth < 768 && isSidebarOpen) toggleSidebar(); }} // Close sidebar on mobile after click
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-50 group',
                isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' : 'text-muted-foreground hover:text-foreground',
                isSidebarOpen ? 'px-3 py-2.5' : 'p-3 justify-center'
              )
            }
          >
            <motion.div variants={iconVariants} className="flex-shrink-0">
              <item.icon className={cn("h-5 w-5", isSidebarOpen ? "mr-3" : "mr-0")} />
            </motion.div>
            {isSidebarOpen && <motion.span variants={itemVariants} className="truncate group-hover:text-primary">{item.label}</motion.span>}
            {!isSidebarOpen && (
              <span className="sr-only">{item.label}</span>
            )}
          </NavLink>
      );


      return (
        <motion.div
          variants={sidebarVariants}
          initial={false}
          animate={isOpen ? 'open' : 'closed'}
          className={cn(
            "bg-card text-card-foreground h-screen flex flex-col border-r shadow-lg",
            "fixed top-0 left-0 z-50 md:relative md:translate-x-0", // Fixed for mobile, relative for desktop
            !isOpen && "transform -translate-x-full md:translate-x-0" // Slide out on mobile when closed
          )}
          style={{
             // Ensure sidebar is above overlay on mobile when open
            transform: isOpen && window.innerWidth < 768 ? 'translateX(0)' : (!isOpen && window.innerWidth < 768 ? 'translateX(-100%)' : undefined),
          }}
        >
          <div className={cn("flex items-center p-3 border-b h-16", isOpen ? "justify-between" : "justify-center")}>
            {isOpen && (
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                 <Zap className="h-7 w-7 text-primary" />
                 <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              </motion.div>
            )}
             {/* This button is primarily for md:hidden, but toggleSidebar controls overall state */}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn("md:hidden", isOpen ? "" : "ml-auto")}>
              <Home className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-grow p-2 space-y-1.5 overflow-y-auto">
            <div className="space-y-1">
                {mainNavItems.map((item) => <NavListItem key={item.href} item={item} isSidebarOpen={isOpen} />)}
            </div>
            
            {secondaryNavItems.length > 0 && (
                 <>
                    <hr className="my-3 border-border/50" />
                    <div className="space-y-1">
                        {secondaryNavItems.map((item) => <NavListItem key={item.href} item={item} isSidebarOpen={isOpen} />)}
                    </div>
                 </>
            )}
          </nav>

          <div className="p-2 border-t">
            <NavListItem item={settingsNavItem} isSidebarOpen={isOpen} />
            {isOpen && (
              <motion.div variants={itemVariants} className="px-3 pt-3">
                <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Hostinger</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    };

    export default Sidebar;
  