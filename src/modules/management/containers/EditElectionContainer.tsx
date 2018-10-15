import * as React from 'react';
import {Component} from 'react';
import {EditElection} from "../components/EditElection";
import {Election} from "../interfaces/Election";
import {SubElection} from "../interfaces/SubElection";
import {Candidate} from "../interfaces/Candidate";
import {defaultImage} from "../../misc/components/UploadImage";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import {CandidateModal} from "../components/CandidateModal";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Grid from "@material-ui/core/Grid/Grid";

interface EditElectionState {
    election?: Election,
    subElections: SubElection[],
    modalCandidate?: Candidate,
    candidateModalOpen: boolean,
    modalImagePreview,

    snackbarOpen: boolean
}

const emptyCandidate: Candidate = {name: ''};

export class EditElectionContainer extends Component<any, EditElectionState> {
    constructor(props: any) {
        super(props);
        this.state = {
            subElections: [
                {
                    id: 0,
                    name: "PT",
                    candidates: [
                        {
                            id: 0,
                            name: "Max",
                            imageFile: "https://static.thenounproject.com/png/17241-200.png"
                        },
                        {
                            id: 1,
                            name: "Moritz",
                            imageFile: "https://static.thenounproject.com/png/17241-200.png"
                        },
                    ],
                },
                {
                    id: 1,
                    name: "AeJ",
                    candidates: [],
                },
            ],
            modalCandidate: emptyCandidate,
            modalImagePreview: defaultImage,
            candidateModalOpen: false,
            snackbarOpen: false,
        }
    }

    componentDidMount() {
        const electionId = this.props.match.params.electionId;
        //TODO get election
        this.setState({election: {id: electionId, name: "1. Durchgang", isActive: true}})
    }

    handleCandidateClick = (candidate) => {
        this.setState({
            candidateModalOpen: true,
            modalCandidate: candidate,
            modalImagePreview: candidate.imageFile,
        })
    };

    handleNewCandidateClick = () => {
        this.setState({
            candidateModalOpen: true,
            modalCandidate: emptyCandidate,
            modalImagePreview: defaultImage,
        })
    };

    handleCandidateModalClose = () => {
        this.setState({candidateModalOpen: false});
    };

    saveCandidate = () => {
        //TODO Send to backend
        console.log("Candidate",this.state.modalCandidate);

        this.setState({
            candidateModalOpen: false,
            snackbarOpen: true,
        });
    };

    handleModalNameChange = (value) => {
        this.setState({
            modalCandidate: {
                name: value
            }
        })
    };

    handleModalImageChange = (files) => {
        if (files.length !== 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    modalCandidate: {
                        name: this.state.modalCandidate.name,
                        imageFile: files[0]
                    },
                    modalImagePreview: reader.result,
                });
            };
            reader.readAsDataURL(files[0]);
        }
    };

    handleModalClearImage = (event) => {
        event.stopPropagation();
        this.setState({
            modalImagePreview: defaultImage,
            modalCandidate: {
                name: this.state.modalCandidate.name,
                imageFile: null
            }
        });
    };

    public render() {
        const {election, subElections, modalCandidate, candidateModalOpen, modalImagePreview, snackbarOpen} = this.state;
        return (
            <div>
                {election &&
                <EditElection election={election}
                              subElections={subElections}
                              modalCandidate={modalCandidate}
                              candidateModalOpen={candidateModalOpen}
                              modalImagePreview={modalImagePreview}

                              handleCandidateClick={this.handleCandidateClick}
                              handleNewCandidateClick={this.handleNewCandidateClick}
                />
                }
                <Snackbar open={snackbarOpen}
                          message={(
                              <Grid container alignItems={"center"}>
                                  <CircularProgress size={15}/>
                                  <span style={{marginLeft:10}}>Wird gespeichert ...</span>
                              </Grid>
                          )}/>
                <CandidateModal isOpen={candidateModalOpen}
                                candidate={modalCandidate}
                                imagePreview={modalImagePreview}

                                handleClose={this.handleCandidateModalClose}
                                saveCandidate={this.saveCandidate}
                                handleNameChange={this.handleModalNameChange}
                                handleImageChange={this.handleModalImageChange}
                                handleClearImage={this.handleModalClearImage}
                />
            </div>
        )
    }
}
