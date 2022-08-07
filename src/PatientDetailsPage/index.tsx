import { Typography } from "@material-ui/core";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { updatePatient, useStateValue } from "../state";
import { Patient } from "../types";
import { apiBaseUrl } from "../constants";

const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();

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

  if (!id || !patients[id]) {
    return (
      <Typography variant='h6'>
        Bad id
      </Typography>
    );
  }

  return (
    <>
      <Typography variant='h4'>
        {patients[id].name} {patients[id].gender}
      </Typography>
      <Typography variant='body1'>
        ssn: {patients[id].ssn}
      </Typography>
      <Typography variant='body1'>
        occupation: {patients[id].occupation}
      </Typography>
    </>
  );
};

export default PatientDetailsPage;
