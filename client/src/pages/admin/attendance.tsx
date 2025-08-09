import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/auth";

export default function AdminAttendance() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Management</CardTitle>
          <CardDescription>
            Monitor and manage student attendance at {organization?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Attendance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-hafizo-primary">92%</p>
                    <p className="text-sm text-gray-600">Today's Attendance</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-hafizo-secondary">156</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">144</p>
                    <p className="text-sm text-gray-600">Present Today</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">12</p>
                    <p className="text-sm text-gray-600">Absent Today</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Attendance by Class */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Attendance by Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Class 3A - Advanced Hifz</p>
                      <p className="text-sm text-gray-600">Ustadh Ahmed Hassan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-500">15/15 (100%)</p>
                      <p className="text-xs text-gray-500">All present</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Class 2B - Intermediate Hifz</p>
                      <p className="text-sm text-gray-600">Ustadh Omar Khan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-hafizo-primary">17/18 (94%)</p>
                      <p className="text-xs text-gray-500">1 absent</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Class 1C - Beginner Hifz</p>
                      <p className="text-sm text-gray-600">Ustadhah Fatima Ali</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-500">11/12 (92%)</p>
                      <p className="text-xs text-gray-500">1 absent</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Tajweed Mastery</p>
                      <p className="text-sm text-gray-600">Ustadhah Fatima Ali</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-hafizo-secondary">12/12 (100%)</p>
                      <p className="text-xs text-gray-500">All present</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Attendance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="text-center p-3 border rounded-lg">
                      <p className="font-medium text-sm">{day}</p>
                      <p className="text-lg font-bold text-hafizo-primary">
                        {[95, 92, 88, 94, 96, 90, 85][index]}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {[148, 144, 137, 147, 150, 140, 132][index]}/156
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Absent Students */}
            <Card>
              <CardHeader>
                <CardTitle>Absent Students Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        A
                      </div>
                      <div>
                        <p className="font-medium">Ahmed Ali</p>
                        <p className="text-sm text-gray-600">Class 2B - Ustadh Omar</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-500">Absent</p>
                      <p className="text-xs text-gray-500">No reason given</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        F
                      </div>
                      <div>
                        <p className="font-medium">Fatima Khan</p>
                        <p className="text-sm text-gray-600">Class 1C - Ustadhah Fatima</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-500">Absent</p>
                      <p className="text-xs text-gray-500">Sick leave</p>
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
                    Mark Attendance
                  </button>
                  <button className="px-4 py-2 border border-hafizo-secondary text-hafizo-secondary rounded-lg hover:bg-hafizo-secondary hover:text-white transition-colors">
                    Generate Report
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Send Notifications
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Export Data
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