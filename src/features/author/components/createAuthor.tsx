"use client";

import { useForm } from "@tanstack/react-form";
import { useCreateAuthor } from "../authorHook";
import { AuthorSchema } from "../authorSchema";
import { useState } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "@/components/ui/image-picker";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw } from "lucide-react";

const CreateAuthor = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { mutate, isSuccess } = useCreateAuthor();

  const form = useForm({
    defaultValues: {
      full_name: "",
      biography: "",
      image_file: null as File | null,
    },
    validators: {
      onSubmit: AuthorSchema,
      onChange: AuthorSchema,
    },
    onSubmit: async () => {
      mutate({
        id: "",
        image_id: "",
        full_name: form.getFieldValue("full_name"),
        biography: form.getFieldValue("biography"),
        image_file: imageFile,
      });
      if (isSuccess) {
        form.reset();
        setImageFile(null);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      onReset={() => {
        form.reset();
        setImageFile(null);
      }}
      className="flex flex-col md:flex-row w-full h-full overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 shrink-0 border-b md:border-b-0 md:border-r border-border px-5 py-6 md:pt-8 md:pb-6 h-48 md:h-full gap-2">
        <form.Field
          name="image_file"
          children={(field) => (
            <>
              <ImagePicker
                onChange={(file) => setImageFile(file)}
                size="full"
              />
              {field.state.meta.errors[0] && (
                <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
              )}
            </>
          )}
        />
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="px-7 pt-7 pb-5 border-b border-border shrink-0">
          <FieldLegend className="field-legend">Author Details</FieldLegend>
        </div>

        <div className="flex flex-col gap-6 px-7 py-6 flex-1 overflow-y-auto">
          <form.Field
            name="full_name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel className="field-legend text-[12px]">
                    Full Name
                  </FieldLabel>
                  <Input
                    placeholder="e.g. Jane Austen"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full"
                    aria-invalid={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  {field.state.meta.errors && (
                    <FieldError>
                      {field.state.meta.errors[0]?.message}
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
                <Field
                  className="flex flex-col flex-1"
                  data-invalid={isInvalid}
                >
                  <FieldLabel className="field-legend text-[12px]">
                    Biography
                  </FieldLabel>
                  <Textarea
                    placeholder="Write a short bio about this author…"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full flex-1 resize-none min-h-45"
                    aria-invalid={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  {field.state.meta.errors && (
                    <FieldError>
                      {field.state.meta.errors[0]?.message}
                    </FieldError>
                  )}
                </Field>
              );
            }}
          />
        </div>

        <div className="flex items-center gap-2 p-2 border-t border-border shrink-0">
          <Button type="submit" className="flex-1 font-semibold tracking-wide">
            Save Author
          </Button>
          <Button
            type="reset"
            variant="secondary"
            size="icon"
            title="Reset form"
            className="shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateAuthor;
