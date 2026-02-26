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
      
      <DialogContent className="max-w-[90vw] sm:max-w-[425px] rounded-lg">
        <DialogHeader className="text-left"> {/* إزالة التمركز الافتراضي */}
          <DialogTitle
            dir={pdf.language === "ar" ? "rtl" : "ltr"}
            className={`text-2xl font-bold ${pdf.language === "ar" ? "text-right" : "text-left"} mt-4`}
          >
            {pdf.title}
          </DialogTitle>
          
          <div
            dir={pdf.language === "ar" ? "rtl" : "ltr"}
            className={`${pdf.language === "ar" ? "text-right" : "text-left"} text-muted-foreground`}
          >
            <p className="text-lg font-medium">{pdf.author}</p>
          </div>

          <DialogDescription
            dir={pdf.language === "ar" ? "rtl" : "ltr"}
            className={`${pdf.language === "ar" ? "text-base text-right" : "text-left"} leading-relaxed mt-4 bg-accent/30 p-4 rounded-md border border-border/50 max-h-[200px] overflow-y-auto`}
          >
            {pdf.description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Section */}
        <div className="py-6 space-y-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <Label>Your progress:</Label>
            <span className="text-primary">
              {Math.round((pdf.pages_read / pdf.total_pages) * 100)}%
            </span>
          </div>
          <Progress
            value={(pdf.pages_read / pdf.total_pages) * 100}
            className="h-2"
          />
        </div>

        <DialogFooter className="flex flex-row gap-3 items-center justify-between sm:justify-between w-full mt-4">
          <Button variant="outline" className="flex-1 gap-2">
            <Pen size={18} />
            <span>Edit</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1 gap-2">
                <Trash2 size={18} />
                <span>Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your document from our servers.
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


