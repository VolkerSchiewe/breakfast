import * as React from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import {Delete} from "@material-ui/icons";

interface AlertDialogProps {
    isOpen: boolean
    title: string
    body?: string | React.ReactNode
    okText?: string
    cancelText?: string
    deleteButton?: boolean

    handleClose()

    handleOk()

    handleDelete?()
}

export const AlertDialog = ({isOpen, title, body, okText, cancelText, deleteButton, handleClose, handleOk, handleDelete}: AlertDialogProps) => (
    <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        {body &&
        <DialogContent>{body}</DialogContent>
        }
        <DialogActions>
            {deleteButton &&
            <Button onClick={handleDelete}><Delete/></Button>
            }
            <Button onClick={handleClose}>{cancelText || 'Abbrechen'}</Button>
            <Button onClick={handleOk}>{okText || 'Ok'}</Button>
        </DialogActions>
    </Dialog>
);
