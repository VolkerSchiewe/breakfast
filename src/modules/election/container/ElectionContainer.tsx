import * as React from "react";
import { SubElection } from "../../management/interfaces/SubElection";
import { Election } from "../components/Election";
import { Candidate } from "../../management/interfaces/Candidate";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import { ElectionService } from "../services/election-service";
import Grid from "@mui/material/Grid/Grid";
import { style } from "typestyle";
import { AuthConsumer } from "../../auth/components/AuthContext";
import { AuthInterface } from "../../auth/interfaces/AuthInterface";
import { LoadingSpinner } from "../../misc/components/LoadingSpinner";
import { Navigate } from "react-router";

interface ElectionContainerState {
  isLoading: boolean;
  subElections: SubElection[];
  selectedCandidates: {};
  snackbarMessage: string | null;
}

const styles = {
  spinner: style({
    marginTop: 100,
  }),
};

export class ElectionContainer extends React.Component<
  {},
  ElectionContainerState
> {
  electionService = new ElectionService();

  onCandidateSelected = (
    subElection: SubElection,
    candidate: Candidate
  ): void => {
    const { selectedCandidates } = this.state;
    const selected = selectedCandidates;
    selected[subElection.id] = candidate.id;
    this.setState({
      selectedCandidates: selected,
    });
  };

  onSubmit = (logout: () => void): void => {
    const { selectedCandidates, subElections } = this.state;
    if (Object.keys(selectedCandidates).length !== subElections.length) {
      this.setState({
        snackbarMessage: "Du musst überall einen Kandidaten wählen!",
      });
    } else {
      this.setState({ isLoading: true });
      this.electionService
        .setVote(selectedCandidates)
        .then(() => {
          this.setState({
            snackbarMessage: "Deine Stimme wurde gespeichert",
          });
          setTimeout(() => logout(), 1500);
        })
        .catch((e) => {
          this.setState({
            snackbarMessage: e.response.data,
          });
          setTimeout(() => logout(), 1500);
          console.error(e);
        });
    }
  };

  fetchData = (): void => {
    this.electionService
      .getSubElections()
      .then((res) => {
        if (res.length === 0) {
          this.setState({
            snackbarMessage: "Warte noch es geht noch nicht los!",
          });
        }
        this.setState({
          isLoading: false,
          subElections: res,
        });
      })
      .catch((e) => {
        this.setState({
          snackbarMessage:
            "Etwas ist schief gelaufen. Melde dich bei der Wahlleitung.",
        });
        console.error(e);
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      subElections: [],
      selectedCandidates: {},
      snackbarMessage: null,
    };
  }

  componentDidMount(): void {
    this.fetchData();
  }

  render(): React.ReactElement {
    const { subElections, selectedCandidates, isLoading, snackbarMessage } =
      this.state;
    return (
      <div>
        {isLoading ? (
          <Grid container justifyContent={"center"} className={styles.spinner}>
            <LoadingSpinner isLoading={isLoading} />
          </Grid>
        ) : (
          <AuthConsumer>
            {({ logout, user }: AuthInterface) => (
              <React.Fragment>
                {user?.isAdmin === true && <Navigate to={"/elections/"} />}
                <Election
                  subElections={subElections}
                  selectedCandidates={selectedCandidates}
                  onCandidateClick={this.onCandidateSelected}
                  onSubmit={() => this.onSubmit(logout)}
                  onReload={this.fetchData}
                />
              </React.Fragment>
            )}
          </AuthConsumer>
        )}
        <Snackbar
          open={Boolean(snackbarMessage)}
          message={<span>{snackbarMessage}</span>}
          autoHideDuration={5000}
          onClose={() => this.setState({ snackbarMessage: null })}
        />
      </div>
    );
  }
}
