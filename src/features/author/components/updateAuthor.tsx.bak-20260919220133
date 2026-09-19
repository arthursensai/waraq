"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthorSchema } from "../authorSchema";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { useUpdateAuthor } from "../authorHook";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ImagePicker } from "@/components/ui/image-picker";
import DeleteAuthor from "./deleteAuthor";
import { X } from "lucide-react";
import { useStore } from "@tanstack/react-store";

interface UpdateAuthorProps {
  author: {
    id: string;
    full_name: string;
    biography: string;
    image_url: string;
    image_id: string;
  };
}

const UpdateAuthor = ({ author }: UpdateAuthorProps) => {
  const { id, full_name, biography, image_id } = author;

  const { mutate, isPending } = useUpdateAuthor(id);
  const form = useForm({
    defaultValues: {
      id,
      full_name,
      biography,
      image_file: null as File | null,
      image_id,
    },
    validators: { onSubmit: AuthorSchema },
    onSubmit: async () => {
      const newFullName = form.getFieldValue("full_name");
      const newBiography = form.getFieldValue("biography");
      const newImageFile = form.getFieldValue("image_file");

      const hasChanged =
        newFullName !== full_name ||
        newBiography !== biography ||
        newImageFile !== null;

      if (!hasChanged) return;

      mutate({
        id: form.getFieldValue("id"),
        full_name: newFullName,
        biography: newBiography,
        image_file: newImageFile,
        image_id: form.getFieldValue("image_id"),
      });
    },
  });

  const isDirty = useStore(
    form.store,
    (s) =>
      s.values.full_name !== full_name ||
      s.values.biography !== biography ||
      s.values.image_file !== null,
  );

  return (
    <Drawer
      direction="right"
      onOpenChange={(open) => {
        if (!open) form.reset();
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full flex-1">
          Edit
        </Button>
      </DrawerTrigger>

      <DrawerContent className="flex flex-col h-full">
        <DrawerHeader className="relative border-b">
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-4 top-4"
            >
              <X />
            </Button>
          </DrawerClose>
          <DrawerTitle>Update Author's details</DrawerTitle>
          <DrawerDescription>
            Here you can update the author's details.
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={(e) => e.preventDefault()}
          onReset={() => form.reset()}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-4">
            <FieldGroup className="w-full">
              <form.Field
                name="image_file"
                children={(field) => (
                  <div className="w-full flex items-center justify-center py-2">
                    <ImagePicker
                      value={author.image_url}
                      className="rounded-full"
                      onChange={(file) => field.handleChange(file)}
                    />
                  </div>
                )}
              />

              <form.Field
                name="full_name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel>Full name:</FieldLabel>
                      <Input
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.currentTarget.value)
                        }
                        placeholder="New author name"
                        aria-invalid={isInvalid}
                      />
                      {field.state.meta.errors[0] && (
                        <FieldError>
                          {field.state.meta.errors[0].message}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="biography"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel>Biography:</FieldLabel>
                      <Textarea
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.currentTarget.value)
                        }
                        placeholder="New biography..."
                        aria-invalid={isInvalid}
                        className="min-h-32 max-h-48"
                      />
                      {field.state.meta.errors[0] && (
                        <FieldError>
                          {field.state.meta.errors[0].message}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </div>

          <DrawerFooter className="border-t">
            <Button
              onClick={form.handleSubmit}
              disabled={!isDirty || isPending}
              className="w-full"
            >
              Save changes
            </Button>
            <DeleteAuthor author={author} />
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
export default UpdateAuthor;
