import * as React from 'react';
import {Component} from 'react';
import {Election} from "../interfaces/Election";
import {ElectionList} from "../components/ElectionList";
import {RouteComponentProps, withRouter} from 'react-router';
import {CreateElectionModal} from "../components/CreateElectionModal";
import {ManagementService} from "../services/management-service";
import Grid from "@material-ui/core/Grid/Grid";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import {openWebsocket} from "../../utils/websocket";
import {ElectionState} from "../interfaces/ElectionState";
import {parse} from "qs";


interface ElectionListContainerState {
    elections: Election[]
    modalElection?: Election
    electionModalOpen: boolean
    snackbarOpen: boolean
    showClosedElections: boolean
}

class ElectionListContainer extends Component<RouteComponentProps, ElectionListContainerState> {
    electionService = new ManagementService();
    ws = null;
    handleActiveChange = (id) => {
        this.electionService.setElectionActive(id)
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
        console.log(election.codes);
        window.open(`/elections/${election.id}/codes/`, "_blank")
    };
    createElection = (title, number) => {
        this.electionService.createElection(title, number)
            .then(
                () => {
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
    handleRefresh = () => {
        this.setState({
            elections: [],
        }, () => {
            if (this.ws != null && this.ws.ws.readyState == this.ws.ws.OPEN) {
                this.ws.send('Updata Data')
            }
        });
    };
    handleShowClosedChange = () => {
        this.props.history.push('/elections/?closed=' + !this.state.showClosedElections);
        this.setState({
            showClosedElections: !this.state.showClosedElections
        });
    };

    parseShowClosedElections = () => {
        const params = parse(this.props.location.search, {ignoreQueryPrefix: true});
        return params['closed'] == "true";
    };

    constructor(props: any) {
        super(props);
        this.state = {
            elections: [],
            modalElection: null,
            electionModalOpen: false,
            snackbarOpen: false,
            showClosedElections: this.parseShowClosedElections()
        };
    }

    componentDidMount() {
        this.ws = openWebsocket('elections', this.onMessage)
    }

    componentWillUnmount() {
        this.ws.close(1000)
    }

    render() {
        const {elections, electionModalOpen, snackbarOpen, showClosedElections} = this.state;
        let activeElectionId = undefined;
        const activeElection = elections.filter((election) => election.state == ElectionState.ACTIVE);
        if (activeElection.length != 0)
            activeElectionId = activeElection[0].id;
        const filteredElections = showClosedElections ? elections : elections.filter(e => e.state != ElectionState.CLOSED);
        return (
            <div>
                <ElectionList elections={filteredElections} activeElectionId={activeElectionId}
                              showClosed={showClosedElections}
                              handleActiveChange={this.handleActiveChange}
                              handleRowClick={this.handleRowClick}
                              handleCodesClick={this.handleCodesClick}
                              handleNewElection={this.openNewElection}
                              handleShowClosedChange={this.handleShowClosedChange}
                              handleRefresh={this.handleRefresh}/>
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