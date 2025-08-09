import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { 
  Users, 
  Building2, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Settings,
  Activity
} from "lucide-react";
import { useLocation } from "wouter";

interface DashboardStats {
  totalUsers: number;
  totalOrganizations: number;
  activeSubscriptions: number;
  pendingPayments: number;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
  }>;
  subscriptionStats: {
    basic: number;
    pro: number;
    enterprise: number;
  };
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm md:text-base">Monitor and manage your platform</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button size="sm" onClick={() => navigate("/admin/organizations")}> 
            <Building2 className="h-4 w-4 mr-2" />
            Organizations
          </Button>
          <Button size="sm" onClick={() => navigate("/admin/users")}>
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats?.totalOrganizations || 0}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats?.activeSubscriptions || 0}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Pending Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats?.pendingPayments || 0}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Subscription Plans</CardTitle>
            <CardDescription className="text-sm">Distribution of active subscriptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm md:text-base font-medium">Basic</span>
              </div>
              <Badge variant="secondary">{stats?.subscriptionStats.basic || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm md:text-base font-medium">Pro</span>
              </div>
              <Badge variant="secondary">{stats?.subscriptionStats.pro || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm md:text-base font-medium">Enterprise</span>
              </div>
              <Badge variant="secondary">{stats?.subscriptionStats.enterprise || 0}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-sm">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate("/admin/organizations/new")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Org
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate("/admin/users/new")}
              >
                <Users className="h-4 w-4 mr-2" />
                New User
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate("/admin/subscriptions")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Subscriptions
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate("/admin/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Recent Activities</CardTitle>
          <CardDescription className="text-sm">Latest system activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {stats?.recentActivities?.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-2.5 md:p-3 rounded-lg border">
                {getStatusIcon(activity.status)}
                <div className="flex-1">
                  <p className="text-sm md:text-base font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <Badge className={getStatusColor(activity.status)}>
                  {activity.type}
                </Badge>
              </div>
            ))}
            {(!stats?.recentActivities || stats.recentActivities.length === 0) && (
              <div className="text-center py-6 md:py-8 text-gray-500">
                No recent activities
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 