import * as React from "react";
import Fade from "@mui/material/Fade/Fade";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

interface LoadingSpinnerProps {
    size?: number
    isLoading: boolean
    marginTop?: number
}

export const LoadingSpinner = ({size, isLoading, marginTop}: LoadingSpinnerProps) => (
    <Fade
        in={isLoading}
        style={{
            marginTop: marginTop,
            transitionDelay: '800ms',
        }}>
        <CircularProgress size={size}/>
    </Fade>
);
