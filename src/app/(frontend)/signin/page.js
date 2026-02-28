"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { ArrowRight, Mail, Lock } from "lucide-react";
import { toast } from 'react-toastify';


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsLoading(true);

//   try {
//     const res = await fetch("/api/signin", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const result = await res.json();

//     if (res.ok) {
//       localStorage.setItem("token", result.token); // ✅ use 'result' not 'data'
//       console.log("Login successful", result.user);
    
//       toast({
//         title: "Welcome back",
//         description: `Logged in as ${result.user.name}`,
//       });
    
//       navigate.push("/"); // redirect
//     } else {
//       // ❌ Show error toast from API response
//       toast({
//         title: "Login failed",
//         description: data.error || "Something went wrong",
//         variant: "destructive",
//       });
//     }

    

    
//   } catch (error) {
//     toast({
//       title: "Login failed",
//       description: error.message,
//       variant: "destructive",
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };

const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const result = await fetch('api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });
            const data = await result.json();
            console.log(data);
            
            if (result.ok) {
                const { user, token } = data;
                console.log(token);
                
                // ✅ Save both token & user
                localStorage.setItem('token', token);
    
                // Save user details in localStorage (or a state management library)
                localStorage.setItem('user', JSON.stringify({ id: user.id, role: user.role }));
    
                // Redirect based on role
                if (user.role === 1) {
                    toast.success('✅ Admin logged in successfully!');
                    router.push('/dashboard');
                } else if (user.role === 0) {
                    toast.success('✅ User logged in successfully!');
                    router.push('/');
                }
            } else {
                setError(data.error);
                toast.error(`❌ ${data.error || "Login failed"}`);
            }
        } catch (error) {
            setError('An unexpected error occured');
            toast.error('🚨 An unexpected error occurred. Please try again.');
        }
    };
    const loginUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User stored in localStorage:', userData); // Check if the user data has `id` or `_id`
    };
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-semibold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your Rugs & Beyond account</p>
        </div>
        
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link href="/forgetPassword" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => 
                  setRememberMe(checked === true)
                }
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"} 
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
