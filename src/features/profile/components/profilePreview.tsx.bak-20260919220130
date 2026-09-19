"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePreview = ({
  username,
  image_url,
}: {
  username: string;
  image_url: string;
}) => {
  return (
    <div className="w-full h-full flex items-center gap-2">
      <Avatar>
        <AvatarImage src={image_url} />
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>
      <h1 className="font-semibold">{username}</h1>
    </div>
  );
};

export default ProfilePreview;
