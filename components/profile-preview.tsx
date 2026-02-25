"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { profileSchema } from "@/types/interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { fetchProfile } from "@/api/profile";

const ProfilePreview = () => {
  const { isPending, data, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile
  });

  if (isPending) {
    return (
      <div className="w-full h-full">
        <Skeleton />;
      </div>
    );
  }

  const user = data as profileSchema;

  return (
    <div className="w-full h-full flex items-center gap-2">
      <Avatar>
        <AvatarImage src={user.image} />
        <AvatarFallback>{user.username[0]}</AvatarFallback>
      </Avatar>
      <h1 className="font-semibold">{user.username}</h1>
    </div>
  );
};

export default ProfilePreview;
