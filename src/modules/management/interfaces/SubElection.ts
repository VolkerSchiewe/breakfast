import {Candidate} from "./Candidate";

export interface SubElection {
    id:number,
    name:string,
    candidates: Candidate[],
}