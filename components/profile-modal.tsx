"use client";

import { fetchProfile, updateProfile } from "@/src/api/profile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { profileSchema } from "@/types/interfaces";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { useForm } from "@tanstack/react-form";
import { Field, FieldTitle } from "./ui/field";
import { Input } from "./ui/input";
import { Profile } from "@/schemas/profileSchema";
import { Button } from "./ui/button";
import { toast } from "sonner";
import ProfilePreview from "./profile-preview";

const ProfileModal = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  let user = data as profileSchema;

  const form = useForm({
    defaultValues: user
      ? {
          username: user.username,
          image: user.image,
        }
      : {
          username: "",
          image: "",
        },
    validators: {
      onSubmit: ({ value }) => {
        const result = Profile.safeParse(value);
        if (!result.success) return result.error;
      },
    },
    onSubmit: async () => {
      await updateUserProfile.mutateAsync();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await form.handleSubmit(async () => {
      await updateUserProfile.mutateAsync();
    });
  };

  const updateUserProfile = useMutation({
    mutationFn: () => {
      return updateProfile({
        username: form.getFieldValue("username"),
        image: form.getFieldValue("image"),
      });
    },
    onSuccess: (data) => {
      form.reset();
      user = data as profileSchema;
      toast.success("your profile was successfully updated!", {
        position: "bottom-right",
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error updating your profile!", {
        position: "bottom-right",
      });
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        image: user.image,
      });
    }
  }, [user, form]);

  if (isPending) {
    return (
      <div className="w-full h-full">
        <Skeleton />
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer flex items-center gap-2">
          <ProfilePreview />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your profile</DialogTitle>
          <DialogDescription>Modify your own profile here.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <form.Field
            name="username"
            children={(field) => (
              <Field>
                <FieldTitle>Username</FieldTitle>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          />
          <form.Field
            name="image"
            children={(field) => (
              <Field>
                <FieldTitle>Picture</FieldTitle>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
