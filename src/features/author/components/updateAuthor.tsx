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

interface UpdateAuthorProps {
  author: {
    id: string;
    full_name: string;
    biography: string;
  };
}

const UpdateAuthor = ({ author }: UpdateAuthorProps) => {
  const { id, full_name, biography } = author;
  const { mutate } = useUpdateAuthor(id);
  const form = useForm({
    defaultValues: {
      full_name,
      biography,
      image_file: null as File | null,
    },
    validators: {
      onSubmit: AuthorSchema,
    },
    onSubmit: async () => {
      mutate({
        full_name: form.getFieldValue("full_name"),
        biography: form.getFieldValue("biography"),
        image_file: null as File | null,
      });
    },
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        onReset={() => {
          form.reset();
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full flex-1">
            Edit
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Author's details</DialogTitle>
            <DialogDescription>
              Here you can update the authors details.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
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
                    <FieldLabel>Full name:</FieldLabel>
                    <Textarea
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.currentTarget.value)
                      }
                      placeholder="New biography..."
                      aria-invalid={isInvalid}
                      className="min-h-32 max-h-32"
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="reset">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={form.handleSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default UpdateAuthor;
