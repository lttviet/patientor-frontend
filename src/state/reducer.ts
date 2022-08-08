import { State } from "./state";
import { Diagnosis, Entry, Patient } from "../types";
import { assertNever } from "../utils";

export type Action =
  | {
    type: "SET_PATIENT_LIST";
    payload: Patient[];
  }
  | {
    type: "ADD_PATIENT";
    payload: Patient;
  }
  | {
    type: 'UPDATE_PATIENT';
    payload: Patient;
  }
  | {
    type: 'SET_DIAGNOSES_LIST';
    payload: Diagnosis[];
  };

export const setPatientList = (patientListFromApi: Patient[]): Action => ({
  type: 'SET_PATIENT_LIST',
  payload: patientListFromApi,
});

export const addPatient = (newPatient: Patient): Action => ({
  type: 'ADD_PATIENT',
  payload: newPatient,
});

export const updatePatient = (patient: Patient): Action => ({
  type: 'UPDATE_PATIENT',
  payload: patient,
});

export const setDiagnosesList = (diagnosesListFromApi: Diagnosis[]): Action => ({
  type: 'SET_DIAGNOSES_LIST',
  payload: diagnosesListFromApi,
});

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
        }
      };
    case "ADD_PATIENT":
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case 'SET_DIAGNOSES_LIST':
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
        }
      };
    default:
      assertNever(action);
      return state;
  }
};
