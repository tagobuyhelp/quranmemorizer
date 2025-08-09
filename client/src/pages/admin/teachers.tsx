import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/auth";

export default function AdminTeachers() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Teacher Management</CardTitle>
          <CardDescription>
            Manage teachers and their assignments at {organization?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Teacher Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-hafizo-primary">12</p>
                    <p className="text-sm text-gray-600">Total Teachers</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-hafizo-secondary">10</p>
                    <p className="text-sm text-gray-600">Active Teachers</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">156</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">13</p>
                    <p className="text-sm text-gray-600">Average per Teacher</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Teacher List */}
            <Card>
              <CardHeader>
                <CardTitle>Teacher Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-hafizo-primary rounded-full flex items-center justify-center text-white font-semibold">
                        A
                      </div>
                      <div>
                        <p className="font-medium">Ustadh Ahmed Hassan</p>
                        <p className="text-sm text-gray-600">Hifz Specialist | 15 students</p>
                        <p className="text-xs text-gray-500">ahmed.hassan@madrasah.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Active</span>
                      <p className="text-sm text-gray-600 mt-1">4.8 ★</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-hafizo-secondary rounded-full flex items-center justify-center text-white font-semibold">
                        F
                      </div>
                      <div>
                        <p className="font-medium">Ustadhah Fatima Ali</p>
                        <p className="text-sm text-gray-600">Tajweed Expert | 12 students</p>
                        <p className="text-xs text-gray-500">fatima.ali@madrasah.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Active</span>
                      <p className="text-sm text-gray-600 mt-1">4.9 ★</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        O
                      </div>
                      <div>
                        <p className="font-medium">Ustadh Omar Khan</p>
                        <p className="text-sm text-gray-600">Noorani Qaida | 18 students</p>
                        <p className="text-xs text-gray-500">omar.khan@madrasah.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Active</span>
                      <p className="text-sm text-gray-600 mt-1">4.7 ★</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                        M
                      </div>
                      <div>
                        <p className="font-medium">Ustadh Muhammad Saleem</p>
                        <p className="text-sm text-gray-600">Khatm Specialist | 8 students</p>
                        <p className="text-xs text-gray-500">muhammad.saleem@madrasah.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">On Leave</span>
                      <p className="text-sm text-gray-600 mt-1">4.6 ★</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Class Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Hifz Classes</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Class 3A (Advanced)</span>
                        <span className="text-hafizo-primary">Ustadh Ahmed</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Class 2B (Intermediate)</span>
                        <span className="text-hafizo-primary">Ustadh Omar</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Class 1C (Beginner)</span>
                        <span className="text-hafizo-primary">Ustadhah Fatima</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Specialized Classes</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tajweed Mastery</span>
                        <span className="text-hafizo-secondary">Ustadhah Fatima</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Noorani Qaida</span>
                        <span className="text-hafizo-secondary">Ustadh Omar</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Khatm Preparation</span>
                        <span className="text-hafizo-secondary">Ustadh Muhammad</span>
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
                    Add New Teacher
                  </button>
                  <button className="px-4 py-2 border border-hafizo-secondary text-hafizo-secondary rounded-lg hover:bg-hafizo-secondary hover:text-white transition-colors">
                    Assign Classes
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Performance Report
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