import { State } from "./state";
import { Patient } from "../types";

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
          ...state.patients
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
    default:
      return state;
  }
};
