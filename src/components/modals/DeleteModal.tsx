import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[420px] bg-white">
        <DialogHeader className="">
          <DialogTitle>Are you sure you want to delete this item?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The item will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex items-center justify-end gap-7 mt-5">
          <button
            className="text-white bg-red-600 py-2 px-6 text-sm font-medium leading-[120%] rounded-[8px]"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            className="text-base font-medium bg-gray-200 text-black leading-[120%] py-2 px-5 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
