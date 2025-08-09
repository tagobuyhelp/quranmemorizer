import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useAuthContext } from "@/contexts/auth";

export default function AdminSystemSettings() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure platform-wide settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Platform Configuration
          </CardTitle>
          <CardDescription>Manage system-wide settings and configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">System settings functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
} 