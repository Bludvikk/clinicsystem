import { getCivilStatus, getCivilStatuses } from "@/server/hooks/civilStatus";
import { getGender, getGenders } from "@/server/hooks/gender";
import { getOccupation, getOccupations } from "@/server/hooks/occupation";
import {
  deletePatient,
  getPatient,
  getPatients,
  postPatient,
  putPatient,
} from "@/server/hooks/patient";
import PatientForm from "@/views/pages/patient/PatientForm";

const Test = () => {
  const {
    mutateAsync: postPatientMutateAsync,
    isLoading: postPatientIsLoading,
  } = postPatient();
  const { mutateAsync: putPatientMutateAsync, isLoading: putPatientIsLoading } =
    putPatient();
  const {
    mutateAsync: deletePatientMutateAsync,
    isLoading: deletePatientIsLoading,
  } = deletePatient();

  const { data: patientsData, isLoading: patientsDataIsLoading } =
    getPatients();
  const { data: patientData, isLoading: patientDataIsLoading } = getPatient({
    id: "c45e009a-8c59-4006-ba05-88d393fbca50",
  });

  const { data: gendersData, isLoading: gendersDataIsLoading } = getGenders();
  const { data: genderData, isLoading: genderDataIsLoading } = getGender({
    id: 2,
  });

  const { data: civilStatusesData, isLoading: civilStatusesDataIsLoading } =
    getCivilStatuses();
  const { data: civilStatusData, isLoading: civilStatusDataIsLoading } =
    getCivilStatus({ id: 2 });

  const { data: occupationsData, isLoading: occupationsDataIsLoading } =
    getOccupations();
  const { data: occupationData, isLoading: occupationDataIsLoading } =
    getOccupation({ id: 1 });

  const add = async () => {
    const result = await postPatientMutateAsync({
      firstName: "Justine",
      lastName: "Barber",
      middleInitial: "S",
      address: "Km 11 Sasa, Bayview",
      dateOfBirth: new Date("01-24-2001"),
      civilStatusId: 5,
      age: 10,
      occupationId: 2,
      genderId: 1,
      contactNumber: "09123456789",
      familyHistory: {
        bronchialAsthma: true,
        pulmonaryTuberculosis: true,
        diabetesMellitus: true,
        hearthDisease: true,
        cancer: true,
        others: "lorem ipsum dolor",
      },
      personalHistory: {
        smoking: 10,
        alcohol: 15,
        currentHealthCondition: "Healthy",
        medications: [
          {
            brandName: "Paracetamol",
            dosage: "100 ml",
            generic: "generic",
          },
          {
            brandName: "Biogesic",
            dosage: "15 ml",
            generic: "generic",
          },
        ],
      },
      pastMedicalHistory: {
        hospitalized: "lorem ipsum dolor sit amet",
        injuries: "lorem ipsum dolor sit amet",
        surgeries: "lorem ipsum dolor sit amet",
        allergies: "lorem ipsum dolor sit amet",
        measles: "lorem ipsum dolor sit amet",
        chickenPox: "lorem ipsum dolor sit amet",
        others: "lorem ipsum dolor sit amet",
      },
      obGyne: {
        menstrualCycle: new Date("01-24-1999"),
        days: 15,
      },
    });

    console.log(result);
  };

  const update = async () => {
    const result = await putPatientMutateAsync({
      id: "db92fdfd-52e4-478b-b4cb-9298501d4756",
      firstName: "Glenn updated",
      lastName: "Opaw updated",
      middleInitial: "S",
      address: "Km 11 Sasa, Bayview",
      dateOfBirth: new Date("01-24-2001"),
      civilStatusId: 4,
      age: 10,
      occupationId: 2,
      genderId: 2,
      contactNumber: "09123456789",
      familyHistory: {
        bronchialAsthma: false,
        pulmonaryTuberculosis: false,
        diabetesMellitus: false,
        hearthDisease: false,
        cancer: false,
        others: "lorem ipsum dolor",
      },
      personalHistory: {
        smoking: 10,
        alcohol: 15,
        currentHealthCondition: "Healthy",
        medications: [
          {
            brandName: "Paracetamol",
            dosage: "100 ml",
            generic: "generic",
          },
          {
            brandName: "Biogesic",
            dosage: "15 ml",
            generic: "generic",
          },
        ],
      },
      pastMedicalHistory: {
        hospitalized: "lorem ipsum dolor sit amet",
        injuries: "lorem ipsum dolor sit amet",
        surgeries: "lorem ipsum dolor sit amet",
        allergies: "lorem ipsum dolor sit amet",
        measles: "lorem ipsum dolor sit amet",
        chickenPox: "lorem ipsum dolor sit amet",
        others: "lorem ipsum dolor sit amet",
      },
      obGyne: {
        menstrualCycle: new Date("01-24-1999"),
        days: 15,
      },
    });

    console.log(result);
  };

  const logPatientsData = () => console.log(patientsData);
  const logPatientData = () => console.log(patientData);

  const deletedPatientData = async () => {
    const result = await deletePatientMutateAsync({
      id: "db92fdfd-52e4-478b-b4cb-9298501d4756",
    });
    console.log(result);
  };

  const showOtherData = () => {
    console.log("gendersData = ", gendersData);
    console.log("genderData = ", genderData);

    console.log("\ncivilStatusesData = ", civilStatusesData);
    console.log("civilStatusData = ", civilStatusData);

    console.log("\noccupationsData = ", occupationsData);
    console.log("occupationData = ", occupationData);
  };

  return (
    <div>
      <button onClick={() => add()}>Add Patient</button>
      <button onClick={() => update()}>Update Patient</button>
      {!patientsDataIsLoading ? (
        <button onClick={() => logPatientsData()}>Log Patients Data</button>
      ) : (
        "loading..."
      )}
      {!patientDataIsLoading ? (
        <button onClick={() => logPatientData()}>Log Patient Data</button>
      ) : (
        "loading"
      )}
      <button onClick={() => deletedPatientData()}>Delete</button>
      <button onClick={() => showOtherData()}>Show Other Data</button>

      <div style={{ marginTop: 20 }}>
        <PatientForm />
      </div>
    </div>
  );
};

export default Test;
