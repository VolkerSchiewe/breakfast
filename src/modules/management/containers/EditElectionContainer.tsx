import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Grid from "@mui/material/Grid/Grid";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import TextField from "@mui/material/TextField/TextField";
import * as React from "react";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertDialog } from "../../layout/components/AlertDialog";
import { CandidateModal } from "../components/CandidateModal";
import { EditElection } from "../components/EditElection";
import ResultModal from "../components/ResultModal";
import { Candidate } from "../interfaces/Candidate";
import { Election } from "../interfaces/Election";
import { SubElection } from "../interfaces/SubElection";
import { ManagementService } from "../services/management-service";

interface EditElectionState {
  election?: Election;
  subElections: SubElection[];
  modalCandidate?: Candidate;
  modalSubElection?: SubElection;

  electionTitle: string;
  candidateModalOpen: boolean;
  deleteDialogOpen: boolean;
  editSubElectionOpen: boolean;
  editElectionOpen: boolean;
  snackbarOpen: boolean;
  resultModalOpen: boolean;
}

const emptyCandidate: Candidate = { name: "" };

export const EditElectionContainer: FC = () => {
  const electionService = new ManagementService();

  const [election, setElection] = useState<Election>(null);
  const [subElections, setSubElection] = useState<SubElection[]>([]);
  const [modalCandidate, setModalCandidate] = useState<Candidate>(null);
  const [modalSubElection, setModalSubElection] = useState<SubElection>(null);
  const [electionTitle, setElectionTitle] = useState<string>("");
  const [candidateModalOpen, setCandidateModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [editSubElectionOpen, setEditSubElectionOpen] =
    useState<boolean>(false);
  const [editElectionOpen, setEditElectionOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const { electionId } = useParams<{ electionId: string }>();

  const handleDeleteCandidate = (candidate: Candidate) => {
    electionService
      .deleteCandidate(candidate)
      .then(() => setCandidateModalOpen(false));
  };

  const saveCandidate = (candidate: Candidate) => {
    setCandidateModalOpen(false);
    setSnackbarOpen(false);

    if (candidate.id !== undefined) {
      electionService.updateCandidate(candidate).then(() => {
        fetchData();
        setSnackbarOpen(false);
      });
    } else {
      electionService.createCandidate(candidate).then(() => {
        setSnackbarOpen(false);
        fetchData();
      });
    }
  };

  const openCandidateModal = (subElectionId: number, candidate?: Candidate) => {
    if (candidate !== undefined) candidate.subElection = subElectionId;
    else emptyCandidate.subElection = subElectionId;
    const candidateModal = candidate ? candidate : emptyCandidate;
    setCandidateModalOpen(true);
    setModalCandidate(candidateModal);
  };

  const handleCandidateModalClose = () => {
    setCandidateModalOpen(false);
  };
  const openDeleteElectionModal = () => {
    setDeleteDialogOpen(true);
  };
  const handleDeleteElection = () => {
    setDeleteDialogOpen(false);
    electionService
      .deleteElection(election)
      .then(() => navigate("/elections"));
  };

  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
    setEditElectionOpen(false);
    setEditElectionOpen(false);
  };

  const createSubElection = (name: string) => {
    electionService.createSubElection(name, electionId).then(fetchData);
  };

  const editSubElection = (subElection: SubElection) => {
    setEditSubElectionOpen(true);
    setModalSubElection(subElection);
  };

  const editElection = () => {
    setEditElectionOpen(true);
    setElectionTitle(election.title);
  };

  const changeSubElectionModal = (value: string) => {
    setModalSubElection({ ...modalSubElection, title: value });
  };

  const changeElectionModal = (value: string) => {
    setElectionTitle(value);
  };

  const saveSubElection = () => {
    electionService
      .updateSubElection(modalSubElection)
      .then(() => {
        fetchData()
        setEditSubElectionOpen(false);
      });
  };

  const saveElection = () => {
    electionService
      .updateElection({
        id: election.id,
        title: electionTitle,
      })
      .then(() => {
        fetchData();
        setEditElectionOpen(false);
      });
  };

  const deleteSubElection = () => {
    electionService
      .deleteSubElection(modalSubElection.id)
      .then(() => setEditSubElectionOpen(false));
  };

  const handleMenuItemSelected = (item: number) => {
    switch (item) {
      case 0: {
        setSubElection([])
        fetchData()
        return;
      }
      case 1: {
        electionService.closeElection(election.id).then(() => fetchData());
        return;
      }
    }
  };

  const showResultModal = (subElection: SubElection) => {
    setModalSubElection(subElection);
    setResultModalOpen(true);
  };

  const fetchData = () => {
    electionService.getElection(electionId).then((res) => {
      setElection(res);
    });
    electionService
      .getSubElections(electionId)
      .then((res) => setSubElection(res));
  };

  useEffect(() => {
    fetchData();
  }, [electionId]);

  return (
    <div>
      {election && (
        <EditElection
          election={election}
          subElections={subElections}
          openCandidateModal={openCandidateModal}
          saveSubElection={createSubElection}
          editSubElection={editSubElection}
          handleMenuItemSelected={handleMenuItemSelected}
          handleResultClick={showResultModal}
          editElection={editElection}
        />
      )}
      <Snackbar
        open={snackbarOpen}
        message={
          <Grid container alignItems={"center"}>
            <CircularProgress size={15} />
            <span style={{ marginLeft: 10 }}>Wird gespeichert ...</span>
          </Grid>
        }
      />
      {candidateModalOpen && (
        <CandidateModal
          isOpen={candidateModalOpen}
          isNew={modalCandidate == emptyCandidate}
          candidate={modalCandidate}
          handleClose={handleCandidateModalClose}
          saveCandidate={saveCandidate}
          handleDelete={handleDeleteCandidate}
        />
      )}
      {deleteDialogOpen && (
        <AlertDialog
          isOpen={deleteDialogOpen}
          title={"Wahlgang löschen?"}
          handleClose={handleDialogClose}
          handleOk={handleDeleteElection}
        />
      )}
      {editSubElectionOpen && (
        <AlertDialog
          isOpen={editSubElectionOpen}
          title={"Wahl ändern"}
          body={
            <TextField
              variant={"outlined"}
              label={"Name"}
              margin={"normal"}
              value={modalSubElection.title}
              required
              onChange={(e) => changeSubElectionModal(e.target.value)}
            />
          }
          handleClose={handleDialogClose}
          handleOk={saveSubElection}
          handleDelete={deleteSubElection}
        />
      )}
      {editElectionOpen && (
        <AlertDialog
          isOpen={editElectionOpen}
          title={"Wahlgang bearbeiten"}
          body={
            <div>
              <TextField
                variant={"outlined"}
                label={"Name"}
                margin={"normal"}
                value={electionTitle}
                required
                onChange={(e) => changeElectionModal(e.target.value)}
              />
            </div>
          }
          handleClose={handleDialogClose}
          handleOk={saveElection}
          handleDelete={openDeleteElectionModal}
        />
      )}
      {resultModalOpen && (
        <ResultModal
          subElection={modalSubElection}
          handleClose={() => setResultModalOpen(false)}
        />
      )}
    </div>
  );
};
