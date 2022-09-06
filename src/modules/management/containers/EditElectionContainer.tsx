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

const emptyCandidate: Partial<Candidate> = { name: "" };

export const EditElectionContainer: FC = () => {
  const electionService = new ManagementService();

  const [election, setElection] = useState<Election | null>(null);
  const [subElections, setSubElection] = useState<SubElection[]>([]);
  const [modalCandidate, setModalCandidate] =
    useState<Partial<Candidate> | null>(null);
  const [modalSubElection, setModalSubElection] =
    useState<Partial<SubElection> | null>(null);
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

  const handleDeleteCandidate = (candidate: Candidate): void => {
    void electionService.deleteCandidate(candidate.id).then(() => {
      fetchData();
      setCandidateModalOpen(false);
    });
  };

  const saveCandidate = (candidate: Candidate): void => {
    setCandidateModalOpen(false);
    setSnackbarOpen(false);

    if (candidate.id !== undefined) {
      void electionService.updateCandidate(candidate.id, candidate).then(() => {
        fetchData();
        setSnackbarOpen(false);
      });
    } else {
      void electionService.createCandidate(candidate).then(() => {
        setSnackbarOpen(false);
        fetchData();
      });
    }
  };

  const openCandidateModal = (
    subElectionId: number,
    candidate?: Candidate
  ): void => {
    if (candidate !== undefined) candidate.subElection = subElectionId;
    else emptyCandidate.subElection = subElectionId;
    const candidateModal = candidate ?? emptyCandidate;
    setCandidateModalOpen(true);
    setModalCandidate(candidateModal);
  };

  const handleCandidateModalClose = (): void => {
    setCandidateModalOpen(false);
  };
  const openDeleteElectionModal = (): void => {
    setDeleteDialogOpen(true);
  };
  const handleDeleteElection = (): void => {
    setDeleteDialogOpen(false);
    void electionService
      .deleteElection(election as Election)
      .then(() => navigate("/elections"));
  };

  const handleDialogClose = (): void => {
    setDeleteDialogOpen(false);
    setEditElectionOpen(false);
    setEditElectionOpen(false);
  };

  const createSubElection = (name: string): void => {
    void electionService
      .createSubElection(name, electionId as string)
      .then(fetchData);
  };

  const editSubElection = (subElection: SubElection): void => {
    setEditSubElectionOpen(true);
    setModalSubElection(subElection);
  };

  const editElection = (): void => {
    setEditElectionOpen(true);
    setElectionTitle((election as Election).title);
  };

  const changeSubElectionModal = (value: string): void => {
    setModalSubElection({ ...modalSubElection, title: value });
  };

  const changeElectionModal = (value: string): void => {
    setElectionTitle(value);
  };

  const saveSubElection = (): void => {
    void electionService
      .updateSubElection(
        modalSubElection?.id as number,
        modalSubElection as SubElection
      )
      .then(() => {
        fetchData();
        setEditSubElectionOpen(false);
      });
  };

  const saveElection = (): void => {
    void electionService
      .updateElection(electionId as string, {
        id: parseInt(electionId as string),
        title: electionTitle,
      })
      .then(() => {
        fetchData();
        setEditElectionOpen(false);
      });
  };

  const deleteSubElection = (): void => {
    void electionService
      .deleteSubElection(modalSubElection?.id as number)
      .then(() => {
        fetchData()
        setEditSubElectionOpen(false);
      });
  };

  const handleMenuItemSelected = (item: number): void => {
    switch (item) {
      case 0: {
        setSubElection([]);
        fetchData();
        return;
      }
      case 1: {
        void electionService
          .closeElection((election as Election).id.toString())
          .then(() => fetchData());
      }
    }
  };

  const showResultModal = (subElection: SubElection): void => {
    setModalSubElection(subElection);
    setResultModalOpen(true);
  };

  const fetchData = (): void => {
    void electionService.getElection(electionId as string).then((res) => {
      setElection(res);
    });
    void electionService
      .getSubElections(electionId as string)
      .then((res) => setSubElection(res));
  };

  useEffect(() => {
    fetchData();
  }, [electionId]);

  return (
    <div>
      {election != null && (
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
          isNew={modalCandidate === emptyCandidate}
          candidate={modalCandidate as Partial<Candidate>}
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
              value={modalSubElection?.title}
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
          subElection={modalSubElection as SubElection}
          handleClose={() => setResultModalOpen(false)}
        />
      )}
    </div>
  );
};
