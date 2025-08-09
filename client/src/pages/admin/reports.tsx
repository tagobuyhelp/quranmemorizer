import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/auth";

export default function AdminReports() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports & Analytics</CardTitle>
          <CardDescription>
            Generate and view comprehensive reports for {organization?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-hafizo-primary">156</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-hafizo-secondary">92%</p>
                    <p className="text-sm text-gray-600">Average Attendance</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">78%</p>
                    <p className="text-sm text-gray-600">Average Progress</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">12</p>
                    <p className="text-sm text-gray-600">Active Teachers</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Student Progress Report</div>
                      <div className="text-sm text-gray-600">Individual student performance analysis</div>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Class Performance Report</div>
                      <div className="text-sm text-gray-600">Overall class statistics and trends</div>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Teacher Performance Report</div>
                      <div className="text-sm text-gray-600">Teacher effectiveness and student outcomes</div>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Hifz Completion Report</div>
                      <div className="text-sm text-gray-600">Memorization progress and milestones</div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operational Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Attendance Report</div>
                      <div className="text-sm text-gray-600">Daily, weekly, and monthly attendance</div>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Financial Report</div>
                      <div className="text-sm text-gray-600">Fee collection and financial overview</div>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Enrollment Report</div>
                      <div className="text-sm text-gray-600">Student enrollment trends and statistics</div>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-medium">Resource Utilization Report</div>
                      <div className="text-sm text-gray-600">Classroom and resource usage analysis</div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Monthly Progress Report - March 2024</p>
                      <p className="text-sm text-gray-600">Generated on March 31, 2024</p>
                    </div>
                    <div className="text-right">
                      <button className="text-hafizo-primary hover:text-hafizo-primary-light text-sm">
                        Download
                      </button>
                      <p className="text-xs text-gray-500">PDF • 2.3 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Attendance Summary - Week 12</p>
                      <p className="text-sm text-gray-600">Generated on March 29, 2024</p>
                    </div>
                    <div className="text-right">
                      <button className="text-hafizo-primary hover:text-hafizo-primary-light text-sm">
                        Download
                      </button>
                      <p className="text-xs text-gray-500">PDF • 1.1 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Teacher Performance - Q1 2024</p>
                      <p className="text-sm text-gray-600">Generated on March 25, 2024</p>
                    </div>
                    <div className="text-right">
                      <button className="text-hafizo-primary hover:text-hafizo-primary-light text-sm">
                        Download
                      </button>
                      <p className="text-xs text-gray-500">PDF • 3.7 MB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Weekly Attendance Report</p>
                      <p className="text-sm text-gray-600">Every Friday at 5:00 PM</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Active</span>
                      <p className="text-xs text-gray-500 mt-1">Next: April 5</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Monthly Progress Report</p>
                      <p className="text-sm text-gray-600">Last day of each month at 6:00 PM</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Active</span>
                      <p className="text-xs text-gray-500 mt-1">Next: April 30</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Quarterly Financial Report</p>
                      <p className="text-sm text-gray-600">End of each quarter at 7:00 PM</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Paused</span>
                      <p className="text-xs text-gray-500 mt-1">Next: June 30</p>
                    </div>
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
                    Generate New Report
                  </button>
                  <button className="px-4 py-2 border border-hafizo-secondary text-hafizo-secondary rounded-lg hover:bg-hafizo-secondary hover:text-white transition-colors">
                    Schedule Report
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Export All Reports
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Report Settings
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