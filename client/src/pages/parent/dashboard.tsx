import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, BookOpen, TrendingUp, Calendar, 
  UserCheck, MessageSquare, Clock, Target,
  GraduationCap, Crown, Mic, Headphones,
  Award, AlertCircle, CreditCard
} from "lucide-react";
import { useAuthContext } from "@/contexts/auth";

export default function ParentDashboard() {
  const { user, organization } = useAuthContext();

  // Mock data - in real app this would come from API
  const childInfo = {
    name: "Ahmed Ali",
    studentId: "STU001",
    section: "Class A",
    teacher: "Ustadh Muhammad",
    currentPara: 15,
    totalParas: 30,
    attendanceRate: 92,
  };

  const recentProgress = [
    { date: "2024-01-15", subject: "Hifz", para: 15, score: 85, remarks: "Excellent recitation" },
    { date: "2024-01-14", subject: "Najera", pages: "45-50", score: 90, remarks: "Good pronunciation" },
    { date: "2024-01-13", subject: "Noorani", lesson: "Lesson 8", score: 88, remarks: "Well done" },
  ];

  const attendanceHistory = [
    { date: "2024-01-15", status: "present" },
    { date: "2024-01-14", status: "present" },
    { date: "2024-01-13", status: "late" },
    { date: "2024-01-12", status: "present" },
    { date: "2024-01-11", status: "absent" },
  ];

  const upcomingEvents = [
    { date: "2024-01-20", title: "Parent-Teacher Meeting", type: "meeting" },
    { date: "2024-01-25", title: "Quran Competition", type: "event" },
    { date: "2024-01-30", title: "Monthly Assessment", type: "exam" },
  ];

  const quickStats = [
    { title: "Current Para", value: `${childInfo.currentPara}/${childInfo.totalParas}`, icon: BookOpen, color: "text-blue-600" },
    { title: "Attendance Rate", value: `${childInfo.attendanceRate}%`, icon: UserCheck, color: "text-green-600" },
    { title: "Average Score", value: "87%", icon: TrendingUp, color: "text-orange-600" },
    { title: "Unread Messages", value: "2", icon: MessageSquare, color: "text-purple-600" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800";
      case "absent": return "bg-red-100 text-red-800";
      case "late": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "meeting": return MessageSquare;
      case "event": return Award;
      case "exam": return BookOpen;
      default: return Calendar;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{organization?.name}</p>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Child Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {childInfo.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{childInfo.name}</h2>
              <p className="text-gray-600">Student ID: {childInfo.studentId}</p>
              <p className="text-gray-600">Section: {childInfo.section} | Teacher: {childInfo.teacher}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline">Active Student</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Progress
            </CardTitle>
            <CardDescription>Latest updates on your child's learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProgress.map((progress, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{progress.date}</p>
                      <p className="text-xs text-gray-500">Date</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{progress.subject}</p>
                      <p className="text-sm text-gray-600">
                        {progress.para ? `Para ${progress.para}` : 
                         progress.pages ? `Pages ${progress.pages}` : 
                         progress.lesson ? progress.lesson : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{progress.score}%</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                    <Badge variant="secondary">{progress.remarks}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start h-auto p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-blue-100 text-blue-700">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Message Teacher</span>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-green-100 text-green-700">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-sm">View Progress Report</span>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-purple-100 text-purple-700">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Schedule Meeting</span>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-orange-100 text-orange-700">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Pay Fees</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Recent Attendance
            </CardTitle>
            <CardDescription>Attendance record for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceHistory.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{record.date}</span>
                  </div>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Attendance Rate</span>
                <span className="text-sm font-medium">{childInfo.attendanceRate}%</span>
              </div>
              <Progress value={childInfo.attendanceRate} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Important dates and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => {
                const EventIcon = getEventIcon(event.type);
                return (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="p-2 rounded bg-blue-100">
                      <EventIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hifz Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Hifz Progress
          </CardTitle>
          <CardDescription>Current memorization progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">
                {Math.round((childInfo.currentPara / childInfo.totalParas) * 100)}%
              </span>
            </div>
            <Progress value={(childInfo.currentPara / childInfo.totalParas) * 100} />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{childInfo.currentPara}</p>
                <p className="text-sm text-gray-600">Current Para</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{childInfo.totalParas}</p>
                <p className="text-sm text-gray-600">Total Paras</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 