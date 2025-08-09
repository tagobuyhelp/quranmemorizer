import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

// Enhanced User type with multi-tenant support
type User = {
  id: string;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  // Multi-tenant membership info
  memberships?: Array<{
    organizationId: string;
    role: "super-admin" | "madrasah-admin" | "teacher" | "parent" | "student";
    section?: string;
    studentId?: string;
    permissions?: string[];
    isActive: boolean;
  }>;
  // Current organization context
  currentOrganizationId?: string;
  currentRole?: "super-admin" | "madrasah-admin" | "teacher" | "parent" | "student";
} | undefined;

// Enhanced Organization type
type Organization = {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  logo?: string | null;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  } | null;
  subscriptionStatus?: "trialing" | "active" | "past_due" | "canceled";
  plan?: "basic" | "pro" | "enterprise" | null;
  academicYear?: string;
  defaultLanguage?: "en" | "ar" | "ur";
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
} | undefined;

type AuthContextValue = {
  user: User;
  isLoading: boolean;
  unauthorized: boolean;
  organization: Organization;
  // Current role for easy access
  currentRole?: "super-admin" | "madrasah-admin" | "teacher" | "parent" | "student";
  // Helper functions for role-based access
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isSuperAdmin: () => boolean;
  isMadrasahAdmin: () => boolean;
  isTeacher: () => boolean;
  isParent: () => boolean;
  isStudent: () => boolean;
  // Organization switching
  switchOrganization: (organizationId: string) => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  isLoading: false,
  unauthorized: false,
  organization: undefined,
  currentRole: undefined,
  hasRole: () => false,
  hasPermission: () => false,
  isSuperAdmin: () => false,
  isMadrasahAdmin: () => false,
  isTeacher: () => false,
  isParent: () => false,
  isStudent: () => false,
  switchOrganization: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, error, isLoading } = useQuery<{ user: any }>({ 
    queryKey: ["/api/auth/me"], 
    retry: false 
  });
  
  const unauthorized = !!(error as any)?.message?.startsWith?.("401:");
  const user = data?.user as User;

  const { data: orgData } = useQuery<any>({
    queryKey: ["/api/organization"],
    enabled: !!user && !unauthorized,
    retry: false,
  });

  // Helper functions for role-based access
  const hasRole = (role: string): boolean => {
    if (!user?.currentRole) return false;
    return user.currentRole === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.memberships) return false;
    const currentMembership = user.memberships.find(
      m => m.organizationId === user.currentOrganizationId && m.isActive
    );
    return currentMembership?.permissions?.includes(permission) || false;
  };

  const isSuperAdmin = (): boolean => hasRole("super-admin");
  const isMadrasahAdmin = (): boolean => hasRole("madrasah-admin");
  const isTeacher = (): boolean => hasRole("teacher");
  const isParent = (): boolean => hasRole("parent");
  const isStudent = (): boolean => hasRole("student");

  const switchOrganization = (organizationId: string) => {
    // This would typically make an API call to switch organization context
    // For now, we'll just log it
    console.log("Switching to organization:", organizationId);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      unauthorized,
      organization: orgData as Organization,
      currentRole: user?.currentRole,
      hasRole,
      hasPermission,
      isSuperAdmin,
      isMadrasahAdmin,
      isTeacher,
      isParent,
      isStudent,
      switchOrganization
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
} 