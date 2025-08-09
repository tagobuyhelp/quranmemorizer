import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  BookOpen, Users, Home, GraduationCap, Crown, Menu, TrendingUp, 
  Building2, CreditCard, UserCheck, MessageSquare, Calendar,
  FileText, Settings, Bell, BarChart3, UserPlus, School,
  BookMarked, Mic, Headphones, Award, Clock, Target, LogIn, LogOut
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useAuthContext } from "@/contexts/auth";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Role-based color schemes using Hafizo brand colors
const roleColors = {
  "super-admin": {
    primary: "bg-slate-800",
    secondary: "bg-slate-700",
    accent: "text-slate-100",
    hover: "hover:bg-slate-700",
    brand: "hafizo-primary"
  },
  "madrasah-admin": {
    primary: "bg-hafizo-primary",
    secondary: "bg-hafizo-primary-light",
    accent: "text-white",
    hover: "hover:bg-hafizo-primary-light",
    brand: "hafizo-primary"
  },
  "teacher": {
    primary: "bg-hafizo-primary",
    secondary: "bg-hafizo-primary-light",
    accent: "text-white",
    hover: "hover:bg-hafizo-primary-light",
    brand: "hafizo-primary"
  },
  "parent": {
    primary: "bg-hafizo-primary",
    secondary: "bg-hafizo-primary-light",
    accent: "text-white",
    hover: "hover:bg-hafizo-primary-light",
    brand: "hafizo-primary"
  },
  "student": {
    primary: "bg-hafizo-primary",
    secondary: "bg-hafizo-primary-light",
    accent: "text-white",
    hover: "hover:bg-hafizo-primary-light",
    brand: "hafizo-primary"
  }
};

