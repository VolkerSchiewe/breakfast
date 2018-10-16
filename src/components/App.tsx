import * as React from "react";
import {NavBar} from "../modules/layout/components/NavBar";
import {Login} from "./Login";
import {MuiThemeProvider} from "@material-ui/core/styles";
import {theme} from "../modules/layout/styles/styles";
import {ElectionListContainerWithRouter} from "../modules/management/containers/ElectionListContainer";
import {EditElectionContainer} from "../modules/management/containers/EditElectionContainer";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {style} from "typestyle";

interface AppState {
    isLoggedIn: boolean
}

const styles = {
    root: style({
        width: '100%',
        height: '100%',
    }),
};

export class App extends React.Component<{}, AppState> {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
        }
    }

    handleLogin() {
        this.setState({
            isLoggedIn: true
        })
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router>
                    <div className={styles.root}>
                        <NavBar title={"Wahlen"}/>
                        {this.state.isLoggedIn ?
                            <Route exact path="/" component={ElectionListContainerWithRouter}/>
                            :
                            <Route exact path="/" render={() => (<Login handleLogin={() => this.handleLogin()}/>)}/>
                        }
                        <Route exact path="/election/:electionId" component={EditElectionContainer}/>
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}
