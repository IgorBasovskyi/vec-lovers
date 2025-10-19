"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/ui/custom/dialog";
import AddIconForm from "@/components/Dashboard/AddIconForm";
import { Plus } from "lucide-react";
import { ADD_ICON } from "@/constants/icon/client";

const AddIconDialog = () => {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [submitFn, setSubmitFn] = useState<(() => Promise<void>) | null>(null);

  const handleSuccess = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSubmit = useCallback((fn: () => Promise<void>) => {
    setSubmitFn(() => fn);
  }, []);

  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsPending(loading);
  }, []);

  const handleConfirm = async () => {
    if (submitFn) {
      await submitFn();
    }
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button>
          {ADD_ICON} <Plus />
        </Button>
      }
      title={<span className="text-lg font-medium">{ADD_ICON}</span>}
      description={
        <span className="text-sm text-muted-foreground">
          Feeling creative? Inject an icon via code magic or pull one from your
          local machine.
        </span>
      }
      onConfirm={handleConfirm}
      confirmText={ADD_ICON}
      size="md"
      loading={isPending}
    >
      <AddIconForm
        onSuccess={handleSuccess}
        onSubmit={handleSubmit}
        onLoadingChange={handleLoadingChange}
      />
    </CustomDialog>
  );
};

export default AddIconDialog;
