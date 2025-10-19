import { ReactNode } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Size = "sm" | "md" | "lg" | "xl";

interface ReusableDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  size?: Size;
  children?: ReactNode;
  closeOnBlur?: boolean;
  loading?: boolean;
}

const sizeClass: Record<Size, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

const CustomDialog = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  size = "md",
  children,
  closeOnBlur = true,
  loading = false,
}: ReusableDialogProps) => {
  const internalTrigger = trigger ? (
    <DialogTrigger asChild>{trigger}</DialogTrigger>
  ) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {internalTrigger}
      <DialogContent
        className={`sm:mx-6 ${sizeClass[size]} p-6`}
        onInteractOutside={(event) => {
          if (!closeOnBlur) event.preventDefault();
        }}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="mt-2">{children}</div>

        <DialogFooter className="mt-6">
          {footer ? (
            footer
          ) : onConfirm ? (
            <div className="flex w-full justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost" disabled={loading}>
                  {cancelText}
                </Button>
              </DialogClose>
              <Button onClick={onConfirm} disabled={loading}>
                {loading ? "Loading..." : confirmText}
              </Button>
            </div>
          ) : (
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
