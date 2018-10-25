import * as React from 'react';
import {Component} from 'react';
import {Election} from "../interfaces/Election";
import {ElectionList} from "../components/ElectionList";
import {RouteComponentProps, withRouter} from 'react-router';
import {CreateElectionModal} from "../components/CreateElectionModal";
import {ElectionService} from "../services/management-service";
import Grid from "@material-ui/core/Grid/Grid";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Sockette from 'sockette'

interface ElectionListContainerState {
    elections: Election[]
    modalElection?: Election
    electionModalOpen: boolean
    snackbarOpen: boolean
}

class ElectionListContainer extends Component<RouteComponentProps, ElectionListContainerState> {
    electionService = new ElectionService();

    createElection = (title, number) => {
        this.electionService.createElection(title, number)
            .then(
                res => {
                    this.setState({
                        snackbarOpen: false,
                    });
                    console.log(res)
                }
            );
        this.setState({
            electionModalOpen: false,
            snackbarOpen: true,
        });
    };
    handleActiveChange = (id) => {
        this.electionService.updateElection(id)
            .then(res => {
            });
    };

    handleRowClick = (id) => {
        this.props.history.push(`/elections/${id}`);
    };
    onMessage = (e) => {
        const data = JSON.parse(e.data);
        this.setState({elections: data});
    };

    handleCodesClick = (election) => {
        console.log(election.codes)
        // TODO show formatted codes in new tab
    };

    constructor(props: any) {
        super(props);
        this.state = {
            elections: [],
            modalElection: null,
            electionModalOpen: false,
            snackbarOpen: false,
        };
    }

    handleNewElection = () => {
        this.setState({
            electionModalOpen: true
        })
    };

    componentDidMount() {
        const ws = new Sockette('ws://localhost:8000/elections', {
            timeout: 5e3,
            maxAttempts: 10,
            onopen: e => console.log('Connected!', e),
            onmessage: this.onMessage,
            onclose: e => console.log('Closed!', e),
            onerror: e => console.log('Error:', e)
        });
    }

    render() {
        const {elections, electionModalOpen, snackbarOpen} = this.state;
        let activeElectionId = undefined;
        const activeElection = elections.filter((election) => election.isActive);
        if (activeElection.length != 0)
            activeElectionId = activeElection[0].id;
        return (
            <div>
                <ElectionList elections={elections} activeElectionId={activeElectionId}
                              handleActiveChange={this.handleActiveChange}
                              handleRowClick={this.handleRowClick}
                              handleCodesClick={this.handleCodesClick}
                              handleNewElection={this.handleNewElection}/>
                <Snackbar open={snackbarOpen}
                          message={(
                              <Grid container alignItems={"center"}>
                                  <CircularProgress size={15}/>
                                  <span style={{marginLeft: 10}}>Wird gespeichert ...</span>
                              </Grid>
                          )}/>
                {electionModalOpen &&
                <CreateElectionModal isOpen={electionModalOpen}
                                     handleClose={() => {
                                         this.setState({electionModalOpen: false})
                                     }}
                                     saveElection={this.createElection}/>
                }
            </div>
        );
    }
}

export const ElectionListContainerWithRouter = withRouter(ElectionListContainer);