"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const ProfileModal = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    data: profile,
    error,
    isLoading,
    isError,
    refetch,
  } = useFetchProfile();

  const { mutate } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      id: profile?.username ?? "",
      username: profile?.username ?? "",
      image_file: null as File | null,
      image_id: profile?.id ?? "",
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

  const handleClearForm = async () => {
    form.reset();
    setImageFile(null);
  };

  useEffect(() => {
    form.setFieldValue("username", profile?.username);
    form.setFieldValue("id", profile?.id);
    form.setFieldValue("image_id", profile?.image_id);
  }, [profile]);

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
    <Dialog
      onOpenChange={(open) => {
        if (!open) handleClearForm();
      }}
    >
      <DialogTrigger asChild>
        <div className="w-full h-full flex items-center gap-2">
          <Avatar>
            <AvatarImage src={profile?.image} />
            <AvatarFallback>{profile?.username[0]}</AvatarFallback>
          </Avatar>
          <h1 className="font-semibold">{profile?.username}</h1>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">Your Profile</DialogTitle>
          <DialogDescription className="text-left">
            Here where you can manage your profile.
          </DialogDescription>
        </DialogHeader>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}>
          <FieldGroup>
            <form.Field
              name="image_file"
              children={(field) => (
                <div className="w-full flex items-center justify-center">
                  <ImagePicker
                    value={profile?.image}
                    className="rounded-full"
                    onChange={(file) => setImageFile(file)}
                  />
                </div>
              )}
            />

            <form.Field
              name="username"
              children={(field) => (
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
            />
          </FieldGroup>

          <Button type="submit">Update profile</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
