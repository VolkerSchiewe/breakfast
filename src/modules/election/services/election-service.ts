import {methods, sendRequest} from "../../utils/http";
import {SubElection} from "../../management/interfaces/SubElection";

const SUB_ELECTIONS_API = '/api/subelections/';

export class ElectionService {
    getSubElections(): Promise<SubElection[]> {
        return sendRequest(SUB_ELECTIONS_API, methods.GET)
    }

    setVote(selectedCandidates): Promise<any> {
        return sendRequest(SUB_ELECTIONS_API + 'vote/', methods.POST, selectedCandidates, null, true, true)
    }
}