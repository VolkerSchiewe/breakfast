import { SubElection } from "../management/interfaces/SubElection";
import * as palette from "google-palette";
import { ChartData, ChartOptions } from "chart.js";

export function getDataFromSubElection(
  subElection: SubElection
): ChartData<"pie", number[], string> {
  return {
    labels: subElection.candidates.map((candidate) => candidate.name),
    datasets: [
      {
        data: subElection.candidates.map((candidate) => candidate.votes ?? 0),
        backgroundColor: palette
          .default("tol", subElection.candidates.length)
          .map((hex: string) => `#${hex}`),
      },
    ],
  };
}

export function chartOptions(
  adaptToView: boolean = false,
  animation: boolean = true
): ChartOptions {
  // const width = window.innerWidth
  const boxWidth = adaptToView ? window.innerWidth / 40 : 12;
  const padding = adaptToView ? window.innerWidth / 50 : 12;
  const fontSize = adaptToView ? window.innerWidth / 40 : 12;
  const options: ChartOptions = {
    plugins: {
      legend: {
        position: "right" as "right",
        labels: {
          boxWidth,
          font: {
            size: fontSize,
          },
          padding,
        },
      },
    },
  };
  if (!animation) {
    options.animation = false;
  }
  return options;
}
