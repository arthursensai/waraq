"use client";

import { useForm } from "@tanstack/react-form";
import { useForgetPassword } from "../authHook";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { LoginSchema } from "../authSchema";
import { Spinner } from "@/components/ui/spinner";

const ForgetPasswordForm = () => {
  const { mutate, isPending, isSuccess, error } = useForgetPassword();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = LoginSchema.pick({ email: true }).safeParse({
          email: value.email,
        });
        if (!result.success) {
          return result.error.issues[0]?.message;
        }
      },
    },
    onSubmit: async () => {
      mutate(form.getFieldValue("email"));
    },
  });

  return (
    <div>
      {isSuccess ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Type in your email and we&apos;ll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid = !!field.state.meta.errors[0];
                    return (
                      <Field className="grid gap-2">
                        <FieldLabel htmlFor="email">Email:</FieldLabel>
                        <Input
                          id={field.name}
                          type={field.name}
                          placeholder="m@example.com"
                          required
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(e.currentTarget.value)
                          }
                          aria-invalid={isInvalid}
                        />
                        {field.state.meta.errors && (
                          <FieldError>{field.state.meta.errors[0]}</FieldError>
                        )}
                      </Field>
                    );
                  }}
                />
                {error && <p className="text-destructive">{error.message}</p>}
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Spinner className="size-6" />
                  ) : (
                    "Send reset email"
                  )}
                </Button>
              </FieldGroup>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ForgetPasswordForm;
