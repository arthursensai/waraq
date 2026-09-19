"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { LoginSchema } from "../authSchema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useLogin } from "../authHook";
import { Spinner } from "@/components/ui/spinner";

const LoginForm = () => {
  const { mutate, isPending, error } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginSchema,
    },
    onSubmit: () => {
      mutate({
        email: form.getFieldValue("email"),
        password: form.getFieldValue("password"),
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.errors[0] && !field.state.value;
                return (
                  <Field>
                    <FieldLabel>Email:</FieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      placeholder="m@example.com"
                      required
                      type={field.name}
                      onChange={(e) =>
                        field.handleChange(e.currentTarget.value)
                      }
                      aria-invalid={isInvalid}
                    />
                    {field.state.meta.errors && (
                      <FieldError>
                        {field.state.meta.errors[0]?.message}
                      </FieldError>
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.errors[0] && !field.state.value;
                return (
                  <Field>
                    <FieldLabel>Password:</FieldLabel>

                    <Input
                      name={field.name}
                      value={field.state.value}
                      type={field.name}
                      required
                      onChange={(e) =>
                        field.handleChange(e.currentTarget.value)
                      }
                      aria-invalid={isInvalid}
                    />
                    {field.state.meta.errors && (
                      <FieldError>
                        {field.state.meta.errors[0]?.message}
                      </FieldError>
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          {error && <p className="text-destructive">{error.message}</p>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Spinner className="size-6" /> : "Login"}
          </Button>
          <div className="flex flex-col items-center justify-center gap-4">
            <div>
              <Link
                href="/auth/forgot-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <div>
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
