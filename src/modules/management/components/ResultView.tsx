import * as React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import {SubElection} from "../interfaces/SubElection";
import {Pie} from "react-chartjs-2";

interface ResultViewProps {
    className: string
    subElection: SubElection
}

export class ResultView extends React.Component<ResultViewProps, any> {
    render() {
        const {className, subElection} = this.props;
        //TODO create data object
        const data = {
            labels: [
                'Red',
                'Green',
                'Yellow'
            ],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
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
        return (
            <div className={className}>
                <Typography variant={"h5"}>Ergebnisse</Typography>
                {/*TODO add chart*/}
                <Pie data={data} options={options}/>
            </div>
        )
    }
}
