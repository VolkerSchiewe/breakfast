import * as React from "react";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import Button from "@mui/material/Button/Button";
import Delete from "@mui/icons-material/Delete";
import { FC } from "react";

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  body?: string | React.ReactNode;
  okText?: string;
  cancelText?: string;

  handleClose: () => any;

  handleOk: () => any;

  handleDelete?: () => any;
}

export const AlertDialog: FC<AlertDialogProps> = ({
  isOpen,
  title,
  body,
  okText,
  cancelText,
  handleClose,
  handleOk,
  handleDelete,
}) => (
  <Dialog open={isOpen} onClose={handleClose}>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleOk();
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      {body !== null && <DialogContent>{body}</DialogContent>}
      <DialogActions>
        {handleDelete !== undefined && (
          <Button onClick={handleDelete}>
            <Delete />
          </Button>
        )}
        <Button onClick={handleClose}>{cancelText ?? "Abbrechen"}</Button>
        <Button type="submit">{okText ?? "Ok"}</Button>
      </DialogActions>
    </form>
  </Dialog>
);
