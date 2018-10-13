import * as React from 'react';
import {Component} from 'react';
import {EditElection} from "../components/EditElection";
import {Election} from "../interfaces/Election";
import {SubElection} from "../interfaces/SubElection";
import {Candidate} from "../interfaces/Candidate";
import {defaultImage} from "../../misc/components/UploadImage";

interface EditElectionState {
    election?: Election,
    subElections: SubElection[],
    modalCandidate?: Candidate,
    createCandidateModalOpen: boolean,
    modalImagePreview,
}

const emptyCandidate: Candidate = {name: ''};

export class EditElectionContainer extends Component<any, EditElectionState> {
    constructor(props: any) {
        super(props);
        this.state = {
            subElections: [
                {
                    name: "PT",
                    candidates: [
                        {
                            name: "Max",
                            imageFile: "https://static.thenounproject.com/png/17241-200.png"
                        },
                        {
                            name: "Moritz",
                            imageFile: "https://static.thenounproject.com/png/17241-200.png"
                        },
                    ],
                },
                {
                    name: "AeJ",
                    candidates: [],
                },
            ],
            modalCandidate: emptyCandidate,
            modalImagePreview: defaultImage,
            createCandidateModalOpen: false,
        }
    }

    componentDidMount() {
        const electionId = this.props.match.params.electionId;
        //TODO get election
        this.setState({election: {id: electionId, name: "1. Durchgang", isActive: true}})
    }

    handleCandidateClick = (candidate) => {
        this.setState({
            createCandidateModalOpen: true,
            modalCandidate: candidate,
            modalImagePreview: candidate.imageFile,
        })
    };

    handleNewCandidateClick = () => {
        this.setState({
            createCandidateModalOpen: true,
            modalCandidate: emptyCandidate,
            modalImagePreview: defaultImage,
        })
    };

    handleCandidateModalClose = () => {
        this.setState({createCandidateModalOpen: false});
        //TODO Send to backend
    };

    saveCandidate = (candidate) => {
        this.setState({createCandidateModalOpen: false});
        //TODO show snackBar with spinner
        console.log(candidate)
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
        const {election, subElections, modalCandidate, createCandidateModalOpen, modalImagePreview} = this.state;
        console.log(modalCandidate);
        return (
            <div>
                {election &&
                <EditElection election={election}
                              subElections={subElections}
                              modalCandidate={modalCandidate}
                              candidateModalOpen={createCandidateModalOpen}
                              modalImagePreview={modalImagePreview}

                              handleCandidateClick={this.handleCandidateClick}
                              handleNewCandidateClick={this.handleNewCandidateClick}
                              handleCandidateModalClose={this.handleCandidateModalClose}
                              saveCandidate={this.saveCandidate}
                              handleModalNameChange={this.handleModalNameChange}
                              handleModalImageChange={this.handleModalImageChange}
                              handleModalClearImage={this.handleModalClearImage}
                />
                }
            </div>
        )
    }
}
