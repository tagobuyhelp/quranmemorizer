import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  Users, 
  CreditCard, 
  Calendar, 
  Phone, 
  Mail, 
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useLocation } from "wouter";

interface Organization {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  subscriptionStatus: 'active' | 'inactive' | 'canceled' | 'pending';
  plan?: 'basic' | 'pro' | 'enterprise';
  subscriptionExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  totalRevenue?: number;
}

export default function AdminOrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: organizations, isLoading } = useQuery<Organization[]>({
    queryKey: ["/api/admin/organizations"],
  });

  const createOrgMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/organizations", data);
      if (!response.ok) throw new Error("Failed to create organization");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organizations"] });
      setIsCreateDialogOpen(false);
      toast({ title: "Organization created", description: "Organization has been created successfully." });
    },
    onError: () => {
      toast({ title: "Creation failed", description: "Failed to create organization.", variant: "destructive" });
    },
  });

  const updateOrgMutation = useMutation({
    mutationFn: async ({ orgId, data }: { orgId: string; data: any }) => {
      const response = await apiRequest("PATCH", `/api/admin/organizations/${orgId}`, data);
      if (!response.ok) throw new Error("Failed to update organization");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organizations"] });
      setEditingOrg(null);
      toast({ title: "Organization updated", description: "Organization has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Update failed", description: "Failed to update organization.", variant: "destructive" });
    },
  });

  const deleteOrgMutation = useMutation({
    mutationFn: async (orgId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/organizations/${orgId}`);
      if (!response.ok) throw new Error("Failed to delete organization");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organizations"] });
      toast({ title: "Organization deleted", description: "Organization has been deleted successfully." });
    },
    onError: () => {
      toast({ title: "Delete failed", description: "Failed to delete organization.", variant: "destructive" });
    },
  });

  const filteredOrganizations = organizations?.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan?: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600">Manage organizations and their subscriptions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <CreateOrganizationForm 
              onSubmit={(data) => createOrgMutation.mutate(data)}
              isLoading={createOrgMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Organizations</Label>
          <Input
            id="search"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid gap-6">
        {filteredOrganizations.map((org) => (
          <Card key={org.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{org.name}</h3>
                    <p className="text-sm text-gray-600">{org.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(org.subscriptionStatus)}>
                        {org.subscriptionStatus}
                      </Badge>
                      {org.plan && (
                        <Badge className={getPlanColor(org.plan)}>
                          {org.plan}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        {org.memberCount} members
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOrg(org);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingOrg(org)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this organization?")) {
                        deleteOrgMutation.mutate(org.id);
                      }
                    }}
                    disabled={deleteOrgMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
          <p className="text-gray-600">
            {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first organization."}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      {editingOrg && (
        <Dialog open={!!editingOrg} onOpenChange={() => setEditingOrg(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Organization: {editingOrg.name}</DialogTitle>
            </DialogHeader>
            <EditOrganizationForm 
              organization={editingOrg}
              onSubmit={(data) => updateOrgMutation.mutate({ orgId: editingOrg.id, data })}
              isLoading={updateOrgMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* View Dialog */}
      {selectedOrg && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Organization Details</DialogTitle>
            </DialogHeader>
            <OrganizationDetails organization={selectedOrg} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Create Organization Form Component
function CreateOrganizationForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    plan: "basic",
    subscriptionStatus: "active"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="plan">Plan</Label>
        <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.subscriptionStatus} onValueChange={(value) => setFormData({ ...formData, subscriptionStatus: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Spinner className="h-4 w-4 mr-2" /> : null}
        Create Organization
      </Button>
    </form>
  );
}

// Edit Organization Form Component
function EditOrganizationForm({ organization, onSubmit, isLoading }: { 
  organization: Organization; 
  onSubmit: (data: any) => void; 
  isLoading: boolean 
}) {
  const [formData, setFormData] = useState({
    name: organization.name,
    description: organization.description || "",
    email: organization.email || "",
    phone: organization.phone || "",
    address: organization.address || "",
    plan: organization.plan || "basic",
    subscriptionStatus: organization.subscriptionStatus
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="plan">Plan</Label>
        <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.subscriptionStatus} onValueChange={(value) => setFormData({ ...formData, subscriptionStatus: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Spinner className="h-4 w-4 mr-2" /> : null}
        Update Organization
      </Button>
    </form>
  );
}

// Organization Details Component
function OrganizationDetails({ organization }: { organization: Organization }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-500">Name</Label>
          <p className="text-sm">{organization.name}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Status</Label>
          <Badge className={organization.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {organization.subscriptionStatus}
          </Badge>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Plan</Label>
          <Badge className={organization.plan === 'enterprise' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
            {organization.plan || 'No plan'}
          </Badge>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Members</Label>
          <p className="text-sm">{organization.memberCount}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Email</Label>
          <p className="text-sm">{organization.email || 'Not provided'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Phone</Label>
          <p className="text-sm">{organization.phone || 'Not provided'}</p>
        </div>
        <div className="col-span-2">
          <Label className="text-sm font-medium text-gray-500">Description</Label>
          <p className="text-sm">{organization.description || 'No description'}</p>
        </div>
        <div className="col-span-2">
          <Label className="text-sm font-medium text-gray-500">Address</Label>
          <p className="text-sm">{organization.address || 'Not provided'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Created</Label>
          <p className="text-sm">{new Date(organization.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
          <p className="text-sm">{new Date(organization.updatedAt).toLocaleDateString()}</p>
        </div>
        {organization.subscriptionExpiresAt && (
          <div className="col-span-2">
            <Label className="text-sm font-medium text-gray-500">Subscription Expires</Label>
            <p className="text-sm">{new Date(organization.subscriptionExpiresAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
} 