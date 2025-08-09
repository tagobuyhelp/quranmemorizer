import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useAuthContext } from "@/contexts/auth";

export default function ParentProgress() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Reports</h1>
          <p className="text-gray-600">View your child's learning progress</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
          <CardDescription>Track your child's academic progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Progress reports functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
} 