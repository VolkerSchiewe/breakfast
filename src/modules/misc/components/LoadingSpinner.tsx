import * as React from "react";
import Fade from "@mui/material/Fade/Fade";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { FC } from "react";

interface LoadingSpinnerProps {
  size?: number;
  isLoading: boolean;
  marginTop?: number;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size,
  isLoading,
  marginTop,
}) => (
  <Fade
    in={isLoading}
    style={{
      marginTop,
      transitionDelay: "800ms",
    }}
  >
    <CircularProgress size={size} />
  </Fade>
);
