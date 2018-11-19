import {Candidate} from "./Candidate";

export interface SubElection {
    id:number,
    title: string,
    candidates: Candidate[],
    names?: string[],
}