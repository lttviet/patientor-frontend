import { Box, Typography } from "@material-ui/core";
import { DirectionsRun, LocalHospital, Work } from "@material-ui/icons";
import { Entry, HospitalEntry, HealthCheckEntry, OccupationalHealthcareEntry, EntryType } from "../types";
import { assertNever } from "../utils";

type EntryDetailsProps = {
  entry: Entry
};

const EntryDetails = ({ entry }: EntryDetailsProps) => {
  console.log(entry);

  switch (entry.type) {
    case EntryType.Hospital:
      return <HospitalDetails entry={entry} />;
    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcareDetails entry={entry} />;
    case EntryType.HealthCheck:
      return <HealthCheckDetails entry={entry} />;
    default:
      assertNever(entry);
      return null;
  }
};

const HospitalDetails = ({ entry }: { entry: HospitalEntry }) => (
  <Box sx={{ border: 'solid black', marginBottom: '10px', padding: '5px' }}>
    <Typography variant='body1'>
      {entry.date} <LocalHospital />
      <br />
      {entry.description}
      <br />
      discharged on {entry.discharge.date} due to {entry.discharge.criteria}
      <br />
      diagnose by {entry.specialist}
    </Typography>
  </Box >
);

const HealthCheckDetails = ({ entry }: { entry: HealthCheckEntry }) => (
  <Box sx={{ border: 'solid black', marginBottom: '10px', padding: '5px' }}>
    <Typography variant='body1'>
      {entry.date} <DirectionsRun />
      <br />
      {entry.description}
      <br />
      rating: {entry.healthCheckRating}
      <br />
      diagnose by {entry.specialist}
    </Typography>
  </Box >
);

const OccupationalHealthcareDetails = ({ entry }: { entry: OccupationalHealthcareEntry }) => (
  <Box sx={{ border: 'solid black', marginBottom: '10px', padding: '5px' }}>
    <Typography variant='body1'>
      {entry.date} <Work /> {entry.employerName}
      <br />
      {entry.description}
      <br />
      {entry.sickLeave ? (
        <>sick leave starts on {entry.sickLeave.startDate} and ends on {entry.sickLeave.endDate}</>
      ) : (
        <>no sick leave</>
      )}
      <br />
      diagnose by {entry.specialist}
    </Typography>
  </Box >
);

export default EntryDetails;
