"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useUpdatePassword } from "../authHook";
import { LoginSchema } from "../authSchema";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

const UpdatePasswordForm = () => {
  const { mutate, isPending, error } = useUpdatePassword();
  const form = useForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = LoginSchema.pick({ password: true }).safeParse({
          password: value.password,
        });
        if (!result.success) {
          return result.error.issues[0]?.message;
        }
      },
    },
    onSubmit: async () => {
      mutate(form.getFieldValue("password"));
    },
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="flex flex-col gap-6">
              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid = !!field.state.meta.errors[0];
                  return (
                    <Field>
                      <Label htmlFor="password">New password:</Label>
                      <Input
                        id={field.name}
                        type={field.name}
                        placeholder="New password"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {field.state.meta.errors && (
                        <FieldError>{field.state.meta.errors}</FieldError>
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
                  "Save new password"
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordForm;
