import * as React from 'react';
import {Component} from 'react';
import {EditElection} from "../components/EditElection";
import {Election} from "../interfaces/Election";
import {SubElection} from "../interfaces/SubElection";
import {Candidate} from "../interfaces/Candidate";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import {CandidateModal} from "../components/CandidateModal";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Grid from "@material-ui/core/Grid/Grid";
import {ManagementService} from "../services/management-service";
import {AlertDialog} from "../../layout/components/AlertDialog";
import TextField from "@material-ui/core/TextField/TextField";
import {openWebsocket} from "../../utils/websocket";

interface EditElectionState {
    election?: Election
    subElections: SubElection[]
    modalCandidate?: Candidate
    modalSubElection?: SubElection

    candidateModalOpen: boolean
    deleteDialogOpen: boolean
    editDialogOpen: boolean
    snackbarOpen: boolean
}

const emptyCandidate: Candidate = {name: ''};

export class EditElectionContainer extends Component<any, EditElectionState> {
    electionService = new ManagementService();
    ws = null;

    handleDeleteCandidate = (candidate: Candidate) => {
        this.electionService.deleteCandidate(candidate)
            .then(() => this.setState({candidateModalOpen: false}))
    };

    saveCandidate = (candidate: Candidate) => {
        this.setState({
            candidateModalOpen: false,
            snackbarOpen: true,
        });

        if (candidate.id !== undefined) {
            this.electionService.updateCandidate(candidate)
                .then(() =>
                    this.setState({snackbarOpen: false})
                );
        } else {
            this.electionService.createCandidate(candidate)
                .then(() =>
                    this.setState({snackbarOpen: false}
                    )
                );
        }
    };

    openCandidateModal = (subElectionId: number, candidate?: Candidate) => {
        if (candidate !== undefined)
            candidate.subElection = subElectionId;
        else
            emptyCandidate.subElection = subElectionId;
        const candidateModal = candidate ? candidate : emptyCandidate;

        this.setState({
            candidateModalOpen: true,
            modalCandidate: candidateModal,
        })
    };

    handleCandidateModalClose = () => {
        this.setState({candidateModalOpen: false});
    };
    openDeleteElectionModal = () => {
        this.setState({deleteDialogOpen: true})
    };
    handleDeleteElection = () => {
        const {election} = this.state;
        this.setState({deleteDialogOpen: false});
        this.electionService.deleteElection(election)
            .then(() =>
                this.props.history.push('/elections'));
    };

    handleDialogClose = () => {
        this.setState({deleteDialogOpen: false, editDialogOpen: false})
    };
    createSubElection = (name) => {
        const electionId = this.props.match.params.electionId;
        this.electionService.createSubElection(name, electionId)
            .then();
    };
    onSubElectionMessage = (e) => {
        const data = JSON.parse(e.data);
        this.setState({subElections: data});
    };

    editSubElection = (subElection: SubElection) => {
        this.setState({editDialogOpen: true, modalSubElection: subElection})
    };

    changeSubElectionModal = (value: string) => {
        this.setState({
            modalSubElection: {
                ...this.state.modalSubElection,
                title: value,
            }
        })
    };

    saveSubElection = () => {
        this.electionService.updateSubElection(this.state.modalSubElection)
            .then(() =>
                this.setState({editDialogOpen: false})
            );
    };

    deleteSubElection = () => {
        this.electionService.deleteSubElection(this.state.modalSubElection.id)
            .then(() =>
                this.setState({editDialogOpen: false})
            );
    };

    refreshData = () => {
        this.setState({
            subElections: [],
        }, () => {
            if (this.ws != null) {
                this.ws.send('Update Data')
            }
        });

    };

    constructor(props: any) {
        super(props);
        this.state = {
            subElections: [],
            modalCandidate: null,
            modalSubElection: null,
            candidateModalOpen: false,
            deleteDialogOpen: false,
            editDialogOpen: false,
            snackbarOpen: false,
        }
    }

    componentDidMount() {
        const electionId = this.props.match.params.electionId;
        this.ws = openWebsocket('elections/' + electionId, this.onSubElectionMessage);
        this.electionService.getElection(electionId)
            .then(res => {
                this.setState({election: res})
            })
            .catch(() =>
                this.props.history.push('/elections/'));
    }

    render() {
        const {election, subElections, modalCandidate, modalSubElection, candidateModalOpen, deleteDialogOpen, editDialogOpen, snackbarOpen} = this.state;
        return (
            <div>
                {election &&
                <EditElection election={election}
                              subElections={subElections}
                              openCandidateModal={this.openCandidateModal}
                              saveSubElection={this.createSubElection}
                              deleteElection={this.openDeleteElectionModal}
                              editSubElection={this.editSubElection}
                              refreshData={this.refreshData}
                />
                }
                <Snackbar open={snackbarOpen}
                          message={(
                              <Grid container alignItems={"center"}>
                                  <CircularProgress size={15}/>
                                  <span style={{marginLeft: 10}}>Wird gespeichert ...</span>
                              </Grid>
                          )}/>
                {candidateModalOpen &&
                <CandidateModal isOpen={candidateModalOpen}
                                isNew={modalCandidate == emptyCandidate}
                                candidate={modalCandidate}
                                handleClose={this.handleCandidateModalClose}
                                saveCandidate={this.saveCandidate}
                                handleDelete={this.handleDeleteCandidate}/>
                }
                {deleteDialogOpen &&
                <AlertDialog isOpen={deleteDialogOpen}
                             title={'Wahlgang löschen?'}
                             handleClose={this.handleDialogClose}
                             handleOk={this.handleDeleteElection}/>
                }
                {editDialogOpen &&
                <AlertDialog isOpen={editDialogOpen}
                             title={'Wahl ändern'}
                             body={<TextField variant={"outlined"}
                                              label={'Name'}
                                              margin={"normal"}
                                              value={modalSubElection.title}
                                              onChange={(e) => this.changeSubElectionModal(e.target.value)}/>}
                             deleteButton={true}
                             handleClose={this.handleDialogClose}
                             handleOk={this.saveSubElection}
                             handleDelete={this.deleteSubElection}/>
                }
            </div>
        )
    }
}
