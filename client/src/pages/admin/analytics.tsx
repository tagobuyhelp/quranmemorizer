import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useAuthContext } from "@/contexts/auth";

export default function AdminAnalytics() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">View platform-wide analytics and insights</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
          <CardDescription>Comprehensive analytics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Analytics functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
} 