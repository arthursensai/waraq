"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileSchema } from "../profileSchema";
import { useFetchProfile, useUpdateProfile } from "../profileHook";
import { ImagePicker } from "@/components/ui/image-picker";
import { Skeleton } from "@/components/ui/skeleton";
import LogoutButton from "../../auth/components/logoutDialog";

const ProfileForm = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: profile, isLoading, isError } = useFetchProfile();

  const { mutate } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      id: profile?.id ?? "",
      username: profile?.username ?? "",
      image_file: null as File | null,
      image_id: profile?.image_id ?? (null as string | null),
    },
    validators: {
      onChange: ProfileSchema,
    },
    onSubmit: () => {
      mutate({
        profileId: form.getFieldValue("id"),
        imageId: form.getFieldValue("image_id"),
        username: form.getFieldValue("username"),
        imageFile: imageFile ?? undefined,
      });
    },
  });

  useEffect(() => {
    form.setFieldValue("username", profile?.username);
    form.setFieldValue("id", profile?.id);
    form.setFieldValue("image_id", profile?.image_id ?? null);
  }, [profile, form]);

  if (isLoading)
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-8 w-36" />
        </div>
      </div>
    );

  if (isError) return <div>error fetching your profile</div>;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="image_file">
            {() => (
              <div className="w-full flex items-center justify-center">
                <ImagePicker
                  value={profile?.image}
                  className="rounded-full"
                  onChange={(file) => setImageFile(file)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="username">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>

                <Input
                  name={field.name}
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                />

                {field.state.meta.errors.map((error, i) => (
                  <FieldError key={i}>{error?.message}</FieldError>
                ))}
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <Button type="submit">Update profile</Button>
      </form>

      <div className="border-t border-border pt-4">
        <LogoutButton />
      </div>
    </div>
  );
};

export default ProfileForm;
