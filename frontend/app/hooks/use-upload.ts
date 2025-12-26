import { uploadFile } from "@/lib/fetch-util";
import { useMutation } from "@tanstack/react-query";

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: (file: File) => uploadFile("/upload", file),
    onSuccess: (data) => {
      console.log("Upload success:", data);
    },
    onError: (error) => {
      console.error("Upload error:", error);
    },
  });
};
