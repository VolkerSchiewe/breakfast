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
import {openWebsocket} from "../../utils/websocket";

interface ElectionListContainerState {
    elections: Election[]
    modalElection?: Election
    electionModalOpen: boolean
    snackbarOpen: boolean
}

class ElectionListContainer extends Component<RouteComponentProps, ElectionListContainerState> {
    electionService = new ElectionService();
    ws = null;
    handleActiveChange = (id) => {
        this.electionService.updateElection(id)
            .then();
    };
    openNewElection = () => {
        this.setState({
            electionModalOpen: true
        })
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
    createElection = (title, number) => {
        this.electionService.createElection(title, number)
            .then(
                res => {
                    this.setState({
                        snackbarOpen: false,
                    });
                }
            );
        this.setState({
            electionModalOpen: false,
            snackbarOpen: true,
        });
    };
    refreshData = () => {
        this.setState({
            elections: [],
        }, () => {
            if (this.ws != null) {
                this.ws.send('Updata Data')
            }
        });
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

    componentDidMount() {
        this.ws = openWebsocket('elections', this.onMessage)
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
                              handleNewElection={this.openNewElection}
                              refreshData={this.refreshData}/>
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