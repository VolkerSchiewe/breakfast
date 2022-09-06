import { methods, sendRequest } from "../../utils/http";
import { Election } from "../interfaces/Election";
import { SubElection } from "../interfaces/SubElection";
import { Candidate } from "../interfaces/Candidate";
import { CodesResponse } from "../interfaces/CodesResponse";

const ELECTIONS_API = "/api/elections/";
const SUB_ELECTIONS_API = "/api/subelections/";
const CANDIDATES_API = "/api/candidates/";

export class ManagementService {
  async getElections(): Promise<Election[]> {
    return await sendRequest(ELECTIONS_API, methods.GET);
  }

  async getElection(electionId: string): Promise<Election> {
    return await sendRequest(ELECTIONS_API + electionId, methods.GET);
  }

  async setElectionActive(electionId: string): Promise<any> {
    return await sendRequest(
      ELECTIONS_API + electionId + "/set_active/",
      methods.POST
    );
  }

  async closeElection(electionId: string): Promise<any> {
    return await sendRequest(
      ELECTIONS_API + electionId + "/close/",
      methods.POST
    );
  }

  async updateElection(
    electionId: string,
    election: Partial<Election>
  ): Promise<any> {
    return await sendRequest(
      `${ELECTIONS_API}${electionId}/`,
      methods.PATCH,
      election
    );
  }

  async createElection(title: string, number: number): Promise<any> {
    return await sendRequest(ELECTIONS_API + "create_election/", methods.POST, {
      title,
      number,
    });
  }

  async deleteElection(election: Election): Promise<any> {
    return await sendRequest(
      ELECTIONS_API + election.id.toString() + "/",
      methods.DELETE
    );
  }

  async getSubElections(electionId: string): Promise<SubElection[]> {
    return await sendRequest(
      `${SUB_ELECTIONS_API}?election=${electionId}`,
      methods.GET
    );
  }

  async createSubElection(name: string, electionId: string): Promise<any> {
    return await sendRequest(SUB_ELECTIONS_API, methods.POST, {
      election: electionId,
      title: name,
    });
  }

  async updateSubElection(
    subElectionId: number,
    subElection: Partial<SubElection>
  ): Promise<any> {
    return await sendRequest(
      `${SUB_ELECTIONS_API}${subElectionId}/`,
      methods.PATCH,
      subElection
    );
  }

  async deleteSubElection(subelectionId: number): Promise<any> {
    return await sendRequest(
      `${SUB_ELECTIONS_API}${subelectionId}/`,
      methods.DELETE
    );
  }

  async createCandidate(candidate: Candidate): Promise<any> {
    return await sendRequest(CANDIDATES_API, methods.POST, candidate);
  }

  async updateCandidate(
    candidateId: number,
    candidate: Candidate
  ): Promise<any> {
    return await sendRequest(
      `${CANDIDATES_API}${candidateId}/`,
      methods.PATCH,
      candidate
    );
  }

  async deleteCandidate(candidateId: number): Promise<any> {
    return await sendRequest(
      `${CANDIDATES_API}${candidateId}/`,
      methods.DELETE
    );
  }

  async getCodes(electionId: string): Promise<CodesResponse> {
    return await sendRequest(
      `${ELECTIONS_API}${electionId}/codes/`,
      methods.GET
    );
  }
}
