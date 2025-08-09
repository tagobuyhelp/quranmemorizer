import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/auth";

export default function TeacherReports() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports & Analytics</CardTitle>
          <CardDescription>
            Generate and view detailed reports for your students at {organization?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-hafizo-primary">24</p>
                    </div>
                    <div className="w-8 h-8 bg-hafizo-primary rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">S</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Average Progress</p>
                      <p className="text-2xl font-bold text-hafizo-primary">78%</p>
                    </div>
                    <div className="w-8 h-8 bg-hafizo-secondary rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">P</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-hafizo-primary">156</p>
                      <p className="text-xs text-gray-500">Assessments</p>
                    </div>
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Attendance Rate</p>
                      <p className="text-2xl font-bold text-hafizo-primary">92%</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Reports</CardTitle>
                  <CardDescription>Generate detailed student progress reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Individual Student Report</div>
                      <div className="text-sm text-gray-600">Detailed progress for specific students</div>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Class Performance Report</div>
                      <div className="text-sm text-gray-600">Overall class statistics and trends</div>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Monthly Progress Summary</div>
                      <div className="text-sm text-gray-600">Monthly overview of all students</div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment Reports</CardTitle>
                  <CardDescription>View and analyze assessment results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Tajweed Assessment</div>
                      <div className="text-sm text-gray-600">Pronunciation and recitation quality</div>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Memorization Progress</div>
                      <div className="text-sm text-gray-600">Hifz completion and retention rates</div>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Attendance Report</div>
                      <div className="text-sm text-gray-600">Student attendance patterns</div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-hafizo-primary text-white rounded-lg hover:bg-hafizo-primary-light transition-colors">
                    Generate All Reports
                  </button>
                  <button className="px-4 py-2 border border-hafizo-secondary text-hafizo-secondary rounded-lg hover:bg-hafizo-secondary hover:text-white transition-colors">
                    Export to PDF
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Schedule Reports
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Share with Admin
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