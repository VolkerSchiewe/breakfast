import * as React from "react";
import Fade from "@material-ui/core/Fade/Fade";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

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
