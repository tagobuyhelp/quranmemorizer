import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, TrendingUp, Calendar, Clock, Target,
  Award, Headphones, Play, CheckCircle, Star
} from "lucide-react";
import { useAuthContext } from "@/contexts/auth";

export default function StudentDashboard() {
  const { user, organization } = useAuthContext();

  // Mock data - in real app this would come from API
  const studentInfo = {
    name: "Ahmed Ali",
    studentId: "STU001",
    section: "Class A",
    teacher: "Ustadh Muhammad",
    currentPara: 15,
    totalParas: 30,
    attendanceRate: 95,
    averageScore: 88,
  };

  const todayLessons = [
    { time: "08:00 AM", subject: "Hifz", para: 15, duration: "45 min", status: "upcoming" },
    { time: "10:00 AM", subject: "Najera", pages: "45-50", duration: "30 min", status: "upcoming" },
    { time: "02:00 PM", subject: "Noorani", lesson: "Lesson 8", duration: "40 min", status: "completed" },
  ];

  const recentAchievements = [
    { title: "Perfect Attendance", description: "Attended all classes this week", date: "2024-01-15", icon: Award },
    { title: "Hifz Milestone", description: "Completed Para 15", date: "2024-01-14", icon: BookOpen },
    { title: "Excellent Score", description: "Scored 95% in Najera", date: "2024-01-13", icon: Star },
  ];

  const progressStats = [
    { title: "Hifz Progress", value: 50, total: 100, unit: "%" },
    { title: "Najera Progress", value: 75, total: 100, unit: "%" },
    { title: "Noorani Progress", value: 60, total: 100, unit: "%" },
    { title: "Attendance", value: 95, total: 100, unit: "%" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "missed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 text-sm md:text-base">Welcome back, {user?.name}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">{organization?.name}</p>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Student Info */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3 md:gap-4">
            <Avatar className="h-12 w-12 md:h-16 md:w-16">
              <AvatarFallback className="text-base md:text-lg">
                {studentInfo.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">{studentInfo.name}</h2>
              <p className="text-sm text-gray-600">Student ID: {studentInfo.studentId}</p>
              <p className="text-sm text-gray-600">Section: {studentInfo.section} | Teacher: {studentInfo.teacher}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline">Active Student</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {progressStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs md:text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xs md:text-sm font-medium text-gray-900">
                    {stat.value}{stat.unit}
                  </p>
                </div>
                <Progress value={stat.value} />
                <p className="text-[11px] md:text-xs text-gray-500">
                  {stat.value} of {stat.total} {stat.unit}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Today's Lessons */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Calendar className="h-5 w-5" />
              Today's Lessons
            </CardTitle>
            <CardDescription className="text-sm">Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {todayLessons.map((lesson, index) => (
                <div key={index} className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{lesson.time}</p>
                      <p className="text-[11px] text-gray-500">Time</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lesson.subject}</p>
                      <p className="text-sm text-gray-600">
                        {lesson.para ? `Para ${lesson.para}` : 
                         lesson.pages ? `Pages ${lesson.pages}` : 
                         lesson.lesson ? lesson.lesson : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(lesson.status)}>
                      {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                    </Badge>
                    <div className="text-right">
                      <p className="text-xs md:text-sm text-gray-600">{lesson.duration}</p>
                    </div>
                    {lesson.status === "upcoming" && (
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {lesson.status === "completed" && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-sm">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start h-auto p-3" >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-blue-100 text-blue-700">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-sm">View My Lessons</span>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-green-100 text-green-700">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-sm">View My Progress</span>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-purple-100 text-purple-700">
                    <Headphones className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Study Resources</span>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-orange-100 text-orange-700">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-sm">My Achievements</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Hifz Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <BookOpen className="h-5 w-5" />
              Hifz Progress
            </CardTitle>
            <CardDescription className="text-sm">Your memorization journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">
                  {Math.round((studentInfo.currentPara / studentInfo.totalParas) * 100)}%
                </span>
              </div>
              <Progress value={(studentInfo.currentPara / studentInfo.totalParas) * 100} />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-blue-600">{studentInfo.currentPara}</p>
                  <p className="text-sm text-gray-600">Current Para</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-gray-600">{studentInfo.totalParas}</p>
                  <p className="text-sm text-gray-600">Total Paras</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Next Target: Para {studentInfo.currentPara + 1}</p>
                <Button size="sm" className="w-full">Start Next Para</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
            <CardDescription className="text-sm">Your latest accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 rounded bg-yellow-100">
                    <achievement.icon className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{achievement.title}</p>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full">
                View All Achievements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Clock className="h-5 w-5" />
            Study Schedule
          </CardTitle>
          <CardDescription className="text-sm">Your weekly study plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 md:gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center p-2 md:p-3 border rounded-lg">
                <p className="font-medium text-gray-900">{day}</p>
                <div className="mt-2 space-y-1">
                  <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded">Hifz</div>
                  <div className="text-xs bg-green-100 text-green-800 p-1 rounded">Najera</div>
                  <div className="text-xs bg-purple-100 text-purple-800 p-1 rounded">Noorani</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 