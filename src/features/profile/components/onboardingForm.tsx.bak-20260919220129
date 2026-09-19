"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { OnBoardingSchema } from "../profileSchema";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ImagePicker } from "@/components/ui/image-picker";
import { Input } from "@/components/ui/input";
import { useOnBoarding } from "../profileHook";

const OnBoardingForm = () => {
  const { mutate } = useOnBoarding();

  const form = useForm({
    defaultValues: {
      username: "",
      image_file: null as File | null,
    },
    validators: {
      onSubmit: OnBoardingSchema,
    },
    onSubmit: async () => {
      mutate({
        username: form.getFieldValue("username"),
        imageFile: form.getFieldValue("image_file") as File,
      });
    },
  });

  return (
    <Card className="w-full max-w-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">
            Welcome to <span className="text-primary">Waraq</span>
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Set up your profile to get started.
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4">
          <FieldGroup>
            <form.Field
              name="image_file"
              children={(field) => (
                <Field>
                  <FieldLabel className="text-sm font-medium">
                    Profile picture
                  </FieldLabel>
                  <div className="flex items-center justify-center py-2">
                    <ImagePicker
                      className="rounded-full"
                      onChange={(file) => field.handleChange(file)}
                    />
                  </div>
                  {field.state.meta.errors[0] && (
                    <FieldError>
                      {field.state.meta.errors[0]?.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <form.Field
              name="username"
              children={(field) => (
                <Field>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium"
                  >
                    Username
                  </FieldLabel>
                  <Input
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.currentTarget.value)}
                    placeholder="e.g. john_doe"
                  />
                  {field.state.meta.errors.map((error, i) => (
                    <FieldError key={i}>{error?.message}</FieldError>
                  ))}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>

        <CardFooter className="mt-4">
          <Button type="submit" className="w-full">
            Start your experience!
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default OnBoardingForm;
