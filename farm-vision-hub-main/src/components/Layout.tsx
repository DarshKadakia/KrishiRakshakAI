import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Warehouse,
  BarChart3,
  Camera,
  Menu,
  Wifi,
  WifiOff,
  Leaf,
  Landmark
} from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useSensorData } from '@/hooks/useSensorData';

/* ================= SIDEBAR ITEMS ================= */
const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/storage', label: 'Storage Room', icon: Warehouse },
  { to: '/mandi', label: 'Mandi Rates', icon: BarChart3 },
  { to: '/leaf-health', label: 'Leaf Health', icon: Camera },
  { to: '/schemes', label: 'Government Schemes', icon: Landmark },
];

const Layout = () => {
  const { connected } = useSensorData();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // 👈 DESKTOP COLLAPSE STATE

  const currentNav = navItems.find(n =>
    n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to)
  );

  const NavContent = () => (
    <nav className="flex flex-col gap-1 p-3">
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">
              KrishiRakshak AI
            </h1>
            <p className="text-xs text-sidebar-foreground/60">
              Smart Farm Dashboard
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`
          }
        >
          <item.icon className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <NavContent />

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2">
            {connected ? (
              <Wifi className="w-4 h-4 text-sensor-good" />
            ) : (
              <WifiOff className="w-4 h-4 text-sensor-danger" />
            )}
            {!collapsed && (
              <span className="text-xs text-sidebar-foreground/60">
                {connected ? 'MQTT Connected' : 'MQTT Disconnected'}
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* MOBILE MENU */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-sidebar">
                <NavContent />
              </SheetContent>
            </Sheet>

            {/* DESKTOP COLLAPSE BUTTON */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setCollapsed(prev => !prev)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <h2 className="text-lg font-semibold text-foreground">
              {currentNav?.label || 'Dashboard'}
            </h2>
          </div>

          {/* STATUS */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
              {connected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-sensor-good animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Live
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-sensor-danger" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Offline
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
