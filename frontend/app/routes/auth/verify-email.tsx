import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react"; // Icons for better UX
import { verifyEmailApi } from "@/services/auth-service";
import { Link, useSearchParams } from "react-router";

const VerifyEmail = () => {
  // Hook to retrieve query parameters from the URL
  const [searchParams] = useSearchParams();

  // State management for UI status and messages
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your email address...");

  // Get token and email from URL (e.g., ?token=xyz&email=abc)
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    // If token or email is missing in the URL, show error immediately
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link. Please check your email again.");
      return;
    }

    // Function to call the backend API
    const verify = async () => {
      try {
        await verifyEmailApi({ token, email });
        setStatus("success");
        setMessage("Email verified successfully! You can now sign in.");
      } catch (error: any) {
        setStatus("error");
        // Display error message from backend or a default one
        setMessage(
          error.response?.data?.message ||
            "Verification failed or link expired.",
        );
      }
    };

    // Execute verification
    verify();
  }, [token, email]);

  return (
    <div className="md:min-w-md min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full shadow-xl sm:w-[400px]">
        <CardHeader className="text-center mb-2">
          {/* Dynamic Icon based on status */}
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="h-12 w-12 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>

          <CardTitle className="text-2xl font-bold">
            {status === "loading"
              ? "Verifying..."
              : status === "success"
                ? "Verified!"
                : "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-2">
            {message}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-4">
          {/* Show 'Sign In' button only on success */}
          {status === "success" && (
            <Button asChild className="w-full">
              <Link to="/sign-in">Sign in to your account</Link>
            </Button>
          )}

          {/* Show 'Back to Sign Up' on error */}
          {status === "error" && (
            <Button variant="outline" asChild className="w-full">
              <Link to="/sign-up">Back to Sign up</Link>
            </Button>
          )}

          {/* Link to go back to Sign In page in non-success states */}
          {status !== "success" && (
            <div className="mt-2 text-center">
              <Link
                to="/sign-in"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Back to Sign in
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
