import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/auth";

export default function TeacherMessaging() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Messaging Center</CardTitle>
          <CardDescription>
            Communicate with parents and administrators at {organization?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Messaging functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
} 