import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Users, Home, GraduationCap, Crown, Menu, TrendingUp, Building2, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Spinner } from "@/components/ui/spinner";
import { AuthProvider, useAuthContext } from "@/contexts/auth";
import { RoleNavigation, MobileBottomBar } from "@/components/role-navigation";

// Import existing pages
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

// Import new role-based pages (to be created)
import TeacherDashboard from "@/pages/teacher/dashboard";
import TeacherAttendance from "@/pages/teacher/attendance";
import TeacherStudents from "@/pages/teacher/students";
import TeacherReports from "@/pages/teacher/reports";
import TeacherMessaging from "@/pages/teacher/messaging";
import TeacherResources from "@/pages/teacher/resources";

import ParentDashboard from "@/pages/parent/dashboard";
import ParentAttendance from "@/pages/parent/attendance";
import ParentProgress from "@/pages/parent/progress";
import ParentMessaging from "@/pages/parent/messaging";
import ParentFinance from "@/pages/parent/finance";
import ParentNotifications from "@/pages/parent/notifications";

import StudentDashboard from "@/pages/student/dashboard";
import StudentLessons from "@/pages/student/lessons";
import StudentProgress from "@/pages/student/progress";
import StudentSchedule from "@/pages/student/schedule";
import StudentResources from "@/pages/student/resources";
import StudentAchievements from "@/pages/student/achievements";

import AdminStudents from "@/pages/admin/students";
import AdminTeachers from "@/pages/admin/teachers";
import AdminClasses from "@/pages/admin/classes";
import AdminAttendance from "@/pages/admin/attendance";
import AdminReports from "@/pages/admin/reports";
import AdminFinance from "@/pages/admin/finance";
import AdminMessaging from "@/pages/admin/messaging";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminSystemSettings from "@/pages/admin/system-settings";

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
  const { user, unauthorized, isLoading, currentRole } = useAuthContext();
  const [, navigate] = useLocation();
  useEffect(() => {
    if (!isLoading && unauthorized) navigate("/login");
    else if (!isLoading && user && currentRole && !roles.includes(currentRole)) navigate("/");
  }, [unauthorized, user, isLoading, currentRole]);
  if (isLoading || !user) return <div className="flex items-center justify-center p-10"><Spinner className="h-6 w-6" /></div>;
  if (!currentRole || !roles.includes(currentRole)) return null;
  return children;
}

