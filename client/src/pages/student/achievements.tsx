import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { useAuthContext } from "@/contexts/auth";

export default function StudentAchievements() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <p className="text-gray-600">View your accomplishments and milestones</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            My Achievements
          </CardTitle>
          <CardDescription>Track your accomplishments and learning milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Achievements functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
} 