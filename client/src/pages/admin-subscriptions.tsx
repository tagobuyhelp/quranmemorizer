import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  DollarSign,
  Building2,
  Users,
  Filter,
  Download,
  Eye
} from "lucide-react";
import { useLocation } from "wouter";

interface Subscription {
  id: string;
  organizationId: string;
  organizationName: string;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'canceled' | 'pending' | 'expired';
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  paymentMethod: 'razorpay' | 'phonepe';
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  totalPayments: number;
  memberCount: number;
}

interface SubscriptionStats {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  planDistribution: {
    basic: number;
    pro: number;
    enterprise: number;
  };
  paymentMethods: {
    razorpay: number;
    phonepe: number;
  };
}

export default function AdminSubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: subscriptions, isLoading } = useQuery<Subscription[]>({
    queryKey: ["/api/admin/subscriptions"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<SubscriptionStats>({
    queryKey: ["/api/admin/subscriptions/stats"],
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ subId, data }: { subId: string; data: any }) => {
      const response = await apiRequest("PATCH", `/api/admin/subscriptions/${subId}`, data);
      if (!response.ok) throw new Error("Failed to update subscription");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscriptions/stats"] });
      toast({ title: "Subscription updated", description: "Subscription has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Update failed", description: "Failed to update subscription.", variant: "destructive" });
    },
  });

  const filteredSubscriptions = subscriptions?.filter(sub => {
    const matchesSearch = sub.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesPlan = planFilter === "all" || sub.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100); // Assuming amount is in paise
  };

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600">Manage and monitor subscription data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              All time revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.monthlyRecurringRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Monthly recurring revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeSubscriptions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.churnRate || 0).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Monthly churn rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Active subscriptions by plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Basic</span>
              </div>
              <Badge variant="secondary">{stats?.planDistribution.basic || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Pro</span>
              </div>
              <Badge variant="secondary">{stats?.planDistribution.pro || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Enterprise</span>
              </div>
              <Badge variant="secondary">{stats?.planDistribution.enterprise || 0}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Subscriptions by payment provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Razorpay</span>
              </div>
              <Badge variant="secondary">{stats?.paymentMethods.razorpay || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">PhonePe</span>
              </div>
              <Badge variant="secondary">{stats?.paymentMethods.phonepe || 0}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Organizations</Label>
          <Input
            id="search"
            placeholder="Search by organization name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="plan">Plan</Label>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-32 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>Manage and monitor all subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSubscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{sub.organizationName}</h3>
                    <p className="text-sm text-gray-600">
                      {sub.memberCount} members • {sub.billingCycle} billing
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(sub.status)}>
                        {sub.status}
                      </Badge>
                      <Badge className={getPlanColor(sub.plan)}>
                        {sub.plan}
                      </Badge>
                      <Badge variant="outline">
                        {formatCurrency(sub.amount, sub.currency)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">Next Billing</p>
                    <p className="text-xs text-gray-500">
                      {new Date(sub.nextBillingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSubscription(sub);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No subscriptions found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Subscription Dialog */}
      {selectedSubscription && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
            </DialogHeader>
            <SubscriptionDetails subscription={selectedSubscription} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Subscription Details Component
function SubscriptionDetails({ subscription }: { subscription: Subscription }) {
  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-500">Organization</Label>
          <p className="text-sm font-medium">{subscription.organizationName}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Status</Label>
          <Badge className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {subscription.status}
          </Badge>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Plan</Label>
          <Badge className={subscription.plan === 'enterprise' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
            {subscription.plan}
          </Badge>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Amount</Label>
          <p className="text-sm font-medium">{formatCurrency(subscription.amount, subscription.currency)}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Billing Cycle</Label>
          <p className="text-sm">{subscription.billingCycle}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Payment Method</Label>
          <p className="text-sm capitalize">{subscription.paymentMethod}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Start Date</Label>
          <p className="text-sm">{new Date(subscription.startDate).toLocaleDateString()}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">End Date</Label>
          <p className="text-sm">{new Date(subscription.endDate).toLocaleDateString()}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Next Billing</Label>
          <p className="text-sm">{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Members</Label>
          <p className="text-sm">{subscription.memberCount}</p>
        </div>
        {subscription.lastPaymentDate && (
          <div>
            <Label className="text-sm font-medium text-gray-500">Last Payment</Label>
            <p className="text-sm">{new Date(subscription.lastPaymentDate).toLocaleDateString()}</p>
          </div>
        )}
        {subscription.lastPaymentAmount && (
          <div>
            <Label className="text-sm font-medium text-gray-500">Last Payment Amount</Label>
            <p className="text-sm">{formatCurrency(subscription.lastPaymentAmount, subscription.currency)}</p>
          </div>
        )}
        <div>
          <Label className="text-sm font-medium text-gray-500">Total Payments</Label>
          <p className="text-sm">{subscription.totalPayments}</p>
        </div>
      </div>
    </div>
  );
} 