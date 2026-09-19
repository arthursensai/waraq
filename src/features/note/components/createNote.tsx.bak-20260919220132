"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm, useStore } from "@tanstack/react-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useFetchDocuments } from "../../document/documentHook";
import { useCreateNote } from "../noteHook";
import { NoteSchemaType } from "../noteSchema";

const CreateNote = () => {
  const { data: documents } = useFetchDocuments();
  const { mutate, isPending } = useCreateNote();

  const form = useForm({
    defaultValues: {
      id: "",
      title: "",
      content: "",
      document_id: null as string | null,
    } satisfies NoteSchemaType,
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  const content = useStore(form.store, (state) => state.values.content);
  const canSubmit = Boolean(content && content.length >= 3);

  return (
    <form
      className="w-full max-w-2xl mx-auto flex flex-col gap-4 border-2 border-border bg-background rounded-md p-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <h1 className="text-lg field-legend">New Note</h1>

      <FieldGroup>
        <form.Field
          name="title"
          children={(field) => (
            <Field className="flex flex-col gap-2">
              <FieldLabel>Title (optional):</FieldLabel>
              <Input
                placeholder="Give your note a title"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </Field>
          )}
        />

        <form.Field
          name="document_id"
          children={(field) => (
            <Field className="flex flex-col gap-2">
              <FieldLabel>Attach to a document (optional):</FieldLabel>
              <Select
                value={field.state.value ?? undefined}
                onValueChange={(val) => field.handleChange(val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {documents?.map((document) => (
                      <SelectItem key={document.id} value={document.id}>
                        {document.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <form.Field
          name="content"
          children={(field) => (
            <Field className="flex flex-col gap-2">
              <FieldLabel>Note:</FieldLabel>
              <Textarea
                placeholder="Capture your thought, quote, or reflection..."
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="min-h-40"
                maxLength={2000}
              />
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={!canSubmit || isPending}>
        Save Note
      </Button>
    </form>
  );
};

export default CreateNote;
