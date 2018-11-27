import * as React from "react";
import {Pie} from "react-chartjs-2";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";
import {SubElection} from "../interfaces/SubElection";
import {chartOptions, getDataFromSubElection} from "../../utils/chart";
import withMobileDialog, {InjectedProps} from "@material-ui/core/withMobileDialog/withMobileDialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";

interface ResultModalProps extends InjectedProps{
    subElection: SubElection

    handleClose()
}

const ResultModal = ({fullScreen, subElection, handleClose}: ResultModalProps) => (
    <div>
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth={"lg"} fullScreen={fullScreen}>
            <DialogTitle>{subElection.title}</DialogTitle>
            <DialogContent>
                <Pie data={getDataFromSubElection(subElection)} options={chartOptions(true, false)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Schließen</Button>
            </DialogActions>
        </Dialog>
    </div>
);

export default withMobileDialog()(ResultModal);