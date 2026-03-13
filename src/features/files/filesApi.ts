"use server";

import utapi from "@/lib/uploadThing";

export const saveFile = async (file: File ) => {
  const { data, error } = await utapi.uploadFiles(file);

  if (error) {
    throw new Error(`Upload File error: ${error.message}`);
  }

  return data;
};

export const deleteFile = async (fileKey: string) => {
  const { success } = await utapi.deleteFiles(fileKey);
  if (!success) throw new Error(`File deleting error!`);
};
