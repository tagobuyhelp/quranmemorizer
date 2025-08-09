import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, BookOpen, TrendingUp, Calendar, 
  UserCheck, MessageSquare, Clock, Target,
  GraduationCap, Crown, Mic, Headphones
} from "lucide-react";
import { useAuthContext } from "@/contexts/auth";
import { useLocation } from "wouter";

export default function TeacherDashboard() {
  const { user, organization } = useAuthContext();
  const [, navigate] = useLocation();

  // Mock data - in real app this would come from API
  const todaySchedule = [
    { time: "08:00 AM", section: "Class A", students: 15, subject: "Hifz" },
    { time: "10:00 AM", section: "Class B", students: 12, subject: "Najera" },
    { time: "02:00 PM", section: "Class C", students: 18, subject: "Noorani" },
  ];

  const recentStudents = [
    { id: "1", name: "Ahmed Ali", section: "Class A", progress: 75, lastActivity: "2 hours ago" },
    { id: "2", name: "Fatima Khan", section: "Class B", progress: 88, lastActivity: "1 hour ago" },
    { id: "3", name: "Omar Hassan", section: "Class A", progress: 62, lastActivity: "3 hours ago" },
  ];

  const quickStats = [
    { title: "Total Students", value: "45", icon: Users, color: "text-blue-600" },
    { title: "Today's Classes", value: "3", icon: Calendar, color: "text-green-600" },
    { title: "Pending Reports", value: "5", icon: TrendingUp, color: "text-orange-600" },
    { title: "Unread Messages", value: "2", icon: MessageSquare, color: "text-purple-600" },
  ];

  const quickActions = [
    { title: "Mark Attendance", icon: UserCheck, href: "/teacher/attendance", color: "bg-green-100 text-green-700" },
    { title: "Hifz Entry", icon: BookOpen, href: "/teacher/hifz", color: "bg-blue-100 text-blue-700" },
    { title: "Najera Entry", icon: GraduationCap, href: "/teacher/najera", color: "bg-purple-100 text-purple-700" },
    { title: "Noorani Entry", icon: Mic, href: "/teacher/noorani", color: "bg-orange-100 text-orange-700" },
    { title: "Khatm Entry", icon: Crown, href: "/teacher/khatm", color: "bg-yellow-100 text-yellow-700" },
    { title: "Upload Resources", icon: Headphones, href: "/teacher/resources", color: "bg-indigo-100 text-indigo-700" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 text-sm md:text-base">Welcome back, {user?.name}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">{organization?.name}</p>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2.5 md:p-3 rounded-full bg-gray-100`}>
                  <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription className="text-sm">Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {todaySchedule.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{classItem.time}</p>
                      <p className="text-[11px] text-gray-500">Time</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{classItem.section}</p>
                      <p className="text-sm text-gray-600">{classItem.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{classItem.students} students</Badge>
                    <Button size="sm" variant="outline">Start Class</Button>
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
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-3"
                  onClick={() => navigate(action.href)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${action.color}`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{action.title}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Student Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Users className="h-5 w-5" />
            Recent Student Activity
          </CardTitle>
          <CardDescription className="text-sm">Latest updates from your students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                <div className="flex items-center gap-3 md:gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.section}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{student.progress}%</p>
                    <p className="text-xs text-gray-500">Progress</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{student.lastActivity}</p>
                    <p className="text-xs text-gray-500">Last Activity</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 