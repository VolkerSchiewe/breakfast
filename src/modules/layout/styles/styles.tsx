import {grey, teal} from "@material-ui/core/colors";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export const theme = createMuiTheme({
    palette: {
        primary: {
            ...teal,
            light: '#ff7d04',
            main: '#ec7404',
            dark: '#bc5c04',
        },
        secondary: {
            ...grey,
            main: '#286090',
            light: '#2c6da5',
            A400: '#286090',
        },
        text: {
            primary: '#757575',
            secondary: '#636262',
            disabled: "rgba(0, 0, 0, 0.38)",
            hint: "rgba(0, 0, 0, 0.05)",
        },
        background: {
            default: '#f5f7fa',
        }
    },
    mixins: {
        toolbar: {
            minHeight: 50,
        }
    },
    zIndex: {
        mobileStepper: 900,
        appBar: 1100,
        snackbar: 2900,
        tooltip: 3000
    }
});

export const accentColor = {
    A100: '#5e9dfb',
    A400: '#2e82fe',
    A600: '#266fdc',
};

export const mainColors = {
    primary: theme.palette.primary.main,
    accent: accentColor.A400,
    warning: "#ff9800",
    danger: "#f44336",
    success: "#4caf50",
    purple: "#9c27b0",
    done: "#e6ffe6"
};
