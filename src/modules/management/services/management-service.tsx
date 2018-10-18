import {getToken, sendRequest} from "../../utils/http";
import {Election} from "../interfaces/Election";
import {SubElection} from "../interfaces/SubElection";

const ELECTIONS_API = '/api/elections/';
const SUB_ELECTIONS_API = '/api/subelections/';

export class ElectionService {
    getElections(): Promise<Election[]> {
        return sendRequest(ELECTIONS_API, 'GET', this.authHeader());
    }

    getElection(electionId): Promise<Election> {
        return sendRequest(ELECTIONS_API + electionId, 'GET', this.authHeader())
    }

    createElection(title: string, number: number): Promise<any> {
        return sendRequest(ELECTIONS_API + 'create_election/', 'POST', this.authHeader(),
            {
                title: title,
                number: number,
            })
    }

    getSubElections(electionId): Promise<SubElection[]> {
        return sendRequest(`${SUB_ELECTIONS_API}?election=${electionId}`, 'GET', this.authHeader())
    }

    private authHeader() {
        return {
            'content-type': 'application/json',
            'authorization': 'Token ' + getToken(),
        };
    }
}