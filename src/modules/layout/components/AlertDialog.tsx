import * as React from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import Delete from "@material-ui/icons/Delete";

interface AlertDialogProps {
    isOpen: boolean
    title: string
    body?: string | React.ReactNode
    okText?: string
    cancelText?: string

    handleClose()

    handleOk()

    handleDelete?()
}

export const AlertDialog = ({isOpen, title, body, okText, cancelText, handleClose, handleOk, handleDelete}: AlertDialogProps) => (
    <Dialog open={isOpen} onClose={handleClose}>
        <form onSubmit={e => {
            e.preventDefault();
            handleOk();
        }}>
            <DialogTitle>{title}</DialogTitle>
            {body &&
            <DialogContent>{body}</DialogContent>
            }
            <DialogActions>
                {handleDelete != undefined &&
                <Button onClick={handleDelete}><Delete/></Button>
                }
                <Button onClick={handleClose}>{cancelText || 'Abbrechen'}</Button>
                <Button type="submit">{okText || 'Ok'}</Button>
            </DialogActions>
        </form>
    </Dialog>
);
