import { postData } from "@/lib/fetch-util";

// Define input data type
interface VerifyEmailData {
  token: string;
  email: string;
}

// Define response type
interface VerifyEmailResponse {
  message: string;
}

export const verifyEmailApi = async (data: VerifyEmailData) => {
  // Sends request to: /api-v1/auth/verify-email
  return await postData<VerifyEmailResponse>("/auth/verify-email", data);
};
