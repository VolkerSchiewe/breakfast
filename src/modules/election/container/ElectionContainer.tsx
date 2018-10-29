import * as React from 'react';
import {SubElection} from "../../management/interfaces/SubElection";
import {Election} from "../components/Election";
import {Candidate} from "../../management/interfaces/Candidate";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";

interface ElectionContainerState {
    isLoading: boolean
    subElections: SubElection[]
    selectedCandidates: {}
    snackbarOpen: boolean
}

interface ElectionContainerProps {

}


export class ElectionContainer extends React.Component<ElectionContainerProps, ElectionContainerState> {
    onCandidateSelected = (subElection: SubElection, candidate: Candidate) => {
        const {selectedCandidates} = this.state;
        let selected = selectedCandidates;
        selected[subElection.id] = candidate.id;
        this.setState({
            selectedCandidates: selected
        });
    };
    onSubmit = () => {
        const {selectedCandidates, subElections} = this.state;
        if (Object.keys(selectedCandidates).length != subElections.length)
            this.setState({snackbarOpen: true});
        else {
            //TODO send to backend
            console.log(this.state.selectedCandidates)
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            subElections: [],
            selectedCandidates: {},
            snackbarOpen: false,
        }
    }

    componentDidMount() {
        //TODO get data from backend
        this.setState({
            subElections: [
                {
                    id: 0,
                    title: "PT",
                    candidates: [
                        {
                            id: 1,
                            name: "Finn",
                        }, {
                            id: 2,
                            name: "Volker"
                        }
                    ]
                },
                {
                    id: 1,
                    title: "AeJ",
                    candidates: [
                        {
                            id: 3,
                            name: "Max"
                        }, {
                            id: 4,
                            name: "Maria",
                        }, {
                            id: 5,
                            name: "Lustig"
                        }
                    ]
                },
            ]
        })
    }

    render() {
        const {subElections, selectedCandidates, snackbarOpen} = this.state;
        return (
            <div>
                <Election subElections={subElections} selectedCandidates={selectedCandidates}
                          onCandidateClick={this.onCandidateSelected}
                          onSubmit={this.onSubmit}/>
                <Snackbar open={snackbarOpen} message={<span>{"Du musst überall einen Kandidaten wählen!"}</span>}
                          autoHideDuration={5000}
                          onClose={() => this.setState({snackbarOpen: false})}/>
            </div>
        )
    }

}
