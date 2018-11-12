import * as React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import {SubElection} from "../interfaces/SubElection";
import {Pie} from "react-chartjs-2";
import {chartOptions, getDataFromSubElection} from "../../utils/chart";


interface ResultViewProps {
    className: string
    subElection: SubElection

    onClick(subElection: SubElection)
}

export class ResultView extends React.Component<ResultViewProps, {}> {
    render() {
        const {className, subElection, onClick} = this.props;
        const data = getDataFromSubElection(subElection);

        const votes = subElection.candidates.map((c) => c.votes);
        const hasResults = votes.every(x => x !== null) && votes.some(x => x !== 0);
        return (
            <div className={className} onClick={() => onClick(subElection)}>
                <Typography variant={"h5"}>Ergebnisse</Typography>
                {hasResults ?
                    <Pie data={data} options={chartOptions()}/>
                    :
                    <Typography>Es wurden noch keine Stimmen abgegeben.</Typography>
                }
            </div>
        )
    }
}
