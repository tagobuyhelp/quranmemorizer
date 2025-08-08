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
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
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
      
      // Small delay for success animation
      setTimeout(() => {
        navigate("/quick");
      }, 800);
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">Welcome Back</DialogTitle>
              <DialogDescription className="text-blue-100">
                Sign in to your Hifz tracking dashboard
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Successful!</h3>
              <p className="text-gray-600">Redirecting to dashboard...</p>
              <div className="mt-4">
                <Spinner className="h-6 w-6 mx-auto" />
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Error Alert */}
                {loginError && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50 animate-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}

                {/* Username Field */}
                <FormField 
                  name="username" 
                  control={form.control} 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Username
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input 
                            {...field}
                            autoFocus 
                            disabled={isSubmitting}
                            className={`pl-10 h-11 transition-all duration-200 ${
                              errors.username ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'
                            }`}
                            placeholder="Enter your username"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />

                {/* Password Field */}
                <FormField 
                  name="password" 
                  control={form.control} 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input 
                            {...field}
                            type={showPassword ? "text" : "password"}
                            disabled={isSubmitting}
                            className={`pl-10 pr-10 h-11 transition-all duration-200 ${
                              errors.password ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'
                            }`}
                            placeholder="Enter your password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
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
                      <FormMessage />
                    </FormItem>
                  )} 
                />

                <Separator className="my-6" />

                {/* Submit Button */}
                <Button 
                  ref={submitButtonRef}
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="h-4 w-4" /> 
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Footer */}
                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">
                    Forgot password? Contact your administrator
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span>Secure login</span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Press Enter to sign in
                  </p>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 