function initials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "U";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function UserMenu() {
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

  if (!user) return null;

  // Format role name properly
  const formatRoleName = (role?: string) => {
    if (!role) return "Unknown";
    return role
      .replace("-", " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
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
        <DropdownMenuItem disabled className="text-xs">
          Role: {formatRoleName(user.currentRole)}
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="text-xs">
          Org: {organization?.name || "Unknown"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Router() {
  return (
    <div className="min-h-screen bg-neutral pb-16">
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route>
          <RequireAuth>
            <>
              <RoleNavigation />
            </>
          </RequireAuth>
          <Switch>
            {/* Legacy routes - redirect to role-based routes */}
            <Route path="/" component={() => {
              const { currentRole, user, isLoading } = useAuthContext();
              const [, navigate] = useLocation();
              
              useEffect(() => {
                console.log("Root route - currentRole:", currentRole, "user:", user, "isLoading:", isLoading);
                
                if (!isLoading && currentRole) {
                  console.log("Redirecting based on role:", currentRole);
                  switch (currentRole) {
                    case "super-admin":
                      navigate("/platform/dashboard");
                      break;
                    case "madrasah-admin":
                      navigate("/admin/dashboard");
                      break;
                    case "teacher":
                      navigate("/teacher/dashboard");
                      break;
                    case "parent":
                      navigate("/parent/dashboard");
                      break;
                    case "student":
                      navigate("/student/dashboard");
                      break;
                    default:
                      console.log("Unknown role, redirecting to login");
                      navigate("/login");
                  }
                } else if (!isLoading && !user) {
                  console.log("No user found, redirecting to login");
                  navigate("/login");
                }
              }, [currentRole, user, isLoading, navigate]);
              
              return (
                <div className="flex items-center justify-center p-10">
                  <div className="text-center">
                    <Spinner className="h-6 w-6 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your dashboard...</p>
                    {currentRole && <p className="text-sm text-gray-500 mt-2">Role: {currentRole}</p>}
                  </div>
                </div>
              );
            }} />
            
            {/* Legacy entry forms - keep for backward compatibility */}
            <Route path="/hifz" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher", "madrasah-admin"]}>
                  <HifzEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/khatm" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher", "madrasah-admin"]}>
                  <KhatmEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/najera" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher", "madrasah-admin"]}>
                  <NajeraEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/noorani" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher", "madrasah-admin"]}>
                  <NooraniEntry />
                </RequireRole>
              </RequireAuth>
            )} />

            {/* Super Admin + Madrasah Admin Routes */}
            <Route path="/admin/dashboard" component={() => (
              <RequireAuth>
                <RequireRole roles={["madrasah-admin"]}>
                  <AdminDashboard />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/platform/dashboard" component={() => (
              <RequireAuth>
                <RequireRole roles={["super-admin"]}>
                  <AdminDashboard />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/organizations" component={() => (
              <RequireAuth>
                <RequireRole roles={["super-admin"]}>
                  <AdminOrganizationsPage />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/users" component={() => (
              <RequireAuth>
                <RequireRole roles={["super-admin"]}>
                  <AdminUsersPage />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/subscriptions" component={() => (
              <RequireAuth>
                <RequireRole roles={["super-admin"]}>
                  <AdminSubscriptionsPage />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/analytics" component={() => (
              <RequireAuth>
                <RequireRole roles={["super-admin"]}>
                  <AdminAnalytics />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/system-settings" component={() => (
              <RequireAuth>
                <RequireRole roles={["super-admin"]}>
                  <AdminSystemSettings />
                </RequireRole>
              </RequireAuth>
            )} />

            {/* Madrasah Admin Routes */}
            <Route path="/admin/students" component={() => (
              <RequireAuth>
                <RequireRole roles={["madrasah-admin"]}>
                  <AdminStudents />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/teachers" component={() => (
              <RequireAuth>
                <RequireRole roles={["madrasah-admin"]}>
                  <AdminTeachers />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/classes" component={() => (
              <RequireAuth>
                <RequireRole roles={["madrasah-admin"]}>
                  <AdminClasses />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/attendance" component={() => (
              <RequireAuth>
                <RequireRole roles={["madrasah-admin"]}>
                  <AdminAttendance />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/reports" component={() => (
              <RequireAuth>
                <RequireRole roles={["madrasah-admin"]}>
                  <AdminReports />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/finance" component={() => (
              <RequireAuth>
                <RequireRole roles={["madrasah-admin"]}>
                  <AdminFinance />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin/messaging" component={() => (
              <RequireAuth>
                <RequireRole roles={["madrasah-admin"]}>
                  <AdminMessaging />
                </RequireRole>
              </RequireAuth>
            )} />

            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher"]}>
                  <TeacherDashboard />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/teacher/attendance" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher"]}>
                  <TeacherAttendance />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/teacher/hifz" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher"]}>
                  <HifzEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/teacher/najera" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher"]}>
                  <NajeraEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/teacher/noorani" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher"]}>
                  <NooraniEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/teacher/khatm" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher"]}>
                  <KhatmEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/teacher/students" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher"]}>
                  <TeacherStudents />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/teacher/reports" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher"]}>
                  <TeacherReports />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/teacher/messaging" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher"]}>
                  <TeacherMessaging />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/teacher/resources" component={() => (
              <RequireAuth>
                <RequireRole roles={["teacher"]}>
                  <TeacherResources />
                </RequireRole>
              </RequireAuth>
            )} />

            {/* Parent Routes */}
            <Route path="/parent/dashboard" component={() => (
              <RequireAuth>
                <RequireRole roles={["parent"]}>
                  <ParentDashboard />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/parent/attendance" component={() => (
              <RequireAuth>
                <RequireRole roles={["parent"]}>
                  <ParentAttendance />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/parent/progress" component={() => (
              <RequireAuth>
                <RequireRole roles={["parent"]}>
                  <ParentProgress />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/parent/hifz" component={() => (
              <RequireAuth>
                <RequireRole roles={["parent"]}>
                  <HifzEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/parent/najera" component={() => (
              <RequireAuth>
                <RequireRole roles={["parent"]}>
                  <NajeraEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/parent/noorani" component={() => (
              <RequireAuth>
                <RequireRole roles={["parent"]}>
                  <NooraniEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/parent/khatm" component={() => (
              <RequireAuth>
                <RequireRole roles={["parent"]}>
                  <KhatmEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/parent/messaging" component={() => (
              <RequireAuth>
                <RequireRole roles={["parent"]}>
                  <ParentMessaging />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/parent/finance" component={() => (
              <RequireAuth>
                <RequireRole roles={["parent"]}>
                  <ParentFinance />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/parent/notifications" component={() => (
              <RequireAuth>
                <RequireRole roles={["parent"]}>
                  <ParentNotifications />
                </RequireRole>
              </RequireAuth>
            )} />

            {/* Student Routes */}
            <Route path="/student/dashboard" component={() => (
              <RequireAuth>
                <RequireRole roles={["student"]}>
                  <StudentDashboard />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/student/lessons" component={() => (
              <RequireAuth>
                <RequireRole roles={["student"]}>
                  <StudentLessons />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/student/progress" component={() => (
              <RequireAuth>
                <RequireRole roles={["student"]}>
                  <StudentProgress />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/student/hifz" component={() => (
              <RequireAuth>
                <RequireRole roles={["student"]}>
                  <HifzEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/student/najera" component={() => (
              <RequireAuth>
                <RequireRole roles={["student"]}>
                  <NajeraEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/student/noorani" component={() => (
              <RequireAuth>
                <RequireRole roles={["student"]}>
                  <NooraniEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/student/khatm" component={() => (
              <RequireAuth>
                <RequireRole roles={["student"]}>
                  <KhatmEntry />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/student/schedule" component={() => (
              <RequireAuth>
                <RequireRole roles={["student"]}>
                  <StudentSchedule />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/student/resources" component={() => (
              <RequireAuth>
                <RequireRole roles={["student"]}>
                  <StudentResources />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/student/achievements" component={() => (
              <RequireAuth>
                <RequireRole roles={["student"]}>
                  <StudentAchievements />
                </RequireRole>
              </RequireAuth>
            )} />

            {/* Legacy admin routes - keep for backward compatibility */}
            <Route path="/billing" component={() => (
              <RequireAuth>
                <RequireRole roles={["super-admin"]}>
                  <BillingPage />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/settings" component={() => (
              <RequireAuth>
                <RequireRole roles={["super-admin", "madrasah-admin"]}>
                  <SettingsPage />
                </RequireRole>
              </RequireAuth>
            )} />
            <Route path="/admin" component={() => (
              <RequireAuth>
                <RequireRole roles={["super-admin", "madrasah-admin"]}>
                  <AdminDashboard />
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

