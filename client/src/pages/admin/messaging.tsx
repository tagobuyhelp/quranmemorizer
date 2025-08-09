import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuthContext } from "@/contexts/auth";

export default function AdminMessaging() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messaging</h1>
          <p className="text-gray-600">Send announcements and communicate with users</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Center
          </CardTitle>
          <CardDescription>Send announcements and messages to users</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Messaging functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
} 