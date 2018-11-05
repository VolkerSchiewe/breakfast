import {Image} from "./Image";

export interface Candidate {
    id?: number
    name: string
    image?: Image
    votes?: number
    subElection?: number
}
