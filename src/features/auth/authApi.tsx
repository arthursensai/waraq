import { createClient } from "@/lib/supabase/client";
import { LoginSchemaType, SignUpSchemaType } from "./authSchema";

export const handleSignUp = async ({ email, password }: SignUpSchemaType) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) throw new Error(error.message);

  return data;
};

export const handleLogin = async (loginCredentials: LoginSchemaType) => {
  const supabase = createClient();
  const { data, error } =
    await supabase.auth.signInWithPassword(loginCredentials);

  if (error) throw new Error(error.message);

  return data;
};

export const handleForgotPassword = async (email: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  });

  if (error) throw new Error(error.message);

  return data;
};

export const handleUpdatePassword = async (password: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.updateUser({ password });
  
  if (error) throw new Error(error.message);

  return data;
};
