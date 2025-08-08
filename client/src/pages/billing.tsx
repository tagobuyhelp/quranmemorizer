import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

declare global {
  interface Window { Razorpay?: any }
}

export default function BillingPage() {
  const { data: me } = useQuery<{ user: any }>({ queryKey: ["/api/auth/me"] });
  const { data: org } = useQuery<{ name: string; description?: string; subscriptionStatus: string; plan?: string }>({ queryKey: ["/api/organization"] });
  const [plans, setPlans] = useState<any>({});
  const [selected, setSelected] = useState<string>("basic");
  const [creating, setCreating] = useState(false);
  const [key, setKey] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "phonepe">("razorpay");
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/billing/plans", { credentials: "include" }).then(r => r.json()).then(setPlans);
    fetch("/api/billing/razorpay/key", { credentials: "include" }).then(r => r.json()).then(d => setKey(d.key || ""));
  }, []);

  useEffect(() => {
    if (!window.Razorpay) {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  async function checkout() {
    if (!me?.user?.organizationId) return toast({ title: "No organization", description: "Select organization first", variant: "destructive" });
    setCreating(true);
    try {
      if (paymentMethod === "razorpay") {
        if (!key) return toast({ title: "Razorpay not configured", description: "Missing public key", variant: "destructive" });
        
        const res = await apiRequest("POST", "/api/billing/razorpay/checkout", { plan: selected, organizationId: me.user.organizationId });
        const data = await res.json();

        const options = {
          key,
          amount: data.amount,
          currency: data.currency,
          name: org?.name || "Subscription",
          description: `${selected} plan subscription`,
          order_id: data.orderId,
          notes: { organizationId: me.user.organizationId, plan: selected },
          handler: function () {
            toast({ title: "Payment initiated", description: "We will activate your plan after confirmation." });
          },
          prefill: {},
          theme: { color: "#0ea5e9" },
        };
        const rz = new window.Razorpay(options);
        rz.open();
      } else {
        // PhonePe payment
        const res = await apiRequest("POST", "/api/billing/phonepe/checkout", { plan: selected, organizationId: me.user.organizationId });
        const data = await res.json();
        
        if (data.success) {
          window.location.href = data.redirectUrl;
        } else {
          toast({ title: "Payment failed", description: "Could not initiate PhonePe payment", variant: "destructive" });
        }
      }
    } catch (error) {
      toast({ title: "Payment error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Billing</h1>
          <p className="text-sm text-gray-600">Status: <span className="font-medium capitalize">{org?.subscriptionStatus || "loading"}</span>{org?.plan ? ` • Plan: ${org.plan}` : ""}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {Object.keys(plans).length === 0 ? (
          <div className="col-span-3 flex items-center justify-center p-6"><Spinner className="h-6 w-6" /></div>
        ) : (
          Object.keys(plans).map((key) => (
            <Card key={key} className={`cursor-pointer ${selected===key ? "ring-2 ring-primary" : ""}`} onClick={() => setSelected(key)}>
              <CardContent className="p-4 space-y-1">
                <div className="font-medium capitalize">{key}</div>
                <div className="text-2xl font-semibold">₹{(plans[key].price/100).toFixed(0)}<span className="text-sm text-gray-500">/mo</span></div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "razorpay" | "phonepe")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
          <TabsTrigger value="phonepe">PhonePe</TabsTrigger>
        </TabsList>
        <TabsContent value="razorpay" className="space-y-4">
          <div className="text-sm text-gray-600">
            Pay securely with Razorpay using UPI, cards, or net banking.
          </div>
        </TabsContent>
        <TabsContent value="phonepe" className="space-y-4">
          <div className="text-sm text-gray-600">
            Pay with PhonePe using UPI, wallet, or cards.
          </div>
        </TabsContent>
      </Tabs>

      <div>
        <Button onClick={checkout} disabled={creating || !plans[selected]}>
          {creating ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="h-4 w-4" /> 
              {paymentMethod === "razorpay" ? "Creating order…" : "Redirecting to PhonePe…"}
            </span>
          ) : (
            `Pay with ${paymentMethod === "razorpay" ? "Razorpay" : "PhonePe"}`
          )}
        </Button>
      </div>
    </div>
  );
}
