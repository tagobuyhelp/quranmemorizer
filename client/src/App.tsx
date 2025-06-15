import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Users, Home, GraduationCap, Crown, Menu, Zap } from "lucide-react";
import { useState } from "react";
import HifzEntry from "@/pages/hifz-entry";
import NajeraEntry from "@/pages/najera-entry";
import NooraniEntry from "@/pages/noorani-entry";
import KhatmEntry from "@/pages/khatm-entry";
import QuickEntry from "@/pages/quick-entry";
import NotFound from "@/pages/not-found";

function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { href: "/quick", icon: Zap, label: "Quick Entry", active: location === "/quick" },
    { href: "/hifz", icon: Home, label: "Hifz Daily", active: location === "/hifz" || location === "/" },
    { href: "/khatm", icon: Crown, label: "Khatm Recitation", active: location === "/khatm" },
    { href: "/najera", icon: Users, label: "Najera Section", active: location === "/najera" },
    { href: "/noorani", icon: GraduationCap, label: "Noorani Qaida", active: location === "/noorani" },
  ];

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
              <h1 className="font-semibold text-gray-900">Quran Learning Center</h1>
              <p className="text-xs text-gray-600">Progress Tracking System</p>
            </div>
            <div className="sm:hidden">
              <h1 className="font-semibold text-gray-900 text-sm">QLC</h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <NavButton key={item.href} {...item} />
            ))}
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

function Router() {
  return (
    <div className="min-h-screen bg-neutral">
      <Navigation />
      <Switch>
        <Route path="/" component={QuickEntry} />
        <Route path="/quick" component={QuickEntry} />
        <Route path="/hifz" component={HifzEntry} />
        <Route path="/khatm" component={KhatmEntry} />
        <Route path="/najera" component={NajeraEntry} />
        <Route path="/noorani" component={NooraniEntry} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
