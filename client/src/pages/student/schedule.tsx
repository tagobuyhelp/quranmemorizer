import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/auth";

export default function StudentSchedule() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Schedule</CardTitle>
          <CardDescription>
            View your daily and weekly schedule at {organization?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-hafizo-primary/5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-hafizo-primary rounded-lg flex items-center justify-center text-white font-semibold">
                        9:00
                      </div>
                      <div>
                        <p className="font-medium">Hifz Class</p>
                        <p className="text-sm text-gray-600">Surah Al-Baqarah | Ustadh Ahmed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-hafizo-primary">45 min</p>
                      <p className="text-xs text-gray-500">Room 101</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-hafizo-secondary rounded-lg flex items-center justify-center text-white font-semibold">
                        11:00
                      </div>
                      <div>
                        <p className="font-medium">Tajweed Practice</p>
                        <p className="text-sm text-gray-600">Advanced Rules | Ustadh Fatima</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-hafizo-secondary">30 min</p>
                      <p className="text-xs text-gray-500">Room 102</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                        14:00
                      </div>
                      <div>
                        <p className="font-medium">Revision Session</p>
                        <p className="text-sm text-gray-600">Previous Surahs | Ustadh Omar</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-500">60 min</p>
                      <p className="text-xs text-gray-500">Room 103</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                    <div key={day} className="border rounded-lg p-3">
                      <h3 className="font-medium text-center mb-2">{day}</h3>
                      <div className="space-y-2">
                        <div className="text-xs p-1 bg-hafizo-primary/10 rounded">
                          <p className="font-medium">9:00 AM</p>
                          <p className="text-gray-600">Hifz</p>
                        </div>
                        <div className="text-xs p-1 bg-hafizo-secondary/10 rounded">
                          <p className="font-medium">11:00 AM</p>
                          <p className="text-gray-600">Tajweed</p>
                        </div>
                        <div className="text-xs p-1 bg-blue-500/10 rounded">
                          <p className="font-medium">2:00 PM</p>
                          <p className="text-gray-600">Revision</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Weekly Assessment</p>
                      <p className="text-sm text-gray-600">Friday, March 22, 2024</p>
                    </div>
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">Test</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Parent-Teacher Meeting</p>
                      <p className="text-sm text-gray-600">Friday, March 29, 2024</p>
                    </div>
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Meeting</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Eid Holiday</p>
                      <p className="text-sm text-gray-600">April 10-12, 2024</p>
                    </div>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Holiday</span>
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
                    Download Schedule
                  </button>
                  <button className="px-4 py-2 border border-hafizo-secondary text-hafizo-secondary rounded-lg hover:bg-hafizo-secondary hover:text-white transition-colors">
                    Set Reminders
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Request Changes
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Sync Calendar
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