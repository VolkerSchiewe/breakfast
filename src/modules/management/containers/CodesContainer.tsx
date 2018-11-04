import * as React from 'react';
import {Codes} from "../components/Codes";
import {ManagementService} from "../services/management-service";

interface CodesContainerState {
    codes: string[]
    title: string
}

export class CodesContainer extends React.Component<any, CodesContainerState> {
    managementService = new ManagementService();

    constructor(props) {
        super(props);
        this.state = {
            codes: [],
            title: ''
        }
    }

    componentDidMount() {
        const electionId = this.props.match.params.electionId;
        this.managementService.getCodes(electionId)
            .then(res => {
                this.setState({
                    codes: res.codes,
                    title: res.title,
                })
            })
            .catch(res => {
                console.log(res)
            })
    }

    render() {
        const {codes, title} = this.state;
        return (
            <Codes codes={codes} title={title}/>
        )
    }
}
