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
import {ElectionService} from "../services/management-service";

interface EditElectionState {
    election?: Election
    subElections: SubElection[]
    modalCandidate?: Candidate
    candidateModalOpen: boolean
    snackbarOpen: boolean
}

const emptyCandidate: Candidate = {name: ''};

export class EditElectionContainer extends Component<any, EditElectionState> {
    electionService = new ElectionService();

    constructor(props: any) {
        super(props);
        this.state = {
            subElections: [],
            modalCandidate: emptyCandidate,
            candidateModalOpen: false,
            snackbarOpen: false,
        }
    }

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
    saveCandidate = (candidate: Candidate) => {
        this.setState({
            candidateModalOpen: false,
            snackbarOpen: true,
        });

        if (candidate.id !== undefined) {
            this.electionService.updateCandidate(candidate)
                .then(res =>
                    this.setState({snackbarOpen: false})
                );
        } else {
            this.electionService.createCandidate(candidate)
                .then(res =>
                    this.setState({snackbarOpen: false}
                    )
                );
        }

    };

    handleCandidateModalClose = () => {
        this.setState({candidateModalOpen: false});
    };
    saveSubElection = (name) => {
        const electionId = this.props.match.params.electionId;
        console.log(name);
        this.electionService.createSubElection(name, electionId)
            .then(res => {
                    console.log(res)
                }
            );

    };

    componentDidMount() {
        const electionId = this.props.match.params.electionId;
        this.electionService.getElection(electionId)
            .then(res => {
                this.setState({election: res})
            });
        this.electionService.getSubElections(electionId)
            .then(
                res => {
                    this.setState({subElections: res});
                }
            );
    }

    public render() {
        const {election, subElections, modalCandidate, candidateModalOpen, snackbarOpen} = this.state;
        return (
            <div>
                {election &&
                <EditElection election={election}
                              subElections={subElections}

                              openCandidateModal={this.openCandidateModal}

                              saveSubElection={this.saveSubElection}
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
