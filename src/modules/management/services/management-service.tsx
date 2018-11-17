import {methods, sendRequest} from "../../utils/http";
import {Election} from "../interfaces/Election";
import {SubElection} from "../interfaces/SubElection";
import {Candidate} from "../interfaces/Candidate";
import {CodesResponse} from "../interfaces/CodesResponse";

const ELECTIONS_API = '/api/elections/';
const SUB_ELECTIONS_API = '/api/subelections/';
const CANDIDATES_API = '/api/candidates/';

export class ManagementService {
    getElections(): Promise<Election[]> {
        return sendRequest(ELECTIONS_API, methods.GET);
    }

    getElection(electionId: number): Promise<Election> {
        return sendRequest(ELECTIONS_API + electionId, methods.GET)
    }

    setElectionActive(electionId: number): Promise<any> {
        return sendRequest(ELECTIONS_API + electionId + '/set_active/', methods.POST)
    }

    updateElection(election: Partial<Election>): Promise<any> {
        return sendRequest(ELECTIONS_API + election.id + '/', methods.PATCH, election)
    }

    createElection(title: string, number: number): Promise<any> {
        return sendRequest(ELECTIONS_API + 'create_election/', methods.POST,
            {
                title: title,
                number: number,
            })
    }

    deleteElection(election: Election): Promise<any> {
        return sendRequest(ELECTIONS_API + election.id + '/', methods.DELETE)
    }

    getSubElections(electionId: number): Promise<SubElection[]> {
        return sendRequest(`${SUB_ELECTIONS_API}?election=${electionId}`, methods.GET)
    }

    createSubElection(name: string, electionId: number): Promise<any> {
        return sendRequest(SUB_ELECTIONS_API, methods.POST, {
                election: electionId,
                title: name
            }
        )
    }

    updateSubElection(subelection: SubElection) {
        return sendRequest(SUB_ELECTIONS_API + subelection.id + '/', methods.PATCH, subelection)
    }

    deleteSubElection(subelectionId: number) {
        return sendRequest(SUB_ELECTIONS_API + subelectionId + '/', methods.DELETE)
    }

    createCandidate(candidate: Candidate): Promise<any> {
        return sendRequest(CANDIDATES_API, methods.POST, candidate)
    }

    updateCandidate(candidate: Candidate): Promise<any> {
        return sendRequest(CANDIDATES_API + candidate.id + '/', methods.PATCH, candidate)
    }

    deleteCandidate(candidate: Candidate): Promise<any> {
        return sendRequest(CANDIDATES_API + candidate.id + '/', methods.DELETE)
    }

    getCodes(electionId: number): Promise<CodesResponse> {
        return sendRequest(ELECTIONS_API + electionId + '/codes/', methods.GET)
    }
}