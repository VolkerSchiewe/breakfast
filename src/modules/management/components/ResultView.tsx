import * as React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import {SubElection} from "../interfaces/SubElection";
import {Pie} from "react-chartjs-2";

const palette = require("google-palette");

interface ResultViewProps {
    className: string
    subElection: SubElection
}

export class ResultView extends React.Component<ResultViewProps, {}> {
    render() {
        const {className, subElection} = this.props;
        const data = {
            labels: subElection.candidates.map((candidate) => candidate.name),
            datasets: [{
                data: subElection.candidates.map((candidate) => candidate.votes),
                backgroundColor: palette('tol', subElection.candidates.length).map((hex) => `#${hex}`),
            }]
        };

        const options = {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 20,
                },
            }
        };
        const votes = subElection.candidates.map((c) => c.votes);
        const hasResults = votes.every(x => x !== null) && votes.some(x => x !== 0);
        return (
            <div className={className}>
                <Typography variant={"h5"}>Ergebnisse</Typography>
                {hasResults ?
                    <Pie data={data} options={options}/>
                    :
                    <Typography>Es wurden noch keine Stimmen abgegeben.</Typography>
                }
            </div>
        )
    }
}
