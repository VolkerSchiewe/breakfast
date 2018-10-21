import {getToken, sendRequest} from "../../utils/http";
import {Election} from "../interfaces/Election";
import {SubElection} from "../interfaces/SubElection";
import {Candidate} from "../interfaces/Candidate";

const ELECTIONS_API = '/api/elections/';
const SUB_ELECTIONS_API = '/api/subelections/';
const CANDIDATES_API = '/api/candidates/';

export class ElectionService {
    getElections(): Promise<Election[]> {
        return sendRequest(ELECTIONS_API, 'GET');
    }

    getElection(electionId: number): Promise<Election> {
        return sendRequest(ELECTIONS_API + electionId, 'GET')
    }

    updateElection(electionId: number): Promise<any> {
        return sendRequest(ELECTIONS_API + electionId + '/set_active/', 'POST')
    }

    createElection(title: string, number: number): Promise<any> {
        console.log(title, number);
        return sendRequest(ELECTIONS_API + 'create_election/', 'POST',
            {
                title: title,
                number: number,
            })
    }

    getSubElections(electionId: number): Promise<SubElection[]> {
        return sendRequest(`${SUB_ELECTIONS_API}?election=${electionId}`, 'GET')
    }

    createSubElection(name: string, electionId: number): Promise<any> {
        return sendRequest(SUB_ELECTIONS_API, 'POST', {
                election: electionId,
                title: name
            }
        )
    }

    createCandidate(candidate: Candidate): Promise<any> {
        return sendRequest(CANDIDATES_API, 'POST', candidate)
    }

    updateCandidate(candidate: Candidate): Promise<any> {
        return sendRequest(CANDIDATES_API + candidate.id + '/', 'PATCH', candidate)
    }
}