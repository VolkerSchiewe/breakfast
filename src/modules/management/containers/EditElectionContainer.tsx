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
import {RouteComponentProps} from "react-router";
import ResultModal from "../components/ResultModal";

interface EditElectionState {
    election?: Election
    subElections: SubElection[]
    modalCandidate?: Candidate
    modalSubElection?: SubElection

    electionTitle: string
    candidateModalOpen: boolean
    deleteDialogOpen: boolean
    editSubElectionOpen: boolean
    editElectionOpen: boolean
    snackbarOpen: boolean
    resultModalOpen: boolean
}

interface EditElectionProps extends RouteComponentProps {

}

const emptyCandidate: Candidate = {name: ''};

export class EditElectionContainer extends Component<EditElectionProps, EditElectionState> {
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
                )
        } else {
            this.electionService.createCandidate(candidate)
                .then(() =>
                    this.setState({snackbarOpen: false}
                    )
                )
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
                this.props.history.push('/elections'))
    };

    handleDialogClose = () => {
        this.setState({deleteDialogOpen: false, editSubElectionOpen: false, editElectionOpen: false})
    };
    createSubElection = (name) => {
        const electionId = this.props.match.params["electionId"];
        this.electionService.createSubElection(name, electionId)
            .then()
    };
    onSubElectionMessage = (e) => {
        const data = JSON.parse(e.data);
        this.setState({subElections: data});
    };

    editSubElection = (subElection: SubElection) => {
        this.setState({editSubElectionOpen: true, modalSubElection: subElection})
    };

    editElection = () => {
        this.setState({editElectionOpen: true, electionTitle: this.state.election.title})
    };

    changeSubElectionModal = (value: string) => {
        this.setState({
            modalSubElection: {
                ...this.state.modalSubElection,
                title: value,
            }
        })
    };

    changeElectionModal = (value: string) => {
        this.setState({
            electionTitle: value
        })
    };

    saveSubElection = () => {
        this.electionService.updateSubElection(this.state.modalSubElection)
            .then(() =>
                this.setState({editSubElectionOpen: false})
            )
    };

    saveElection = () => {
        this.electionService.updateElection({id: this.state.election.id, title: this.state.electionTitle})
            .then(() => {
                    this.fetchData();
                    this.setState({editElectionOpen: false});
                }
            )
    };

    deleteSubElection = () => {
        this.electionService.deleteSubElection(this.state.modalSubElection.id)
            .then(() =>
                this.setState({editSubElectionOpen: false})
            )
    };

    handleMenuItemSelected = (item: number) => {
        switch (item) {
            case 0: {
                this.setState({
                    subElections: [],
                }, () => {
                    if (this.ws != null && this.ws.ws.readyState == this.ws.ws.OPEN) {
                        this.ws.send('Update Data')
                    }
                });
                return
            }
            case 1: {
                this.electionService.closeElection(this.state.election.id)
                    .then(() =>
                        this.fetchData()
                    );
                return
            }
        }
    };

    showResultModal = (subElection: SubElection) => {
        this.setState({
            resultModalOpen: true,
            modalSubElection: subElection,
        })
    };
    fetchData = () => {
        const electionId = this.props.match.params["electionId"];
        this.ws = openWebsocket('elections/' + electionId, this.onSubElectionMessage);
        this.electionService.getElection(electionId)
            .then(res => {
                this.setState({election: res})
            })
    };

    constructor(props: any) {
        super(props);
        this.state = {
            subElections: [],
            modalCandidate: null,
            modalSubElection: null,
            candidateModalOpen: false,
            deleteDialogOpen: false,
            editSubElectionOpen: false,
            editElectionOpen: false,
            snackbarOpen: false,
            resultModalOpen: false,
            electionTitle: '',
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    componentWillUnmount() {
        this.ws.close(1000)
    }

    render() {
        const {election, subElections, modalCandidate, modalSubElection, electionTitle, candidateModalOpen, deleteDialogOpen, editSubElectionOpen, editElectionOpen, snackbarOpen, resultModalOpen} = this.state;
        return (
            <div>
                {election &&
                <EditElection election={election}
                              subElections={subElections}
                              openCandidateModal={this.openCandidateModal}
                              saveSubElection={this.createSubElection}
                              editSubElection={this.editSubElection}
                              handleMenuItemSelected={this.handleMenuItemSelected}
                              handleResultClick={this.showResultModal}
                              editElection={this.editElection}
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
                {editSubElectionOpen &&
                <AlertDialog isOpen={editSubElectionOpen}
                             title={'Wahl ändern'}
                             body={<TextField variant={"outlined"}
                                              label={'Name'}
                                              margin={"normal"}
                                              value={modalSubElection.title}
                                              required
                                              onChange={(e) => this.changeSubElectionModal(e.target.value)}/>}
                             handleClose={this.handleDialogClose}
                             handleOk={this.saveSubElection}
                             handleDelete={this.deleteSubElection}/>
                }
                {editElectionOpen &&
                <AlertDialog isOpen={editElectionOpen}
                             title={'Wahlgang bearbeiten'}
                             body={
                                 <div>
                                     <TextField variant={"outlined"}
                                                label={'Name'}
                                                margin={"normal"}
                                                value={electionTitle}
                                                required
                                                onChange={(e) => this.changeElectionModal(e.target.value)}/>
                                 </div>
                             }
                             handleClose={this.handleDialogClose}
                             handleOk={this.saveElection}
                             handleDelete={this.openDeleteElectionModal}
                />
                }
                {resultModalOpen &&
                <ResultModal subElection={modalSubElection}
                             handleClose={() => this.setState({resultModalOpen: false})}/>
                }
            </div>
        )
    }
}
