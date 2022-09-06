import { methods, sendRequest } from "../../utils/http";
import { SubElection } from "../../management/interfaces/SubElection";

const SUB_ELECTIONS_API = "/api/subelections/";

export class ElectionService {
  async getSubElections(): Promise<SubElection[]> {
    return await sendRequest(SUB_ELECTIONS_API, methods.GET);
  }

  async setVote(selectedCandidates): Promise<any> {
    return await sendRequest(
      SUB_ELECTIONS_API + "vote/",
      methods.POST,
      selectedCandidates,
      null,
      true,
      true
    );
  }
}
