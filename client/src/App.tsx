import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Users, Home, GraduationCap, Crown, Menu, TrendingUp, Building2, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import HifzEntry from "@/pages/hifz-entry";
import NajeraEntry from "@/pages/najera-entry";
import NooraniEntry from "@/pages/noorani-entry";
import KhatmEntry from "@/pages/khatm-entry";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import BillingPage from "@/pages/billing";
import SettingsPage from "@/pages/settings";
import AdminUsersPage from "@/pages/admin-users";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminOrganizationsPage from "@/pages/admin-organizations";
import AdminSubscriptionsPage from "@/pages/admin-subscriptions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Spinner } from "@/components/ui/spinner";
import { AuthProvider, useAuthContext } from "@/contexts/auth";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { unauthorized, isLoading } = useAuthContext();
  const [, navigate] = useLocation();
  useEffect(() => {
    if (!isLoading && unauthorized) navigate("/login");
  }, [unauthorized, isLoading]);
  if (isLoading) return <div className="flex items-center justify-center p-10"><Spinner className="h-6 w-6" /></div>;
  if (unauthorized) return null;
  return children;
}

function RequireRole({ roles, children }: { roles: Array<string>; children: JSX.Element }) {
  const { user, unauthorized, isLoading } = useAuthContext();
  const [, navigate] = useLocation();
  useEffect(() => {
    if (!isLoading && unauthorized) navigate("/login");
    else if (!isLoading && user && !roles.includes(user.role)) navigate("/");
  }, [unauthorized, user, isLoading]);
  if (isLoading || !user) return <div className="flex items-center justify-center p-10"><Spinner className="h-6 w-6" /></div>;
  if (!roles.includes(user.role)) return null;
  return children;
}

function initials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "U";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, organization } = useAuthContext();
  const qc = useQueryClient();
  const [, navigate] = useLocation();

  async function logout() {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch {}
    await qc.clear();
    navigate("/login");
  }
  
  const baseItems = [
    { href: "/hifz", icon: Home, label: "Hifz Daily", active: location === "/hifz" || location === "/" },
    { href: "/khatm", icon: Crown, label: "Khatm", active: location === "/khatm" },
    { href: "/najera", icon: Users, label: "Najera", active: location === "/najera" },
    { href: "/noorani", icon: GraduationCap, label: "Noorani", active: location === "/noorani" },
  ];

  const headTeacherItems = [
    ...baseItems,
    { href: "/settings", icon: Menu, label: "Settings", active: location === "/settings" },
  ];

  const adminItems = [
    ...headTeacherItems,
    { href: "/admin", icon: TrendingUp, label: "Dashboard", active: location === "/admin" },
    { href: "/admin/organizations", icon: Building2, label: "Organizations", active: location === "/admin/organizations" },
    { href: "/admin/users", icon: Users, label: "Users", active: location === "/admin/users" },
    { href: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions", active: location === "/admin/subscriptions" },
    { href: "/billing", icon: Crown, label: "Billing", active: location === "/billing" },
  ];

  const navigationItems = user?.role === "admin" ? adminItems : user?.role === "head-teacher" ? headTeacherItems : baseItems;

  const NavButton = ({ href, icon: Icon, label, active }: any) => (
    <Link href={href}>
      <Button 
        variant={active ? "default" : "ghost"}
        size="sm"
        className="flex items-center space-x-2 touch-target w-full justify-start md:w-auto md:justify-center"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Icon className="h-4 w-4" />
        <span className="md:inline">{label}</span>
      </Button>
    </Link>
  );
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-white p-2 rounded-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-gray-900">{organization?.name || "Quran Learning Center"}</h1>
              <p className="text-xs text-gray-600">{organization?.description || "Progress Tracking System"}</p>
            </div>
            <div className="sm:hidden">
              <h1 className="font-semibold text-gray-900 text-sm">{organization?.name || "QLC"}</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <NavButton key={item.href} {...item} />
            ))}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm hidden lg:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="text-xs">Role: {user.role}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="ml-2 flex items-center gap-2">
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="touch-target">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-2 mt-6">
                  <div className="mb-4">
                    <h2 className="font-semibold text-gray-900">Navigation</h2>
                    <p className="text-xs text-gray-600">Select a section</p>
                  </div>
                  {navigationItems.map((item) => (
                    <NavButton key={item.href} {...item} />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileBottomBar() {
  const [location] = useLocation();
  const { user } = useAuthContext();

  const baseItems = [
    { href: "/hifz", icon: Home, label: "Hifz" },
    { href: "/najera", icon: Users, label: "Najera" },
    { href: "/noorani", icon: GraduationCap, label: "Noorani" },
    { href: "/khatm", icon: Crown, label: "Khatm" },
  ];
  const headTeacherItems = [...baseItems, { href: "/settings", icon: Menu, label: "Settings" }];
  const adminItems = [...headTeacherItems, { href: "/admin", icon: TrendingUp, label: "Dashboard" }, { href: "/admin/organizations", icon: Building2, label: "Organizations" }, { href: "/admin/users", icon: Users, label: "Users" }, { href: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" }, { href: "/billing", icon: Crown, label: "Billing" }];
  const items = user?.role === "admin" ? adminItems : user?.role === "head-teacher" ? headTeacherItems : baseItems;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t shadow-sm z-50">
      <div className="grid grid-cols-4 sm:grid-cols-5">
        {items.slice(0, 5).map(({ href, icon: Icon, label }) => {
          const active = location === href || (href === "/hifz" && location === "/");
          return (
            <Link key={href} href={href}>
              <a className={`flex flex-col items-center justify-center py-2 text-xs ${active ? "text-primary" : "text-gray-600"}`}>
                <Icon className="h-5 w-5" />
                <span className="mt-0.5">{label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Router() {
  return (
    <div className="min-h-screen bg-neutral pb-16">
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route>
          <Navigation />
          <Switch>
            <Route path="/" component={() => (
              <RequireAuth>
                <HifzEntry />
              </RequireAuth>
            )} />
            <Route path="/hifz" component={() => (
              <RequireAuth>
                <HifzEntry />
              </RequireAuth>
            )} />
            <Route path="/khatm" component={() => (
              <RequireAuth>
                <KhatmEntry />
              </RequireAuth>
            )} />
            <Route path="/najera" component={() => (
              <RequireAuth>
                <NajeraEntry />
              </RequireAuth>
            )} />
            <Route path="/noorani" component={() => (
              <RequireAuth>
                <NooraniEntry />
              </RequireAuth>
            )} />
            <Route path="/billing" component={() => (
              <RequireAuth>
                <RequireRole roles={["admin"]}>
                  <BillingPage />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/settings" component={() => (
              <RequireAuth>
                <RequireRole roles={["admin", "head-teacher"]}>
                  <SettingsPage />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin" component={() => (
              <RequireAuth>
                <RequireRole roles={["admin"]}>
                  <AdminDashboard />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/organizations" component={() => (
              <RequireAuth>
                <RequireRole roles={["admin"]}>
                  <AdminOrganizationsPage />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/users" component={() => (
              <RequireAuth>
                <RequireRole roles={["admin"]}>
                  <AdminUsersPage />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/subscriptions" component={() => (
              <RequireAuth>
                <RequireRole roles={["admin"]}>
                  <AdminSubscriptionsPage />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route component={NotFound} />
          </Switch>
          <RequireAuth>
            <MobileBottomBar />
          </RequireAuth>
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

