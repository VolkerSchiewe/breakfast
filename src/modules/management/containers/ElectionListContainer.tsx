import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Grid from "@mui/material/Grid/Grid";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import * as React from "react";
import { FC, useEffect, useMemo, useState } from "react";
import {
    useNavigate, useLocation
} from "react-router";
import { CreateElectionModal } from "../components/CreateElectionModal";
import { ElectionList } from "../components/ElectionList";
import { Election } from "../interfaces/Election";
import { ElectionState } from "../interfaces/ElectionState";
import { ManagementService } from "../services/management-service";

export const ElectionListContainer: FC = () => {
  const electionService = new ManagementService();
  const navigate = useNavigate();
  const { search } = useLocation();
  const showClosedElections = useMemo<boolean>(
    () => new URLSearchParams(search).get("closed") === "true",
    [search]
  );

  const [elections, setElections] = useState<Election[]>([]);
  const [electionModalOpen, setElectionModalOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleActiveChange = (id) => {
    electionService.setElectionActive(id).then(fetchData);
  };
  const openNewElection = () => {
    setElectionModalOpen(true);
  };
  const handleRowClick = (id) => {
    navigate(`/elections/${id}`);
  };
  const fetchData = () => {
    electionService.getElections().then(setElections);
  };
  const handleCodesClick = (election) => {
    window.open(`/elections/${election.id}/codes/`, "_blank");
  };
  const createElection = (title, number) => {
    electionService.createElection(title, number).then(() => {
      fetchData();
      setSnackbarOpen(false);
    });
    setElectionModalOpen(false);
    setSnackbarOpen(true);
  };
  const handleRefresh = () => {
    setElections([]);
    fetchData();
  };
  const handleShowClosedChange = () => {
    navigate("/elections/?closed=" + !showClosedElections);
  };
  useEffect(() => {
    fetchData();
  }, []);

  let activeElectionId = undefined;
  const activeElection = elections.filter(
    (election) => election.state == ElectionState.ACTIVE
  );
  if (activeElection.length != 0) activeElectionId = activeElection[0].id;
  const filteredElections = showClosedElections
    ? elections
    : elections.filter((e) => e.state != ElectionState.CLOSED);
  return (
    <div>
      <ElectionList
        elections={filteredElections}
        activeElectionId={activeElectionId}
        showClosed={showClosedElections}
        handleActiveChange={handleActiveChange}
        handleRowClick={handleRowClick}
        handleCodesClick={handleCodesClick}
        handleNewElection={openNewElection}
        handleShowClosedChange={handleShowClosedChange}
        handleRefresh={handleRefresh}
      />
      <Snackbar
        open={snackbarOpen}
        message={
          <Grid container alignItems={"center"}>
            <CircularProgress size={15} />
            <span style={{ marginLeft: 10 }}>Wird gespeichert ...</span>
          </Grid>
        }
      />
      {electionModalOpen && (
        <CreateElectionModal
          isOpen={electionModalOpen}
          handleClose={() => {
            setElectionModalOpen(false);
          }}
          saveElection={createElection}
        />
      )}
    </div>
  );
};
