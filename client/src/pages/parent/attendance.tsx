import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck } from "lucide-react";
import { useAuthContext } from "@/contexts/auth";

export default function ParentAttendance() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">View your child's attendance record</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Attendance Record
          </CardTitle>
          <CardDescription>Track your child's attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Attendance functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
} 