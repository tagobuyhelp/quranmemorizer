import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/auth";

export default function StudentProgress() {
  const { user, organization } = useAuthContext();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Progress</CardTitle>
          <CardDescription>
            Track your learning progress and achievements at {organization?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Progress */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-hafizo-primary">75%</p>
                    <p className="text-sm text-gray-600">Overall Progress</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-hafizo-secondary">3</p>
                    <p className="text-sm text-gray-600">Juz Completed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">88%</p>
                    <p className="text-sm text-gray-600">Tajweed Score</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">92%</p>
                    <p className="text-sm text-gray-600">Attendance</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress by Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hifz Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Surah Al-Fatiha</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-hafizo-primary h-2 rounded-full" style={{width: '100%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Surah Al-Baqarah</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-hafizo-primary h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Surah Al-Imran</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-hafizo-primary h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Surah An-Nisa</span>
                        <span>20%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-hafizo-primary h-2 rounded-full" style={{width: '20%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Tajweed Assessment</p>
                        <p className="text-sm text-gray-600">March 15, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500">88%</p>
                        <p className="text-xs text-gray-500">Excellent</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Memorization Test</p>
                        <p className="text-sm text-gray-600">March 10, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-hafizo-primary">92%</p>
                        <p className="text-xs text-gray-500">Very Good</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Recitation Practice</p>
                        <p className="text-sm text-gray-600">March 5, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-hafizo-secondary">85%</p>
                        <p className="text-xs text-gray-500">Good</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg bg-hafizo-primary/5">
                    <div className="w-12 h-12 bg-hafizo-primary rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <p className="font-medium">First Juz Complete</p>
                    <p className="text-sm text-gray-600">Completed Al-Fatiha</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-hafizo-secondary/5">
                    <div className="w-12 h-12 bg-hafizo-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">T</span>
                    </div>
                    <p className="font-medium">Tajweed Master</p>
                    <p className="text-sm text-gray-600">Advanced level achieved</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-green-500/5">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <p className="font-medium">Perfect Attendance</p>
                    <p className="text-sm text-gray-600">30 days in a row</p>
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
                    Download Report
                  </button>
                  <button className="px-4 py-2 border border-hafizo-secondary text-hafizo-secondary rounded-lg hover:bg-hafizo-secondary hover:text-white transition-colors">
                    Share Progress
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Set Goals
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View History
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