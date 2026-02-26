"use client";

import { useMutation } from "@tanstack/react-query";
import { createPdf } from "@/src/api/pdf";
import { createClient } from "@/lib/supabase/client";
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
import { Pdf } from "@/schemas/pdfSchema";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { MAX_SIZE_MB } from "@/rules/pdf";
import { pdfLanguage, pdfType } from "@/types/interfaces";
import { toast } from "sonner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const languagesDict: Record<pdfLanguage, string> = {
  en: "English",
  ar: "Arabic",
  de: "German",
};

const typesDict: Record<pdfType, string> = {
  book: "Book",
  novel: "Novel",
  document: "Document",
};

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUploadStatus, setFileUploadStatus] = useState<
    "idle" | "loading" | "error" | "uploaded"
  >("idle");
  const [fileData, setFileData] = useState<{
    fileId: string;
    totalFilePages: number;
  } | null>();
  const [allowSave, setAllowSave] = useState(false);

  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      onFileUploaded(selectedFile);
    }
  };

  const onFileUploaded = async (file: File) => {
    setFileUploadStatus("loading");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/pdfs/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setFileUploadStatus("uploaded");
        const data = await res.json();
        setFileData({
          fileId: data.fileId,
          totalFilePages: data.pdftotal_pages,
        });
      }
    } catch (err) {
      console.log(err);
      setFileUploadStatus("error");
    }
  };

  const form = useForm({
    defaultValues: {
      title: "",
      author: "",
      description: "",
      language: "en",
      type: "document",
      pages_read: Number(""),
    },
    validators: {
      onSubmit: Pdf,
    },
    onSubmit: async () => {
      await addNewPdf.mutateAsync();
    },
  });

  const addNewPdf = useMutation({
    mutationFn: () => {
      return createPdf({
        fileId: fileData?.fileId!,
        title: form.getFieldValue("title"),
        author: form.getFieldValue("author"),
        description: form.getFieldValue("description"),
        language: form.getFieldValue("language") as pdfLanguage,
        type: form.getFieldValue("type") as pdfType,
        total_pages: fileData?.totalFilePages!,
        pages_read: form.getFieldValue("pages_read"),
      });
    },
    onSuccess: (data) => {
      form.reset();
      setFile(null);
      setFileUploadStatus("idle");
      setFileData(null);
      toast.success(`your ${form.getFieldValue("type")} successfully saved!`, {
        position: "bottom-right",
      });
    },
    onError: (error) => {
      console.error("Error adding PDF:", error);
      toast.error(`Error adding your ${form.getFieldValue("type")}`, {
        position: "bottom-right",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await form.handleSubmit(async () => {
      await addNewPdf.mutateAsync();
    });
  };

  useEffect(() => {
    const canSave = fileData?.fileId && form.state.canSubmit;
    setAllowSave(!!canSave);
  }, [fileData, form.state.canSubmit]);

  return (
    <form
      className="w-full min-h-screen flex flex-wrap gap-4"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-1 min min-w-[250px]">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="peer hidden"
            id="file-upload"
            disabled={fileUploadStatus !== "idle"}
          />
          <Label
            htmlFor="file-upload"
            className="flex flex-col p-4 items-center justify-center gap-3 w-full h-full border-2 border-border rounded-lg cursor-pointer bg-card peer-focus:border-blue-500 hover:bg-accent transition"
          >
            {fileUploadStatus === "idle" && (
              <Upload size={72} className="text-primary" />
            )}
            {fileUploadStatus === "loading" && <Spinner className="size-24" />}
            {fileUploadStatus === "uploaded" && (
              <Check size={72} className="text-primary" />
            )}
            {fileUploadStatus === "error" && (
              <X size={72} className="text-primary" />
            )}
            Drop your File here
            <p className="text-foreground/30 text-xs">
              PDF up to {MAX_SIZE_MB}MB
            </p>
          </Label>
        </div>
      </div>
      <div className="flex-1 flex flex-col border-2 border-border bg-background rounded-md p-4 gap-4">
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-lg">File Details</h1>
          <FieldGroup>
            <form.Field
              name="title"
              children={(field) => (
                <Field className="flex flex-col gap-4">
                  <FieldLabel>Title:</FieldLabel>
                  <Input
                    placeholder="Title"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            />

            <form.Field
              name="author"
              children={(field) => (
                <Field className="flex flex-col gap-4">
                  <FieldLabel>Author:</FieldLabel>
                  <Input
                    placeholder="Author"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
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
              name="language"
              children={(field) => (
                <Field className="flex flex-col gap-4">
                  <FieldLabel>Language:</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) =>
                      field.handleChange(val as pdfLanguage)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="English" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(languagesDict).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <form.Field
              name="type"
              children={(field) => (
                <Field className="flex flex-col gap-4">
                  <FieldLabel>Type:</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val as pdfType)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Book" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(typesDict).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <form.Field
              name="pages_read"
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
                      disabled={fileUploadStatus !== "uploaded"}
                    />
                    <InputGroupAddon align="inline-end">
                      / {fileData?.totalFilePages ? fileData.totalFilePages : 0 }
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              )}
            />
          </FieldGroup>
        </div>
        <div className="flex gap-4 bottom-0">
          <Button className="flex-1" type="submit" disabled={!allowSave}>
            Save
          </Button>
          <Button
            className="flex items-center justify-center"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              form.reset();
              setFile(null);
              setFileUploadStatus("idle");
            }}
          >
            <RotateCcw />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Page;
