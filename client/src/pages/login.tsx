import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle, BookOpen, GraduationCap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<FormData>({ 
    resolver: zodResolver(schema), 
    defaultValues: { username: "", password: "" } 
  });
  const { isSubmitting, errors } = form.formState;
  const [open, setOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Clear error when form changes
  useEffect(() => {
    if (loginError) {
      setLoginError("");
    }
  }, [form.watch()]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isSubmitting && !isSuccess) {
        e.preventDefault();
        submitButtonRef.current?.click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, isSuccess]);

  async function onSubmit(values: FormData) {
    setLoginError("");
    try {
      await apiRequest("POST", "/api/auth/login", values);
      setIsSuccess(true);
      toast({ title: "Welcome back!", description: "Signed in successfully" });
      
      // Invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/organization"] });
      
      // Small delay for success animation and data refetch
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (e: any) {
      const errorMessage = e?.message || "Invalid credentials";
      setLoginError(errorMessage);
      toast({ 
        title: "Login failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next && !isSubmitting && !isSuccess) {
      setOpen(false);
      navigate("/");
    } else {
      setOpen(next);
    }
  }

  const hasErrors = Object.keys(errors).length > 0 || loginError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-hafizo-primary via-hafizo-primary-light to-hafizo-primary-dark flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-hafizo-secondary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-hafizo-secondary-light rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-hafizo-secondary rounded-full blur-3xl"></div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          {/* Header with Hafizo branding */}
          <div className="bg-gradient-to-br from-hafizo-primary to-hafizo-primary-dark p-8 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-hafizo-secondary/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-hafizo-secondary/20 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <img src="/uploads/site_icon_bg_white.png" alt="Hafizo" className="h-10 rounded-lg w-10 object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Hafizo</h1>
                  <p className="text-hafizo-secondary-light text-sm">Quran Memorization Platform</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <DialogTitle className="text-xl font-semibold">Welcome Back</DialogTitle>
                <DialogDescription className="text-hafizo-secondary-light">
                  Sign in to your Quran memorization dashboard
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Login Successful!</h3>
                <p className="text-gray-600 mb-6">Redirecting to your dashboard...</p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Spinner className="h-4 w-4" />
                  <span>Loading your workspace</span>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Error Alert */}
                  {loginError && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50 animate-in slide-in-from-top-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-medium">{loginError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Username Field */}
                  <FormField 
                    name="username" 
                    control={form.control} 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                          Username
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-hafizo-primary transition-colors duration-200" />
                            <Input 
                              {...field}
                              autoFocus 
                              disabled={isSubmitting}
                              className={`pl-12 h-12 text-base transition-all duration-200 border-2 ${
                                errors.username 
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                  : 'border-gray-200 focus:border-hafizo-primary focus:ring-hafizo-primary/20'
                              } rounded-xl`}
                              placeholder="Enter your username"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )} 
                  />

                  {/* Password Field */}
                  <FormField 
                    name="password" 
                    control={form.control} 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-hafizo-primary transition-colors duration-200" />
                            <Input 
                              {...field}
                              type={showPassword ? "text" : "password"}
                              disabled={isSubmitting}
                              className={`pl-12 pr-12 h-12 text-base transition-all duration-200 border-2 ${
                                errors.password 
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                  : 'border-gray-200 focus:border-hafizo-primary focus:ring-hafizo-primary/20'
                              } rounded-xl`}
                              placeholder="Enter your password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 transition-colors rounded-lg"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isSubmitting}
                              title={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )} 
                  />

                  {/* Quick Login Demo */}
                  <Card className="border-hafizo-secondary/20 bg-hafizo-secondary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="h-4 w-4 text-hafizo-primary" />
                        <span className="text-sm font-medium text-gray-700">Demo Credentials</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <span className="text-gray-500">Super Admin:</span>
                          <div className="font-mono bg-gray-100 px-2 py-1 rounded">superadmin</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500">Teacher:</span>
                          <div className="font-mono bg-gray-100 px-2 py-1 rounded">teacher1</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500">Parent:</span>
                          <div className="font-mono bg-gray-100 px-2 py-1 rounded">parent1</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500">Student:</span>
                          <div className="font-mono bg-gray-100 px-2 py-1 rounded">student1</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Password: <span className="font-mono">password123</span></p>
                    </CardContent>
                  </Card>

                  <Separator className="my-6" />

                  {/* Submit Button */}
                  <Button 
                    ref={submitButtonRef}
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-hafizo-primary to-hafizo-primary-dark hover:from-hafizo-primary-dark hover:to-hafizo-primary text-white font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none focus:ring-2 focus:ring-hafizo-primary focus:ring-offset-2 rounded-xl shadow-lg hover:shadow-xl" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-3">
                        <Spinner className="h-5 w-5" /> 
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  {/* Footer */}
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">
                      Forgot password? Contact your administrator
                    </p>
                    <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                      <div className="w-1 h-1 bg-hafizo-secondary rounded-full"></div>
                      <span>Secure login with Hafizo</span>
                      <div className="w-1 h-1 bg-hafizo-secondary rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Press Enter to sign in
                    </p>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 