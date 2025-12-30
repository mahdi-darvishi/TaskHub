import { signInSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useSignInMutation } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/provider/auth-context";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/lib/fetch-util";
// اگر InputOTP نداری، این ایمپورت‌ها رو حذف کن و جاش Input معمولی بذار
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type SigninFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State برای مدیریت مراحل: اول لاگین، بعد کد
  const [step, setStep] = useState<"LOGIN" | "2FA">("LOGIN");
  // ذخیره ایمیل برای مرحله دوم
  const [emailFor2FA, setEmailFor2FA] = useState("");

  const form = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginMutate, isPending: isLoginPending } =
    useSignInMutation();

  // هوک برای ارسال کد OTP به بک‌اند
  const { mutate: verify2FAMutate, isPending: isVerifyPending } = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      // این درخواست توکن واقعی رو برمی‌گردونه
      return await postData("/auth/verify-2fa", data);
    },
    onSuccess: (data) => {
      // ✅ حالا که توکن واقعی اومد، لاگین میکنیم
      login(data);
      toast.success("Signed in successfully!");
      navigate("/dashboard"); // یا هر صفحه‌ای که بعد لاگین میره
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid code");
    },
  });

  const onLoginSubmit = (values: SigninFormData) => {
    loginMutate(values, {
      onSuccess: (data: any) => {
        console.log("Login Response:", data); // برای دیباگ

        // 🛑 شرط حیاتی: اگر 2FA لازم بود، لاگین نکن! فقط استپ رو عوض کن
        if (data.twoFactorRequired) {
          setEmailFor2FA(data.email || values.email);
          setStep("2FA"); // تغییر UI به حالت کد
          toast.info("Verification code sent to your email.");
        } else {
          // اگر 2FA خاموش بود، مثل قدیم لاگین کن
          login(data);
          toast.success("Signed in successfully!");
          navigate("/dashboard");
        }
      },
      onError: (error: any) => {
        const ErrorMessage =
          error.response?.data?.message || "Something went wrong";
        toast.error(ErrorMessage);
      },
    });
  };

  const onOTPSubmit = (otp: string) => {
    if (otp.length !== 6) return;
    verify2FAMutate({ email: emailFor2FA, otp });
  };

  return (
    <div className="min-w-md min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full shadow-xl max-w-md">
        <CardHeader className="text-center mb-5">
          <CardTitle className="text-2xl font-bold">
            {step === "LOGIN" ? "Welcome back" : "Two-Factor Auth"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {step === "LOGIN"
              ? "Sign in to your account to continue"
              : `Enter the code sent to ${emailFor2FA}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* --- STEP 1: LOGIN FORM --- */}
          {step === "LOGIN" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onLoginSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-blue-600"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoginPending}
                >
                  {isLoginPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* --- STEP 2: OTP FORM --- */}
          {step === "2FA" && (
            <div className="flex flex-col items-center space-y-6 animate-in fade-in slide-in-from-right-8">
              <div className="flex justify-center w-full">
                {/* اگر InputOTP نداری، این قسمت رو با Input معمولی عوض کن */}
                <InputOTP
                  maxLength={6}
                  onChange={(val: any) => {
                    if (val.length === 6) onOTPSubmit(val);
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="w-full space-y-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    /* لاجیک سابمیت دستی اگر کاربر اینتر نزد */
                  }}
                  disabled={isVerifyPending}
                >
                  {isVerifyPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep("LOGIN")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Button>
              </div>
            </div>
          )}

          {step === "LOGIN" && (
            <CardFooter className="flex items-center justify-center mt-6 p-0">
              <div>
                <p className=" text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link to="/sign-up"> Sign up</Link>
                </p>
              </div>
            </CardFooter>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
