import { useMutation } from "@tanstack/react-query";
import { LoginSchemaType, SignUpSchemaType } from "./authSchema";
import {
  handleForgotPassword,
  handleLogin,
  handleLogout,
  handleSignUp,
  handleUpdatePassword,
} from "./authApi";
import { useRouter } from "next/navigation";

export const useSignUp = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (signUpCredentials: SignUpSchemaType) => {
      return handleSignUp(signUpCredentials);
    },
    onSuccess: () => {
      router.push("/onBoarding");
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (loginCredentials: LoginSchemaType) => {
      return handleLogin(loginCredentials);
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
};

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      await handleForgotPassword(email);
    },
  });
};

export const useUpdatePassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (password: string) => {
      await handleUpdatePassword(password);
    },
    onSuccess: () => {
      router.push("/auth/sign-up-success");
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: handleLogout,
    onError: () => {
      console.log("error logging you out");
    },
    onSuccess: () => {
      router.push("/auth/login");
    },
  });
};
