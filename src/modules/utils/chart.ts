import {SubElection} from "../management/interfaces/SubElection";
import * as palette from 'google-palette';

export function getDataFromSubElection(subElection: SubElection) {
    return {
        labels: subElection.candidates.map((candidate) => candidate.name),
        datasets: [{
            data: subElection.candidates.map((candidate) => candidate.votes),
            backgroundColor: palette.default('tol', subElection.candidates.length).map((hex) => `#${hex}`),
        }]
    };
}

export function chartOptions(adaptToView: boolean = false, animation: boolean = true) {
    // const width = window.innerWidth
    const boxWidth = adaptToView ? window.innerWidth / 40 : 12;
    const padding = adaptToView ?  window.innerWidth / 50 : 12;
    const fontSize = adaptToView ? window.innerWidth / 40 : 12;
    let options = {
        plugins:{
            legend: {
                position: 'right' as 'right',
                labels: {
                    boxWidth: boxWidth,
                    fontSize: fontSize,
                    padding: padding,
                },
            }
        }
    };
    if (!animation)
        options["animation"] = false;
    return options;
}
