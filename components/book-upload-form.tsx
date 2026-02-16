"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Pdf } from "@/zod/schemas/pdfSchema";
import { useState } from "react";
import { UploadButton } from "@/src/utils/uploadthing";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

const BookUploadForm = () => {
  const [pdfData, setPdfData] = useState<Pdf>({
    title: "",
    author: "",
    description: "",
  });
  const [pdfUrl, setPdfUrl] = useState("");
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allowModalClose, setAllowModalClose] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState<"idle" | "loading" | "success">(
    "idle",
  );

  const validateInputs = () => {
    const { data, error, success } = Pdf.safeParse(pdfData);

    if (success) {
      setErrorMessage(null);
      return true;
    }

    if (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.issues[0].message);
        return false;
      } else {
        setErrorMessage("Unknown Error");
        return false;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const checkInputs = validateInputs();

    if (!checkInputs) return;

    setAllowModalClose(false);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify({
          title: pdfData.title,
          author: pdfData.author,
          description: pdfData.description,
          pdf_url: pdfUrl,
        }),
      });

      if (res.ok) {
        setIsDialogOpen(false);
        toast.success("your pdf successfully saved!", {
          position: "bottom-right",
        });
        setPdfData({ title: "", author: "", description: "" });
        setPdfUrl("");
        setErrorMessage("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(val) => {
        if (allowModalClose) setIsDialogOpen(val);
      }}
    >
      <DialogTrigger>
        <div className="w-44 h-60 flex items-center justify-center border-accent border-2 hover:bg-accent transition-all">
          <Plus size={64} strokeWidth={1} />
        </div>
      </DialogTrigger>
      <DialogContent>
        {loading === "idle" && (
          <DialogHeader className="flex flex-col gap-3">
            <DialogTitle>Upload your pdf</DialogTitle>
            <DialogDescription>
              Here you can upload your pdf and add extra details about it.
            </DialogDescription>
            <div></div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className={` flex flex-col gap-4`}>
                <div className="flex flex-col gap-2">
                  <Label>Title:</Label>
                  <Input
                    placeholder="Title"
                    onChange={(e) => {
                      setErrorMessage(null);
                      setPdfData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Author:</Label>
                  <Input
                    placeholder="Author"
                    onChange={(e) => {
                      setErrorMessage(null);
                      setPdfData((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Description:</Label>
                  <Textarea
                    placeholder="Write your description here..."
                    onChange={(e) => {
                      setErrorMessage(null);
                      setPdfData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className={`flex flex-col `}>
                <UploadButton
                  endpoint="pdfUploader"
                  appearance={{
                    container:
                      "w-full flex flex-col items-start gap-2 rounded-md border border-border bg-background p-6",
                    button:
                      "ut-ready:bg-primary ut-ready:text-primary-foreground ut-ready:hover:bg-primary/90 ut-uploading:bg-muted ut-uploading:text-muted-foreground rounded-md px-4 py-2 text-sm font-medium",
                    allowedContent: "text-xs text-muted-foreground",
                    clearBtn:
                      "rounded-md border border-border bg-background px-3 py-1 text-xs text-foreground hover:bg-accent",
                  }}
                  content={{
                    button({ ready }) {
                      if (ready) return "Choose file";
                      return "Preparing...";
                    },
                    allowedContent({ ready }) {
                      if (!ready) return "";
                      return "PDF up to 8MB";
                    },
                  }}
                  onClientUploadComplete={async (res) => {
                    const pdf_link = res?.[0]?.ufsUrl ?? res?.[0]?.url;

                    if (!pdf_link) {
                      alert("Upload completed but no file URL was returned.");
                      return;
                    }
                    setPdfUrl(pdf_link);
                    setAllowSubmit(true);
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />
              </div>
              {errorMessage && (
                <p className="self-start text-destructive">{errorMessage}</p>
              )}
              <Button type="submit" disabled={!allowSubmit}>
                Upload
              </Button>
            </form>
          </DialogHeader>
        )}
        {loading === "loading" && (
          <>
            <DialogTitle>Uploading your pdf</DialogTitle>
            <DialogDescription className="flex items-center justify-center">
              <Spinner className="size-24" />
            </DialogDescription>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookUploadForm;
