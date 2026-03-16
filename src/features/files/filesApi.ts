"use server";

import utapi from "@/lib/uploadThing";
import { UTFile } from "uploadthing/server";

export const saveFile = async (file: File, name?: string) => {
  const fileToUpload = name
    ? new UTFile([await file.arrayBuffer()], name, { type: file.type })
    : file;

  const { data, error } = await utapi.uploadFiles(fileToUpload);

  if (error) {
    throw new Error(`Upload File error: ${error.message}`);
  }

  return data;
};

export const deleteFile = async (fileKey: string) => {
  const { success } = await utapi.deleteFiles(fileKey);
  if (!success) throw new Error(`File deleting error!`);
};
