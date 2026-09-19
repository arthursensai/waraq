"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchProfile } from "../profileHook";

const ProfileTrigger = () => {
  const { data: profile, isLoading } = useFetchProfile();

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-8 w-36" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/dashboard/profile"
      className="w-full h-full flex items-center gap-2"
    >
      <Avatar>
        <AvatarImage src={profile?.image} />
        <AvatarFallback>{profile?.username[0]}</AvatarFallback>
      </Avatar>
      <h1 className="font-semibold">{profile?.username}</h1>
    </Link>
  );
};

export default ProfileTrigger;
