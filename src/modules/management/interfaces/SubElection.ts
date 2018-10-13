import {Election} from "./Election";
import {Candidate} from "./Candidate";

export interface SubElection {
    name:string,
    candidates: Candidate[],
}