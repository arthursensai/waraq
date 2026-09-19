"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { SignUpSchema } from "../authSchema";
import { useSignUp } from "../authHook";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const SignUpForm = () => {
  const { mutate, isPending, error } = useSignUp();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: SignUpSchema,
    },
    onSubmit: async () => {
      mutate({
        email: form.getFieldValue("email"),
        password: form.getFieldValue("password"),
        confirmPassword: form.getFieldValue("confirmPassword"),
      });
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign up</CardTitle>
        <CardDescription>Create a new account</CardDescription>
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
            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.errors[0] && !field.state.value;
                return (
                  <Field>
                    <FieldLabel>Confirm Password:</FieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      type="password"
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
            {isPending ? <Spinner className="size-6" /> : "Sign up"}
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
