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

interface EditElectionState {
    election?: Election
    subElections: SubElection[]
    modalCandidate?: Candidate
    candidateModalOpen: boolean
    snackbarOpen: boolean
}

const emptyCandidate: Candidate = {name: ''};

export class EditElectionContainer extends Component<any, EditElectionState> {
    constructor(props: any) {
        super(props);
        this.state = {
            subElections: [],
            modalCandidate: emptyCandidate,
            candidateModalOpen: false,
            snackbarOpen: false,
        }
    }

    componentDidMount() {
        const electionId = this.props.match.params.electionId;
        //TODO get election
        this.setState({
            election: {
                id: electionId, title: "1. Durchgang",
                isActive: true
            }
        })
    }

    handleCandidateClick = (candidate) => {
        this.setState({
            candidateModalOpen: true,
            modalCandidate: candidate,
        })
    };

    handleNewCandidateClick = () => {
        this.setState({
            candidateModalOpen: true,
            modalCandidate: emptyCandidate,
        })
    };

    handleCandidateModalClose = () => {
        this.setState({candidateModalOpen: false});
    };

    saveCandidate = (candidate) => {
        console.log(candidate);
        this.setState({
            candidateModalOpen: false,
            snackbarOpen: true,
        });
    };

    public render() {
        const {election, subElections, modalCandidate, candidateModalOpen, snackbarOpen} = this.state;
        return (
            <div>
                {election &&
                <EditElection election={election}
                              subElections={subElections}

                              handleCandidate={this.handleCandidateClick}
                              handleNewCandidate={this.handleNewCandidateClick}
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
                                candidate={modalCandidate}
                                handleClose={this.handleCandidateModalClose}
                                saveCandidate={this.saveCandidate}/>
                }
            </div>
        )
    }
}
