import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAuthContext } from "@/contexts/auth";

export default function AdminStudents() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage all students in the institution</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Management
          </CardTitle>
          <CardDescription>Add, edit, and manage student records</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Student management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
} 