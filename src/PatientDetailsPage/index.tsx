import { useState } from "react";
import { Button, Typography } from "@material-ui/core";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { updatePatient, useStateValue } from "../state";
import { NewEntry, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import EntryDetails from "../components/EntryDetails";
import AddEntryModal from "../components/AddEntryModel";

const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  const [patient, setPatient] = useState<Patient>();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: NewEntry) => {
    if (!id) {
      return;
    }

    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(updatePatient(updatedPatient));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  useEffect(() => {
    const fetchPatient = async (id: string) => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );

        dispatch(updatePatient(patient));
      } catch (e) {
        console.error(e);
      }
    };

    if (id) {
      const foundPatient = patients[id];
      if (!foundPatient || !foundPatient.ssn) {
        void fetchPatient(id);
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      setPatient(patients[id]);
    }
  }, [id, patients]);

  if (!id || !patient) {
    return (
      <Typography variant='h6'>
        Bad id
      </Typography>
    );
  }

  return (
    <>
      <Typography variant='h4'>
        {patient.name} {patient.gender}
      </Typography>
      <Typography variant='body1'>
        ssn: {patient.ssn}
      </Typography>
      <Typography variant='body1'>
        occupation: {patient.occupation}
      </Typography>
      <Typography variant='h6'>
        entries
      </Typography>

      <div>
        {patient.entries?.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))}
      </div>

      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </>
  );
};

export default PatientDetailsPage;