// Navigation items for each role
const getNavigationItems = (role: string) => {
  const baseItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", active: false }
  ];

  switch (role) {
    case "super-admin":
      return [
        { href: "/admin/dashboard", icon: TrendingUp, label: "Dashboard" },
        { href: "/admin/organizations", icon: Building2, label: "Organizations" },
        { href: "/admin/users", icon: Users, label: "Users" },
        { href: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
        { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
        { href: "/admin/system-settings", icon: Settings, label: "System Settings" }
      ];

    case "madrasah-admin":
      return [
        { href: "/admin/dashboard", icon: TrendingUp, label: "Dashboard" },
        { href: "/admin/students", icon: Users, label: "Students" },
        { href: "/admin/teachers", icon: School, label: "Teachers" },
        { href: "/admin/classes", icon: BookMarked, label: "Classes/Sections" },
        { href: "/admin/attendance", icon: UserCheck, label: "Attendance" },
        { href: "/admin/reports", icon: FileText, label: "Reports" },
        { href: "/admin/finance", icon: CreditCard, label: "Finance" },
        { href: "/admin/messaging", icon: MessageSquare, label: "Messaging" },
        { href: "/admin/settings", icon: Settings, label: "Settings" }
      ];

    case "teacher":
      return [
        { href: "/teacher/dashboard", icon: Home, label: "Dashboard" },
        { href: "/teacher/attendance", icon: UserCheck, label: "Attendance" },
        { href: "/teacher/hifz", icon: BookOpen, label: "Hifz" },
        { href: "/teacher/najera", icon: Users, label: "Najera" },
        { href: "/teacher/noorani", icon: GraduationCap, label: "Noorani" },
        { href: "/teacher/khatm", icon: Crown, label: "Khatm" },
        { href: "/teacher/students", icon: Users, label: "My Students" },
        { href: "/teacher/reports", icon: FileText, label: "Reports" },
        { href: "/teacher/messaging", icon: MessageSquare, label: "Messages" },
      ];

    case "parent":
      return [
        { href: "/parent/dashboard", icon: Home, label: "Dashboard" },
        { href: "/parent/attendance", icon: UserCheck, label: "Attendance" },
        { href: "/parent/progress", icon: TrendingUp, label: "Progress Reports" },
        { href: "/parent/hifz", icon: BookOpen, label: "Hifz Progress" },
        { href: "/parent/najera", icon: Users, label: "Najera Progress" },
        { href: "/parent/noorani", icon: GraduationCap, label: "Noorani Progress" },
        { href: "/parent/khatm", icon: Crown, label: "Khatm Progress" },
        { href: "/parent/messaging", icon: MessageSquare, label: "Messages" },
        { href: "/parent/finance", icon: CreditCard, label: "Finance" },
        { href: "/parent/notifications", icon: Bell, label: "Notifications" }
      ];

    case "student":
      return [
        { href: "/student/dashboard", icon: Home, label: "Dashboard" },
        { href: "/student/lessons", icon: BookOpen, label: "My Lessons" },
        { href: "/student/progress", icon: TrendingUp, label: "My Progress" },
        { href: "/student/schedule", icon: Calendar, label: "Schedule" },
        { href: "/student/achievements", icon: Award, label: "Achievements" }
      ];

    default:
      return baseItems;
  }
};

// Quick action items for each role
const getQuickActions = (role: string) => {
  switch (role) {
    case "super-admin":
      return [
        { href: "/admin/organizations/new", icon: Building2, label: "Add Organization" },
        { href: "/admin/users/new", icon: UserPlus, label: "Add User" }
      ];

    case "madrasah-admin":
      return [
        { href: "/admin/students/new", icon: UserPlus, label: "Add Student" },
        { href: "/admin/teachers/new", icon: School, label: "Add Teacher" },
        { href: "/admin/attendance/mark", icon: UserCheck, label: "Mark Attendance" }
      ];

    case "teacher":
      return [
        { href: "/teacher/attendance/mark", icon: UserCheck, label: "Mark Attendance" },
      ];

    case "parent":
      return [
        { href: "/parent/messaging/new", icon: MessageSquare, label: "Message Teacher" },
        { href: "/parent/finance/pay", icon: CreditCard, label: "Pay Fees" }
      ];

    case "student":
      return [
        { href: "/student/lessons/today", icon: Clock, label: "Today's Lessons" },
        { href: "/student/progress/view", icon: Target, label: "View Progress" }
      ];

    default:
      return [];
  }
};

export function RoleNavigation() {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, organization, currentRole } = useAuthContext();
  const queryClient = useQueryClient();
  
  if (!user || !currentRole) {
    return (
      <nav className="bg-hafizo-primary shadow-lg border-b border-hafizo-primary-dark sticky top-0 z-50 w-full">
        <div className="w-full max-w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <img src="/uploads/hafizo_white_bg_support.png" alt="Hafizo" className="h-8 w-auto" />
            <Button
              variant="outline"
              size="sm"
              className="border-white/70 text-white/90 hover:bg-white/15 hover:text-white rounded-full px-3"
              onClick={() => navigate("/login")}
            >
              <LogIn className="h-4 w-4 mr-1.5" />
              Login
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  const role = currentRole;
  const colors = roleColors[role as keyof typeof roleColors] || roleColors["teacher"];
  const navigationItems = getNavigationItems(role);
  const quickActions = getQuickActions(role);
  
  // Memoize derived data to avoid unnecessary recalculations
  const memoNavigationItems = useMemo(() => getNavigationItems(role), [role]);
  const memoQuickActions = useMemo(() => getQuickActions(role), [role]);
  
  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  function LiveClock() {
    const [now, setNow] = useState<Date>(new Date());
    useEffect(() => {
      const timerId = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timerId);
    }, []);
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return (
      <div className="bg-white/10 text-white px-3 py-1 rounded-md font-mono text-sm" aria-label="Current time">
        {timeString}
      </div>
    );
  }

  const logout = useCallback(async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch {}
    await queryClient.clear();
    navigate("/login");
  }, [navigate, queryClient]);

  // Update active states
  const itemsWithActive = useMemo(() => memoNavigationItems.map(item => ({
    ...item,
    active: location === item.href || location.startsWith(item.href + "/")
  })), [memoNavigationItems, location]);

  const NavButton = memo(({ href, icon: Icon, label, active }: any) => (
    <Link href={href}>
      <Button 
        variant={active ? "default" : "ghost"}
        size="sm"
        className={`flex items-center space-x-2 touch-target w-full justify-start md:w-auto md:justify-center px-4 py-2 ${
          active 
            ? "bg-hafizo-primary-dark text-white"
            : "text-white/90 hover:bg-hafizo-primary-light hover:text-white"
        }`}
        onClick={closeMobile}
      >
        <Icon className="h-4 w-4" />
        <span className="md:inline">{label}</span>
      </Button>
    </Link>
  ));

  // Mobile sheet-friendly variants (light background)
  const MobileNavItem = memo(({ href, icon: Icon, label, active }: any) => (
    <Link href={href}>
      <Button
        variant={active ? "secondary" : "ghost"}
        size="sm"
        className={`flex items-center space-x-2 w-full justify-start px-4 py-3 rounded-lg ${
          active ? "bg-hafizo-primary/10 text-gray-900" : "text-gray-800 hover:bg-gray-100"
        }`}
        onClick={closeMobile}
      >
        <Icon className="h-4 w-4 text-hafizo-primary" />
        <span>{label}</span>
      </Button>
    </Link>
  ));

  const QuickActionButton = memo(({ href, icon: Icon, label }: any) => (
    <Link href={href}>
      <Button 
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 touch-target w-full justify-start md:w-auto md:justify-center border-white/70 text-white/90 hover:bg-white/15 hover:text-white px-4 py-2"
        onClick={closeMobile}
      >
        <Icon className="h-4 w-4" />
        <span className="md:inline">{label}</span>
      </Button>
    </Link>
  ));

  const MobileQuickAction = memo(({ href, icon: Icon, label }: any) => (
    <Link href={href}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 w-full justify-start border-hafizo-primary text-hafizo-primary hover:bg-hafizo-primary/10 px-4 py-2"
        onClick={closeMobile}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Button>
    </Link>
  ));

  return (
    <nav className="bg-hafizo-primary shadow-lg border-b border-hafizo-primary-dark sticky top-0 z-50 w-full">
      <div className="w-full max-w-full px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Organization Info */}
          <div className="flex items-center space-x-4">
            <img
              src="/uploads/logo_header.png"
              alt="Hafizo"
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              
            </div>
            
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3 flex-1 justify-center">
            <div className="flex items-center space-x-2">
              {itemsWithActive.map((item) => (
                <NavButton key={item.href} {...item} />
              ))}
            </div>
            
            {/* Quick Actions */}
            {memoQuickActions.length > 0 && (
              <div className="ml-6 pl-6 border-l border-gray-300">
                <div className="flex items-center space-x-2">
                  {memoQuickActions.map((action) => (
                    <QuickActionButton key={action.href} {...action} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right side utilities (desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <LiveClock />
            <Button
              variant="outline"
              size="sm"
              className="border-white/70 text-white/90 hover:bg-white/15 hover:text-white"
              onClick={logout}
            >
              Logout
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-hafizo-primary-light/40 touch-target p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 max-w-sm bg-white p-0">
                <div className="h-full flex flex-col">
                  {/* Fixed header */}
                  <div className="px-4 pt-5 pb-3 border-b border-gray-200">
                    <div className="grid grid-cols-1 items-center gap-2">
                      <img src="/uploads/hafizo_white_bg_support.png" alt="Hafizo" className="h-8 w-auto" />
                      
                        <p className="text-xs text-gray-500">{(role.charAt(0).toUpperCase() + role.slice(1).replace("-"," "))} Panel</p>
                    </div>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                    {/* Main Navigation */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Main Menu</h3>
                      {itemsWithActive.map((item) => (
                        <MobileNavItem key={item.href} {...item} />
                      ))}
                    </div>

                    {/* Quick Actions */}
                    {memoQuickActions.length > 0 && (
                      <div className="pt-2">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Quick Actions</h3>
                        <div className="mt-3 grid grid-cols-1 gap-2">
                          {memoQuickActions.map((action) => (
                            <MobileQuickAction key={action.href} {...action} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Sticky footer with logout */}
                  <div className="border-t border-gray-200 px-4 py-3 bg-white/95 backdrop-blur sticky bottom-0">
                    <Button onClick={logout} className="w-full" variant="destructive" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function MobileBottomBar() {
  const [location] = useLocation();
  const { currentRole } = useAuthContext();
  
  if (!currentRole) return null;

  const navigationItems = getNavigationItems(currentRole);
  const colors = roleColors[currentRole as keyof typeof roleColors] || roleColors["teacher"];

  // Show only first 5 items for mobile bottom bar
  const mobileItems = navigationItems.slice(0, 5);
  const gridColsClass = useMemo(() => {
    const classes = ["grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4", "grid-cols-5"];
    const index = Math.max(1, Math.min(mobileItems.length, 5)) - 1;
    return classes[index];
  }, [mobileItems.length]);

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-gray-200 shadow-lg z-50 pb-[env(safe-area-inset-bottom)]">
      <div className={`grid ${gridColsClass} gap-1 px-2 py-2`}>
        {mobileItems.map(({ href, icon: Icon, label }) => {
          const active = location === href || location.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <div className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg transition-colors duration-200 ${
                active 
                  ? "bg-hafizo-primary text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
                <Icon className={`mb-1 ${active ? "text-white" : "text-gray-700"} h-5 w-5`} />
                <span className="text-[11px] leading-none font-medium">{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 