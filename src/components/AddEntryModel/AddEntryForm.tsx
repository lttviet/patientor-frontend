import { Field, Form, Formik, FormikErrors } from "formik";
import { DiagnosisSelection, Option, SelectField, TextField } from "../FormField";
import { useStateValue } from "../../state";
import { EntryType, HealthCheckRating, Diagnosis, Discharge, sickLeave, NewEntry } from "../../types";
import { Button, Grid } from "@material-ui/core";

type EntryFormValues = {
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
  type: EntryType;
  healthCheckRating: HealthCheckRating;
  discharge: Discharge;
  employerName: string;
  sickLeave?: sickLeave;
};

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

const healthCheckRatingOptions: Option[] = [
  { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" },
  { value: HealthCheckRating.HighRisk, label: "High Risk" },
  { value: HealthCheckRating.LowRisk, label: "Low Risk" },
  { value: HealthCheckRating.Healthy, label: "Healthy" },
];

const entryType: Option[] = [
  { value: EntryType.HealthCheck, label: 'Health Check' },
  { value: EntryType.OccupationalHealthcare, label: 'Occupational Healthcare' },
  { value: EntryType.Hospital, label: 'Hospital' },
];

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  const toNewEntry = (values: EntryFormValues): NewEntry => {
    switch (values.type) {
      case EntryType.HealthCheck:
        return {
          type: values.type,
          description: values.description,
          date: values.date,
          specialist: values.specialist,
          diagnosisCodes: values.diagnosisCodes,
          healthCheckRating: values.healthCheckRating,
        };
      case EntryType.Hospital:
        return {
          type: values.type,
          description: values.description,
          date: values.date,
          specialist: values.specialist,
          diagnosisCodes: values.diagnosisCodes,
          discharge: values.discharge,
        };
      case EntryType.OccupationalHealthcare:
        let sickLeave: sickLeave | undefined;

        if (!values.sickLeave || !values.sickLeave.startDate && !values.sickLeave.endDate) {
          sickLeave = undefined;
        }

        return {
          type: values.type,
          description: values.description,
          date: values.date,
          specialist: values.specialist,
          diagnosisCodes: values.diagnosisCodes,
          employerName: values.employerName,
          sickLeave: sickLeave,
        };
    }
  };

  return (
    <Formik
      initialValues={{
        type: EntryType.HealthCheck,
        description: '',
        date: '',
        specialist: '',
        diagnosisCodes: [],
        healthCheckRating: HealthCheckRating.Healthy,
        discharge: {
          date: '',
          criteria: '',
        },
        sickLeave: {
          startDate: '',
          endDate: '',
        },
        employerName: '',
      }}
      onSubmit={(values) => onSubmit(toNewEntry(values))}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: FormikErrors<EntryFormValues> = {};

        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }

        if (values.type === EntryType.Hospital) {
          if (!values.discharge.criteria) {
            errors.discharge = {
              ...errors.discharge,
              criteria: requiredError,
            };
          }

          if (!values.discharge.date) {
            errors.discharge = {
              ...errors.discharge,
              date: requiredError,
            };
          }
        }

        if (values.type === EntryType.OccupationalHealthcare) {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
        }

        return errors;
      }}
    >
      {({ setFieldValue, setFieldTouched, isValid, dirty, values }) => {
        return (
          <Form className="form ui">
            <SelectField
              label="Type"
              name="type"
              options={entryType} />

            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />

            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />

            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />

            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />

            {values.type === EntryType.HealthCheck &&
              <SelectField
                label="Health Check Rating"
                name="healthCheckRating"
                options={healthCheckRatingOptions} />
            }

            {values.type === EntryType.Hospital && (
              <>
                <Field
                  label="Discharge Date"
                  placeholder="YYYY-MM-DD"
                  name="discharge.date"
                  component={TextField}
                />

                <Field
                  label="Discharge Criteria"
                  placeholder=""
                  name="discharge.criteria"
                  component={TextField}
                />
              </>
            )}

            {values.type === EntryType.OccupationalHealthcare && (
              <>
                <Field
                  label="Employer Name"
                  placeholder=""
                  name="employerName"
                  component={TextField}
                />

                <Field
                  label="Sick leave start date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.startDate"
                  component={TextField}
                />

                <Field
                  label="Sick leave end date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.endDate"
                  component={TextField}
                />
              </>
            )}

            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>

          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
