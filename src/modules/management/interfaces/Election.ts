import {ElectionState} from "./ElectionState";
import {SubElection} from "./SubElection";

export interface Election {
    id: number
    title: string
    candidateNames?: Partial<SubElection>[]
    codes?: string[]
    voteCount?: number
    state: ElectionState
}
