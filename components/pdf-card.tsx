import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { pdfDocumentSchema } from "@/types/interfaces";
import { Button } from "./ui/button";
import { Info, Pen, Trash2 } from "lucide-react";
import { deletePdf } from "@/src/api/pdf";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Label } from "./ui/label";

type PdfCardProps = {
  pdf: pdfDocumentSchema;
  refetchBooks: () => void;
};

const PdfCard = ({ pdf, refetchBooks }: PdfCardProps) => {
  const [progress, setProgress] = useState(0);

  const handlePdfDelete = async () => {
    try {
      await deletePdf({ fileId: pdf.file_id.toString() });
      toast.success(`Your ${pdf.type} was successfuly deleted`);
      refetchBooks();
    } catch (err) {
      toast.error(`Error deleting your ${pdf.type}`);
      console.log(err);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="secondary">
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle
            dir={`${pdf.language == "ar" ? "rtl" : "ltr"}`}
            className={`${pdf.language == "ar" ? "self-end" : ""} mt-4`}
          >
            {pdf.title}
          </DialogTitle>
          <div
            dir={`${pdf.language == "ar" ? "rtl" : "ltr"}`}
            className={`${pdf.language == "ar" ? "self-end" : ""}`}
          >
            <h2>{pdf.author}</h2>
          </div>
          <DialogDescription
            dir={`${pdf.language == "ar" ? "rtl" : "ltr"}`}
            className={`${pdf.language == "ar" ? "text-base text-right" : ""} leading-7`}
          >
            {pdf.description}
          </DialogDescription>
          <div className="flex flex-col gap-4">
            <Label>Your progress:</Label>
            <Progress
              value={(pdf.pages_read / pdf.total_pages) * 100}
              className="w-full"
            />
          </div>
        </DialogHeader>
        <DialogFooter className="flex gap-4 items-center justify-between w-full">
          <Button variant="outline" size="icon-lg" className="flex-1">
            <Pen />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon-lg" variant="destructive" className="flex-1">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your pdf from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handlePdfDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PdfCard;
