"use client"
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, User, Mail, Lock, ShieldCheck, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import PhoneNumber from "@/components/PhoneNumber";
import { toast } from "react-toastify";

const SignUp = () => {
  // Step 1: signup form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Step 2: OTP verification state
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef([]);
  const navigate = useRouter();

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ── Step 1: Handle Signup Form Submit ──────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions to continue");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Signup failed");
      }

      toast.success("✅ OTP sent! Please check your email.");
      setStep(2);
      setCountdown(60); // allow resend after 60 seconds
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP Input Handlers ─────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // take only last char
    setOtp(newOtp);
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // ── Step 2: Verify OTP ─────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Verification failed");
      }

      toast.success("🎉 Email verified! Redirecting to sign in...");
      setTimeout(() => navigate.push("/signin"), 1500);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Resend OTP ─────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to resend OTP");

      toast.success("✅ New OTP sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      otpRefs.current[0]?.focus();
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setIsResending(false);
    }
  };

  // ── UI ─────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-md mx-auto">

        {/* ── STEP 1: Signup Form ── */}
        {step === 1 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif font-semibold mb-2">Create Account</h1>
              <p className="text-muted-foreground">Join Sumaiya Home to start shopping</p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Smith"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">Email</label>
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

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">Password</label>
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
                      minLength={8}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <PhoneNumber value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                  />
                  <label htmlFor="terms" className="text-sm leading-tight">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Create Account"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary font-medium hover:underline">Sign in</Link>
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── STEP 2: OTP Verification ── */}
        {step === 2 && (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-serif font-semibold mb-2">Verify Your Email</h1>
              <p className="text-muted-foreground">
                We sent a 6-digit verification code to
              </p>
              <p className="font-medium text-foreground mt-1">{email}</p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
              {/* OTP Boxes */}
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground transition-all"
                    style={{ borderColor: digit ? "hsl(var(--primary))" : undefined }}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <Button
                className="w-full mb-4"
                onClick={handleVerifyOtp}
                disabled={isVerifying || otp.join("").length !== 6}
              >
                {isVerifying ? "Verifying..." : "Verify & Complete Signup"}
                {!isVerifying && <ShieldCheck className="ml-2 h-4 w-4" />}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
                <button
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isResending}
                  className="text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`} />
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : isResending ? "Sending..." : "Resend OTP"}
                </button>
              </div>

              {/* Back to form */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); }}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  ← Change email or go back
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              ⏱️ The OTP code expires in 10 minutes
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;