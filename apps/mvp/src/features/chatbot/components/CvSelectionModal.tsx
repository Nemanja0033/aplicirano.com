import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/src/components/ui/alert-dialog";
import { Paperclip } from "lucide-react";
import { formatDate } from "date-fns";

interface CvSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumes: any[];
  onSelectResume: (resumeContent: string) => void;
}

export const CvSelectionModal = ({
  open,
  onOpenChange,
  resumes,
  onSelectResume,
}: CvSelectionModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Izaberi CV</AlertDialogTitle>
          <AlertDialogDescription>
            Odaberi CV za koji zelis da bude skeniran od strane AI asistenta
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-3 place-items-center w-full">
          {resumes?.map((cv) => (
            <div
              onClick={() => onSelectResume(cv.resumeContent)}
              key={cv.id}
              className="border-2 shadow-md cursor-pointer hover:opacity-80 flex gap-3 items-center p-3 rounded-md w-full"
            >
              <Paperclip size={18} strokeWidth={1} />
              <span>{cv.title}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(new Date(cv.createdAt), "yyyy-MM-dd")}
              </span>
            </div>
          ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
