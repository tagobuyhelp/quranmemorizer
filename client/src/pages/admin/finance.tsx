import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useAuthContext } from "@/contexts/auth";

export default function AdminFinance() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance</h1>
          <p className="text-gray-600">Manage institutional finances and fees</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Financial Management
          </CardTitle>
          <CardDescription>Manage fees, payments, and financial records</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Financial management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
} 