import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Home, GraduationCap, Crown } from "lucide-react";
import HifzEntry from "@/pages/hifz-entry";
import NajeraEntry from "@/pages/najera-entry";
import NooraniEntry from "@/pages/noorani-entry";
import KhatmEntry from "@/pages/khatm-entry";
import NotFound from "@/pages/not-found";

function Navigation() {
  const [location] = useLocation();
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-white p-2 rounded-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Quran Learning Center</h1>
              <p className="text-xs text-gray-600">Progress Tracking System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href="/hifz">
              <Button 
                variant={location === "/hifz" || location === "/" ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Hifz Daily</span>
              </Button>
            </Link>
            <Link href="/khatm">
              <Button 
                variant={location === "/khatm" ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Crown className="h-4 w-4" />
                <span>Khatm Recitation</span>
              </Button>
            </Link>
            <Link href="/najera">
              <Button 
                variant={location === "/najera" ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Najera Section</span>
              </Button>
            </Link>
            <Link href="/noorani">
              <Button 
                variant={location === "/noorani" ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Noorani Qaida</span>
              </Button>
            </Link>
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
        <Route path="/" component={HifzEntry} />
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
