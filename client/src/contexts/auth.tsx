import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

type User = { id: string; username: string; name: string; role: string; organizationId?: string | null } | undefined;

type Organization = { name: string; description?: string | null; subscriptionStatus?: string; plan?: string } | undefined;

type AuthContextValue = {
  user: User;
  isLoading: boolean;
  unauthorized: boolean;
  organization: Organization;
};

const AuthContext = createContext<AuthContextValue>({ user: undefined, isLoading: false, unauthorized: false, organization: undefined });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, error, isLoading } = useQuery<{ user: any }>({ queryKey: ["/api/auth/me"], retry: false });
  const unauthorized = !!(error as any)?.message?.startsWith?.("401:");
  const user = data?.user as User;

  const { data: orgData } = useQuery<any>({
    queryKey: ["/api/organization"],
    enabled: !!user && !unauthorized,
    retry: false,
  });

  return (
    <AuthContext.Provider value={{ user, isLoading, unauthorized, organization: orgData as Organization }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
} 