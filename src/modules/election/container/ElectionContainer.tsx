import * as React from 'react';
import {SubElection} from "../../management/interfaces/SubElection";
import {Election} from "../components/Election";
import {Candidate} from "../../management/interfaces/Candidate";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import {ElectionService} from "../services/election-service";
import Grid from "@material-ui/core/Grid/Grid";
import {style} from "typestyle";
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {AuthConsumer} from "../../auth/components/AuthContext";
import {AuthInterface} from "../../auth/interfaces/AuthInterface";
import {LoadingSpinner} from "../../misc/components/LoadingSpinner";

interface ElectionContainerState {
    isLoading: boolean
    subElections: SubElection[]
    selectedCandidates: {}
    snackbarOpen: boolean
    snackbarMessage: string
}

interface ElectionContainerProps extends RouteComponentProps {

}

const styles = {
    spinner: style({
        marginTop: 100
    }),
};

class ElectionContainer extends React.Component<ElectionContainerProps, ElectionContainerState> {
    electionService = new ElectionService();

    onCandidateSelected = (subElection: SubElection, candidate: Candidate) => {
        const {selectedCandidates} = this.state;
        let selected = selectedCandidates;
        selected[subElection.id] = candidate.id;
        this.setState({
            selectedCandidates: selected
        });
    };

    onSubmit = (logout: () => void) => {
        const {selectedCandidates, subElections} = this.state;
        if (Object.keys(selectedCandidates).length != subElections.length)
            this.setState({
                snackbarOpen: true,
                snackbarMessage: "Du musst überall einen Kandidaten wählen!"
            });
        else {
            this.setState({isLoading: true});
            this.electionService.setVote(selectedCandidates)
                .then(() => {
                    this.setState({
                        snackbarOpen: true,
                        snackbarMessage: "Deine Stimme wurde gespeichert"
                    });
                    setTimeout(() => logout(), 1500)
                })
                .catch(e => {
                    this.setState({
                        snackbarOpen: true,
                        snackbarMessage: "Etwas ist schief gelaufen. Melde dich bei der Wahlleitung."
                    });
                    console.error(e)
                });
        }
    };
    fetchData = () => {
        this.electionService.getSubElections()
            .then(res => {
                if (res.length == 0) {
                    this.setState({
                        snackbarMessage: "Warte noch es geht noch nicht los!",
                        snackbarOpen: true,
                    });
                }
                this.setState({
                    isLoading: false,
                    subElections: res
                });
            })
            .catch(e => {
                this.setState({
                    snackbarOpen: true,
                    snackbarMessage: "Etwas ist schief gelaufen. Melde dich bei der Wahlleitung."
                });
                console.error(e)
            });
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            subElections: [],
            selectedCandidates: {},
            snackbarOpen: false,
            snackbarMessage: ""
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    render() {
        const {subElections, selectedCandidates, isLoading, snackbarOpen, snackbarMessage} = this.state;
        return (
            <div>
                {isLoading ?
                    <Grid container justify={"center"} className={styles.spinner}>
                        <LoadingSpinner isLoading={isLoading}/>
                    </Grid>
                    :
                    <AuthConsumer>
                        {({logout, user}: AuthInterface) => (
                            <React.Fragment>
                                {user.isAdmin && (
                                    <Redirect to={"/elections/"}/>
                                )}
                                <Election subElections={subElections} selectedCandidates={selectedCandidates}
                                          onCandidateClick={this.onCandidateSelected}
                                          onSubmit={() => this.onSubmit(logout)}
                                          onReload={this.fetchData}/>
                            </React.Fragment>
                        )}
                    </AuthConsumer>
                }
                <Snackbar open={snackbarOpen} message={<span>{snackbarMessage}</span>}
                          autoHideDuration={5000}
                          onClose={() => this.setState({snackbarOpen: false})}/>
            </div>
        )
    }
}

export const ElectionContainerWithRouter = withRouter(ElectionContainer);
