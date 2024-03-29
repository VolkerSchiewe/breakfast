import * as React from "react";
import { Pie } from "react-chartjs-2";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Dialog from "@mui/material/Dialog/Dialog";
import { SubElection } from "../interfaces/SubElection";
import { chartOptions, getDataFromSubElection } from "../../utils/chart";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import Button from "@mui/material/Button/Button";
import { useTheme, useMediaQuery } from "@mui/material";
import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
import { FC } from "react";
Chart.register(ArcElement, Legend, Tooltip);

interface ResultModalProps {
  subElection: SubElection;

  handleClose: () => any;
}

const ResultModal: FC<ResultModalProps> = ({ subElection, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div>
      <Dialog
        open={true}
        onClose={handleClose}
        fullWidth
        maxWidth={"lg"}
        fullScreen={fullScreen}
      >
        <DialogTitle>{subElection.title}</DialogTitle>
        <DialogContent>
          <Pie
            data={getDataFromSubElection(subElection)}
            options={chartOptions(true, false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Schließen</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResultModal;
