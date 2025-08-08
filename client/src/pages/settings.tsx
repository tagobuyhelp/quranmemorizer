import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export default function SettingsPage() {
  const { data: org } = useQuery<any>({ queryKey: ["/api/organization"] });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: "", description: "" } });
  const { isDirty, isSubmitting } = form.formState;

  useEffect(() => {
    if (org) form.reset({ name: org.name || "", description: org.description || "" });
  }, [org]);

  async function onSubmit(values: z.infer<typeof schema>) {
    await apiRequest("POST", "/api/organization", values);
    await queryClient.invalidateQueries({ queryKey: ["/api/organization"] });
    toast({ title: "Saved", description: "Organization details updated" });
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-lg font-semibold mb-4">Organization Settings</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                {isSubmitting ? (<span className="inline-flex items-center gap-2"><Spinner className="h-4 w-4" /> Saving…</span>) : ("Save")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 