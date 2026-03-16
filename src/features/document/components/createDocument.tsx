"use client";

import { Label } from "@/components/ui/label";
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
import { Check, RotateCcw, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DocumentSchemaType } from "../documentSchema";
import { useCreateDocument, useFileUpload } from "../documentHook";
import { useFetchAllAuthors, useFetchAuthors } from "../../author/authorHook";
import {
  ContentLanguage,
  contentLanguagesDict,
  ContentType,
  contentTypesDict,
} from "../constants";
import { useStore } from "@tanstack/react-form";
import Image from "next/image";

const CreateDocument = () => {
  const [file, setFile] = useState<File | null>(null);
  const { data: authors } = useFetchAllAuthors();

  const [fileData, setFileData] = useState<{
    fileId: string;
    totalPages: number;
    coverId: string;
    coverUrl: string;
  } | null>(null);

  const {
    mutate: mutateFile,
    data: receivedFileData,
    isPending: isFileUploading,
    isSuccess: isFileUploadSuccess,
    isIdle,
  } = useFileUpload();

  const { mutate } = useCreateDocument();

  const form = useForm({
    defaultValues: {
      id: "",
      file_id: "",
      title: "",
      description: "",
      author_id: "",
      content_language: "en",
      content_type: "book",
      total_pages: 0,
      read_page: 0,
      tags: [],
    } satisfies DocumentSchemaType,
    onSubmit: async () => {
      if (fileData?.coverId) {
        mutate({
          document: {
            id: "",
            file_id: form.getFieldValue("file_id"),
            title: form.getFieldValue("title"),
            author_id: form.getFieldValue("author_id"),
            description: form.getFieldValue("description"),
            total_pages: form.getFieldValue("total_pages"),
            read_page: form.getFieldValue("read_page"),
            content_language: form.getFieldValue(
              "content_language",
            ) as ContentLanguage,
            content_type: form.getFieldValue("content_type") as ContentType,
          },
          imageId: fileData?.coverId,
        });
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget?.files?.[0];
    if (selectedFile instanceof File) {
      mutateFile(selectedFile, {
        onSuccess: (data) => {
          setFileData(data);
          form.setFieldValue("file_id", data.fileId);
          form.setFieldValue("total_pages", data.totalPages);
        },
      });
    }
  };

  const { file_id, author_id, title, description } = useStore(
    form.store,
    (state) => state.values,
  );
  const canSubmit = Boolean(file_id && author_id && title && description);

  return (
    <form
      className="w-full min-h-screen flex flex-wrap gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-1 min min-w-[250px]">
        <div className="w-full h-full flex flex-col items-center justify-center">
          {isFileUploadSuccess && fileData?.coverUrl ? (
            <Image src={fileData?.coverUrl} alt="document cover" fill />
          ) : (
            <>
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="peer hidden"
                id="file-upload"
                disabled={isFileUploadSuccess}
              />
              <Label
                htmlFor="file-upload"
                className="flex flex-col p-4 items-center justify-center gap-3 w-full h-full border-2 border-border rounded-lg cursor-pointer bg-card peer-focus:border-blue-500 hover:bg-accent transition"
              >
                {isIdle && <Upload size={72} className="text-primary" />}
                {isFileUploading && <Spinner className="size-24" />}
                Drop your File here
                <p className="text-foreground/30 text-xs">PDF up to 50MB</p>
              </Label>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col border-2 border-border bg-background rounded-md p-4 gap-4">
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-lg field-legend">File Details</h1>
          <FieldGroup>
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid = "";
                return (
                  <Field className="flex flex-col gap-4">
                    <FieldLabel>Title:</FieldLabel>
                    <Input
                      placeholder="Title"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </Field>
                );
              }}
            />

            <form.Field
              name="author_id"
              children={(field) => (
                <Field className="flex flex-col gap-4">
                  <FieldLabel>Author:</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an author" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {authors &&
                          authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.full_name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <form.Field
              name="description"
              children={(field) => (
                <Field className="flex flex-col gap-4">
                  <FieldLabel>Description:</FieldLabel>
                  <Textarea
                    placeholder="Write your description here..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="max-h-36"
                    maxLength={500}
                  />
                </Field>
              )}
            />

            <form.Field
              name="content_language"
              children={(field) => (
                <Field className="flex flex-col gap-4">
                  <FieldLabel>Language:</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) =>
                      field.handleChange(val as typeof field.state.value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="English" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(contentLanguagesDict).map(
                          ([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <form.Field
              name="content_type"
              children={(field) => (
                <Field className="flex flex-col gap-4">
                  <FieldLabel>Type:</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(val) =>
                      field.handleChange(val as typeof field.state.value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Book" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(contentTypesDict).map(
                          ([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <form.Field
              name="read_page"
              children={(field) => (
                <Field>
                  <FieldLabel>your progess:</FieldLabel>
                  <InputGroup className="">
                    <InputGroupInput
                      placeholder="How much pages you already read?"
                      name={field.name}
                      value={field.state.value}
                      type="number"
                      onChange={(e) =>
                        field.handleChange(Number(e.currentTarget.value))
                      }
                    />
                    <InputGroupAddon align="inline-end">
                      / {form.getFieldValue("total_pages") || 0}
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              )}
            />
          </FieldGroup>
        </div>
        <div className="flex gap-4 bottom-0">
          <Button className="flex-1" type="submit" disabled={!canSubmit}>
            Save
          </Button>
          <Button
            className="flex items-center justify-center"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              form.reset();
              setFile(null);
            }}
          >
            <RotateCcw />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateDocument;
