import * as React from 'react';
import {Component} from 'react';
import {Election} from "../interfaces/Election";
import {ElectionList} from "../components/ElectionList";

interface ElectionListContainerState {
    elections: Election[]
}

export class ElectionListContainer extends Component<{}, ElectionListContainerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            elections: []
        }
    }

    componentDidMount() {
        this.setState({
            elections: [
                {
                    id: 0,
                    name: "1 Durchgang",
                    isActive: false,

                },
                {
                    id: 1,
                    name: "2. Durchgang",
                    isActive: true
                }
            ]
        })
    }

    handleActiveChange(id) {
        const {elections} = this.state;

        //TODO send to backend
        elections.map((election) => {
            if (election.id == id)
                election.isActive = !election.isActive;
            else
                election.isActive = false;
        });
        this.setState({elections: elections});
    }

    public render() {
        const {elections} = this.state;
        let activeElectionId = undefined;
        const activeElection = elections.filter((election) => election.isActive);
        if (activeElection.length != 0)
            activeElectionId = activeElection[0].id;
        return (
            <ElectionList elections={elections} activeElectionId={activeElectionId}
                          handleActiveChange={(id) => this.handleActiveChange(id)}/>
        );
    }
}
