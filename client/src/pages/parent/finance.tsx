import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/auth";

export default function ParentFinance() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Finance & Payments</CardTitle>
          <CardDescription>
            Manage fees and payments for {organization?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-hafizo-primary">$450</p>
                    <p className="text-sm text-gray-600">Total Due</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">$1,200</p>
                    <p className="text-sm text-gray-600">Total Paid</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-hafizo-secondary">$1,650</p>
                    <p className="text-sm text-gray-600">Total Fees</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Monthly Fee - March 2024</p>
                      <p className="text-sm text-gray-600">Paid via Credit Card</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-500">-$300</p>
                      <p className="text-xs text-gray-500">Mar 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Monthly Fee - February 2024</p>
                      <p className="text-sm text-gray-600">Paid via Bank Transfer</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-500">-$300</p>
                      <p className="text-xs text-gray-500">Feb 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Registration Fee</p>
                      <p className="text-sm text-gray-600">Paid via Cash</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-500">-$600</p>
                      <p className="text-xs text-gray-500">Jan 10, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-hafizo-primary rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">CC</span>
                      </div>
                      <div>
                        <p className="font-medium">Credit Card</p>
                        <p className="text-sm text-gray-600">**** **** **** 1234</p>
                      </div>
                    </div>
                    <button className="text-hafizo-primary hover:text-hafizo-primary-light">Edit</button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-hafizo-secondary rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">BT</span>
                      </div>
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-gray-600">Account: ****5678</p>
                      </div>
                    </div>
                    <button className="text-hafizo-primary hover:text-hafizo-primary-light">Edit</button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-hafizo-primary text-white rounded-lg hover:bg-hafizo-primary-light transition-colors">
                    Pay Fees
                  </button>
                  <button className="px-4 py-2 border border-hafizo-secondary text-hafizo-secondary rounded-lg hover:bg-hafizo-secondary hover:text-white transition-colors">
                    Download Invoice
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Payment History
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Add Payment Method
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 