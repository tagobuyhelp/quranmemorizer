import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/auth";

export default function AdminClasses() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Class & Section Management</CardTitle>
          <CardDescription>
            Manage classes, sections, and academic structure at {organization?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Class Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-hafizo-primary">15</p>
                    <p className="text-sm text-gray-600">Total Classes</p>
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
                    <p className="text-2xl font-bold text-green-500">12</p>
                    <p className="text-sm text-gray-600">Active Teachers</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">10.4</p>
                    <p className="text-sm text-gray-600">Avg Students/Class</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Class Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hifz Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Class 3A - Advanced Hifz</p>
                        <p className="text-sm text-gray-600">Ustadh Ahmed Hassan</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-hafizo-primary">15 students</p>
                        <p className="text-xs text-gray-500">Room 101</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Class 2B - Intermediate Hifz</p>
                        <p className="text-sm text-gray-600">Ustadh Omar Khan</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-hafizo-primary">18 students</p>
                        <p className="text-xs text-gray-500">Room 102</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Class 1C - Beginner Hifz</p>
                        <p className="text-sm text-gray-600">Ustadhah Fatima Ali</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-hafizo-primary">12 students</p>
                        <p className="text-xs text-gray-500">Room 103</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Specialized Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Tajweed Mastery</p>
                        <p className="text-sm text-gray-600">Ustadhah Fatima Ali</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-hafizo-secondary">12 students</p>
                        <p className="text-xs text-gray-500">Room 201</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Noorani Qaida</p>
                        <p className="text-sm text-gray-600">Ustadh Omar Khan</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-hafizo-secondary">20 students</p>
                        <p className="text-xs text-gray-500">Room 202</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Khatm Preparation</p>
                        <p className="text-sm text-gray-600">Ustadh Muhammad Saleem</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-hafizo-secondary">8 students</p>
                        <p className="text-xs text-gray-500">Room 203</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Class Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Class Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                    <div key={day} className="border rounded-lg p-3">
                      <h3 className="font-medium text-center mb-3">{day}</h3>
                      <div className="space-y-2">
                        <div className="text-xs p-2 bg-hafizo-primary/10 rounded">
                          <p className="font-medium">9:00 AM</p>
                          <p className="text-gray-600">Hifz Classes</p>
                        </div>
                        <div className="text-xs p-2 bg-hafizo-secondary/10 rounded">
                          <p className="font-medium">11:00 AM</p>
                          <p className="text-gray-600">Tajweed</p>
                        </div>
                        <div className="text-xs p-2 bg-blue-500/10 rounded">
                          <p className="font-medium">2:00 PM</p>
                          <p className="text-gray-600">Revision</p>
                        </div>
                        <div className="text-xs p-2 bg-green-500/10 rounded">
                          <p className="font-medium">4:00 PM</p>
                          <p className="text-gray-600">Noorani</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room Management */}
            <Card>
              <CardHeader>
                <CardTitle>Room Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Ground Floor</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Room 101</span>
                        <span className="text-hafizo-primary">Occupied</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room 102</span>
                        <span className="text-hafizo-primary">Occupied</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room 103</span>
                        <span className="text-green-500">Available</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">First Floor</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Room 201</span>
                        <span className="text-hafizo-primary">Occupied</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room 202</span>
                        <span className="text-hafizo-primary">Occupied</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room 203</span>
                        <span className="text-hafizo-primary">Occupied</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Special Rooms</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Prayer Hall</span>
                        <span className="text-green-500">Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Computer Lab</span>
                        <span className="text-yellow-500">Maintenance</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Library</span>
                        <span className="text-green-500">Available</span>
                      </div>
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
                    Add New Class
                  </button>
                  <button className="px-4 py-2 border border-hafizo-secondary text-hafizo-secondary rounded-lg hover:bg-hafizo-secondary hover:text-white transition-colors">
                    Assign Teachers
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Manage Schedule
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Room Allocation
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