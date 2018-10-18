import {getToken, sendRequest} from "../../utils/http";
import {Election} from "../interfaces/Election";
import {SubElection} from "../interfaces/SubElection";
import {Candidate} from "../interfaces/Candidate";

const ELECTIONS_API = '/api/elections/';
const SUB_ELECTIONS_API = '/api/subelections/';
const CANDIDATES_API = '/api/candidates/';

export class ElectionService {
    getElections(): Promise<Election[]> {
        return sendRequest(ELECTIONS_API, 'GET', this.authHeader());
    }

    getElection(electionId: number): Promise<Election> {
        return sendRequest(ELECTIONS_API + electionId, 'GET', this.authHeader())
    }

    createElection(title: string, number: number): Promise<any> {
        return sendRequest(ELECTIONS_API + 'create_election/', 'POST', this.authHeader(),
            {
                title: title,
                number: number,
            })
    }

    getSubElections(electionId: number): Promise<SubElection[]> {
        return sendRequest(`${SUB_ELECTIONS_API}?election=${electionId}`, 'GET', this.authHeader())
    }

    createSubElection(name: string, electionId: number): Promise<any> {
        return sendRequest(SUB_ELECTIONS_API, 'POST', this.authHeader(), {election: electionId, title: name})
    }

    createCandidate(candidate: Candidate): Promise<any> {
        return sendRequest(CANDIDATES_API, 'POST', this.authHeader(), candidate)
    }

    updateCandidate(candidate: Candidate): Promise<any> {
        return sendRequest(CANDIDATES_API + candidate.id + '/', 'PATCH', this.authHeader(), candidate)
    }

    private authHeader() {
        return {
            'content-type': 'application/json',
            'authorization': 'Token ' + getToken(),
        };
    }
}