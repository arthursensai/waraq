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
import { parseZodErrors, Pdf } from "@/zod/schemas/pdfSchema";
import { useState } from "react";
import { UploadButton } from "@/src/utils/uploadthing";
import { createClient } from "@/lib/supabase/client";
import { addNewPdf } from "@/lib/supabase/queries/pdfs";

const BookUploadForm = () => {
  const [pdfData, setPdfData] = useState<Pdf>({ title: "", author: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allowPdfUpload, setAllowPdfUpload] = useState(false);

  const handleSubmit = async () => {
    const result = Pdf.safeParse({
      title: pdfData.title,
      author: pdfData.author,
    });

    if (!result.success) {
      const errors = parseZodErrors(result.error);
      const errorString = Object.values(errors)[0];
      console.log(errorString);
      setErrorMessage(errorString);
    }
  };

  const createPdfRowForCurrentUser = async (pdf_link: string) => {
    const result = Pdf.safeParse({
      title: pdfData.title,
      author: pdfData.author,
    });

    if (!result.success) {
      const errors = parseZodErrors(result.error);
      const errorString = Object.values(errors)[0];
      setErrorMessage(errorString);
      return false;
    }

    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      setErrorMessage("You must be logged in to upload.");
      return false;
    }

    return await addNewPdf({
      title: pdfData.title,
      author: pdfData.author,
      pdf_link,
      user_id: user.id,
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="w-44 h-60 flex items-center justify-center border-accent border-2 hover:bg-accent transition-all">
          <Plus size={64} strokeWidth={1} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle>Upload your pdf</DialogTitle>
          <DialogDescription>
            Here you can upload your pdf and add extra details about it.
          </DialogDescription>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div
              className={` ${allowPdfUpload ? "hidden" : "block"} flex flex-col gap-4`}
            >
              <div className="flex flex-col gap-2">
                <Label>Title:</Label>
                <Input
                  placeholder="Title"
                  onChange={(e) => {
                    setErrorMessage(null);
                    setPdfData((prev) => ({ ...prev, title: e.target.value }));
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Author:</Label>
                <Input
                  placeholder="Author"
                  onChange={(e) => {
                    setErrorMessage(null);
                    setPdfData((prev) => ({ ...prev, author: e.target.value }));
                  }}
                />
              </div>
            </div>
            <div
              className={`${allowPdfUpload ? "block" : "hidden"} flex flex-col gap-2`}
            >
              <Label>pdf:</Label>
              <UploadButton
                endpoint="pdfUploader"
                appearance={{
                  container:
                    "w-full flex flex-col items-start gap-2 rounded-md border border-border bg-background p-3",
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
                  // Do something with the response
                  console.log("Files: ", res);
                  const pdf_link = res?.[0]?.ufsUrl ?? res?.[0]?.url;

                  if (!pdf_link) {
                    alert("Upload completed but no file URL was returned.");
                    return;
                  }

                  const ok = await createPdfRowForCurrentUser(pdf_link);
                  if (ok) alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
            {errorMessage && <p className="text-destructive">{errorMessage}</p>}
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                if (allowPdfUpload) {
                  handleSubmit();
                } else {
                  setAllowPdfUpload(true);
                }
              }}
            >
              {allowPdfUpload ? "Upload" : "Continue"}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BookUploadForm;
