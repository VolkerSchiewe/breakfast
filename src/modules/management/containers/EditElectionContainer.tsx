import * as React from 'react';
import {Component} from 'react';
import {EditElection} from "../components/EditElection";
import {Election} from "../interfaces/Election";
import {SubElection} from "../interfaces/SubElection";

interface EditElectionState {
    election?: Election,
    subElections: SubElection[],

}

export class EditElectionContainer extends Component<any, EditElectionState> {
    constructor(props: any) {
        super(props);
        this.state = {
            subElections: []
        }
    }

    componentDidMount() {
        const electionId = this.props.match.params.electionId
        //TODO get election
        this.setState({election: {id: electionId, name: "1. Durchgang", isActive: true}})
    }

    public render() {
        const {election, subElections} = this.state;
        return (
            <div>
                {election &&
                <EditElection election={election} subElections={subElections}/>
                }
            </div>
        )
    }
}
