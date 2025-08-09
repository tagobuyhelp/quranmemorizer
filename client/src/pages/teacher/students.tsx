import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/auth";

export default function TeacherStudents() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Students</CardTitle>
          <CardDescription>
            Manage and view your assigned students at {organization?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mock student data */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-hafizo-primary rounded-full flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                    <div>
                      <h3 className="font-semibold">Ahmed Hassan</h3>
                      <p className="text-sm text-gray-600">Class 3A - Hifz Level</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Last Assessment:</span>
                      <span className="font-medium">2 days ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span className="font-medium text-hafizo-primary">75%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-hafizo-primary rounded-full flex items-center justify-center text-white font-semibold">
                      F
                    </div>
                    <div>
                      <h3 className="font-semibold">Fatima Ali</h3>
                      <p className="text-sm text-gray-600">Class 2B - Najera Level</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Last Assessment:</span>
                      <span className="font-medium">1 week ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span className="font-medium text-hafizo-primary">60%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-hafizo-primary rounded-full flex items-center justify-center text-white font-semibold">
                      M
                    </div>
                    <div>
                      <h3 className="font-semibold">Muhammad Khan</h3>
                      <p className="text-sm text-gray-600">Class 1A - Noorani Level</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Last Assessment:</span>
                      <span className="font-medium">3 days ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span className="font-medium text-hafizo-primary">85%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-hafizo-primary text-white rounded-lg hover:bg-hafizo-primary-light transition-colors">
                  Add New Student
                </button>
                <button className="px-4 py-2 border border-hafizo-secondary text-hafizo-secondary rounded-lg hover:bg-hafizo-secondary hover:text-white transition-colors">
                  Generate Report
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 