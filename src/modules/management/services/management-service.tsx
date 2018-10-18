import {getToken, sendRequest} from "../../utils/http";
import {Election} from "../interfaces/Election";
import {SubElection} from "../interfaces/SubElection";

const ELECTIONS_API = '/api/elections/';
const SUB_ELECTIONS_API = '/api/subelections/';

export class ElectionService {
    getElections(): Promise<Election[]> {
        return sendRequest(ELECTIONS_API, 'GET', this.authHeader());
    }

    getSubElections(election_id): Promise<SubElection[]> {
        return sendRequest(SUB_ELECTIONS_API, 'GET', this.authHeader())
    }

    private authHeader() {
        return {
            'content-type': 'application/json',
            'authorization': 'Token ' + getToken(),
        };
    }
}