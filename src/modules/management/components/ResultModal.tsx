import * as React from "react";
import {Pie} from "react-chartjs-2";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";
import {SubElection} from "../interfaces/SubElection";
import {chartOptions, getDataFromSubElection} from "../../utils/chart";

interface ResultModalProps {
    subElection: SubElection

    handleClose()
}

export const ResultModal = ({subElection, handleClose}: ResultModalProps) => (
    <div>
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth={"lg"}>
            <DialogTitle>{subElection.title}</DialogTitle>
            <DialogContent>
                <Pie data={getDataFromSubElection(subElection)} options={chartOptions(30, false)}/>
            </DialogContent>
        </Dialog>
    </div>
);
