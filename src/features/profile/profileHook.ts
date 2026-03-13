"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateImage, updateProfile } from "./profileAPI";
import { toast } from "sonner";

export const useFetchProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const toastId = "update-profile";

  return useMutation({
    mutationFn: async ({
      profileId,
      username,
      imageFile,
      imageId,
    }: {
      profileId: string;
      username: string;
      imageId: string;
      imageFile?: File;
    }) => {
      await Promise.all([
        imageFile ? updateImage(imageFile, profileId, imageId) : null,
        updateProfile({ username, profile_id: profileId }),
      ]);
    },

    onMutate: () => {
      toast.loading("Updating your profile...", { id: toastId });
    },

    onError: (mutateIsError) => {
      toast.error("Error updating your profile", { id: toastId });
    },

    onSuccess: () => {
      toast.success("Your profile was successfully updated", { id: toastId });

      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
