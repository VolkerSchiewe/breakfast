import * as React from 'react';
import {Component} from 'react';
import {Election} from "../interfaces/Election";
import {ElectionList} from "../components/ElectionList";
import {RouteComponentProps, withRouter} from 'react-router';
import {CreateElectionModal} from "../components/CreateElectionModal";
import {ElectionService} from "../services/management-service";

interface ElectionListContainerState {
    elections: Election[]
    electionModalOpen: boolean
}

class ElectionListContainer extends Component<RouteComponentProps, ElectionListContainerState> {
    electionService = new ElectionService();

    constructor(props: any) {
        super(props);
        this.state = {
            elections: [],
            electionModalOpen: false,
        }
    }

    handleRowClick = (id) => {
        this.props.history.push(`/elections/${id}`);
    };

    handleActiveChange = (id) => {
        const {elections} = this.state;

        //TODO send to backend
        elections.map((election) => {
            if (election.id == id)
                election.isActive = !election.isActive;
            else
                election.isActive = false;
        });
        this.setState({elections: elections});
    };

    handleCodesClick = (election) => {
        console.log(election.codes)
        // TODO show formatted codes in new tab
    };

    componentDidMount() {
        this.electionService.getElections().then(
            result => {
                this.setState({
                    elections: result,
                })
            }
        );
        // this.setState({
        //     elections: [
        //         {
        //             id: 0,
        //             title: "1. Durchgang",
        //             candidateNames: "Max, Moritz",
        //             codes: ["cds", "csad"],
        //             voteCount: 2,
        //             isActive: false,
        //
        //         },
        //         {
        //             id: 1,
        //             title: "2. Durchgang",
        //             candidateNames: "",
        //             codes: ["cds", "csad", "dasd", "asdas", "asd"],
        //             voteCount: 0,
        //             isActive: true
        //         }
        //     ]
        // })
    }

    handleNewElection = () => {
        this.setState({
            electionModalOpen: true
        })
    };

    saveElection = (title, number) => {
        console.log(title, number);
        //TODO send to backend
        this.setState({
            electionModalOpen: false
        })
    };

    public render() {
        const {elections, electionModalOpen} = this.state;
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
                {electionModalOpen &&
                <CreateElectionModal isOpen={electionModalOpen}
                                     handleClose={() => {
                                         this.setState({electionModalOpen: false})
                                     }}
                                     saveElection={this.saveElection}/>
                }
            </div>
        );
    }
}

export const ElectionListContainerWithRouter = withRouter(ElectionListContainer);