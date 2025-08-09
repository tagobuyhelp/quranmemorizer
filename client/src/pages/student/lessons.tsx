import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/auth";

export default function StudentLessons() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Lessons</CardTitle>
          <CardDescription>
            View your assigned lessons and learning materials at {organization?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Today's Lessons */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-hafizo-primary/5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-hafizo-primary rounded-lg flex items-center justify-center text-white font-semibold">
                        H
                      </div>
                      <div>
                        <p className="font-medium">Hifz - Surah Al-Baqarah</p>
                        <p className="text-sm text-gray-600">Verses 1-5 | Teacher: Ustadh Ahmed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-hafizo-primary">9:00 AM</p>
                      <p className="text-xs text-gray-500">45 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-hafizo-secondary rounded-lg flex items-center justify-center text-white font-semibold">
                        T
                      </div>
                      <div>
                        <p className="font-medium">Tajweed Practice</p>
                        <p className="text-sm text-gray-600">Pronunciation & Rules | Teacher: Ustadh Fatima</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-hafizo-secondary">11:00 AM</p>
                      <p className="text-xs text-gray-500">30 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                        R
                      </div>
                      <div>
                        <p className="font-medium">Revision Session</p>
                        <p className="text-sm text-gray-600">Previous Surahs | Teacher: Ustadh Omar</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-500">2:00 PM</p>
                      <p className="text-xs text-gray-500">60 minutes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Lessons */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Surah Al-Imran - Verses 1-10</p>
                      <p className="text-sm text-gray-600">Tomorrow, 9:00 AM</p>
                    </div>
                    <span className="text-xs bg-hafizo-primary text-white px-2 py-1 rounded">Hifz</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Advanced Tajweed Rules</p>
                      <p className="text-sm text-gray-600">Tomorrow, 11:00 AM</p>
                    </div>
                    <span className="text-xs bg-hafizo-secondary text-white px-2 py-1 rounded">Tajweed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Weekly Assessment</p>
                      <p className="text-sm text-gray-600">Friday, 10:00 AM</p>
                    </div>
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">Test</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-hafizo-primary">75%</p>
                    <p className="text-sm text-gray-600">Hifz Progress</p>
                    <p className="text-xs text-gray-500">3 Juz completed</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-hafizo-secondary">88%</p>
                    <p className="text-sm text-gray-600">Tajweed Score</p>
                    <p className="text-xs text-gray-500">Excellent</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-500">92%</p>
                    <p className="text-sm text-gray-600">Attendance</p>
                    <p className="text-xs text-gray-500">This month</p>
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
                    View Schedule
                  </button>
                  <button className="px-4 py-2 border border-hafizo-secondary text-hafizo-secondary rounded-lg hover:bg-hafizo-secondary hover:text-white transition-colors">
                    Download Materials
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Request Help
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Study Resources
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