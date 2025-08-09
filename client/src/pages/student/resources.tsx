import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones } from "lucide-react";
import { useAuthContext } from "@/contexts/auth";

export default function StudentResources() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600">Access study materials and reference content</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Study Resources
          </CardTitle>
          <CardDescription>Access audio, video, and text resources</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Resources functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
} 