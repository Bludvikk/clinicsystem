import {
  deleteEntity,
  getEntities,
  postEntity,
  putEntity,
} from "@/server/hooks/entity";
import {
  deletePatient,
  getPatient,
  getPatients,
  postPatient,
  putPatient,
} from "@/server/hooks/patient";
import {
  getReferences,
  postReference,
  putReference,
  deleteReference,
} from "@/server/hooks/reference";
// import PatientForm from "@/views/pages/patient/PatientForm";

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

  const { mutateAsync: postReferenceMutateAsync } = postReference({
    entities: [1, 2, 3],
  });
  const { mutateAsync: putReferenceMutateAsync } = putReference({
    entities: [1, 2, 3],
  });
  const { mutateAsync: deleteReferenceMutateAsync } = deleteReference({
    entities: [1, 2, 3],
  });
  const { data: referencesData, status: referencesDataStatus } = getReferences({
    entities: [1, 2, 3],
  });

  const { data: entitiesData, status } = getEntities();
  const { mutateAsync: postEntityMutateAsync } = postEntity();
  const { mutateAsync: putEntityMutateAsync } = putEntity();
  const { mutateAsync: deleteEntityMutateAsync } = deleteEntity();

  const add = async () => {
    const result = await postPatientMutateAsync({
      firstName: "Jerry",
      lastName: "Ansit",
      middleInitial: "S",
      address: "Saint Heaven",
      dateOfBirth: new Date("01-24-2001"),
      civilStatusId: 10,
      age: 10,
      occupationId: 1,
      genderId: 2,
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
      id: "20c4f0ed-fac4-4730-a736-b37c453b0196",
      firstName: "Justine updatedx",
      lastName: "Barber updatedx",
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
      id: "20c4f0ed-fac4-4730-a736-b37c453b0196",
    });
    console.log(result);
  };

  const logReferencesData = () => {
    console.log(referencesData);
  };
  const addReference = async () => {
    const result = await postReferenceMutateAsync({
      code: "jordan",
      name: "Jordan",
      entityId: 10,
    });

    console.log(result);
  };
  const updateReference = async () => {
    const result = await putReferenceMutateAsync({
      id: 18,
      code: "jordan updated",
      name: "Jordan  updated",
      entityId: 10,
    });

    console.log(result);
  };
  const deleteReferenceFunc = async () => {
    const result = await deleteReferenceMutateAsync({
      id: 18,
    });

    console.log(result);
  };

  const logEntitiesData = () => {
    console.log(entitiesData);
  };
  const addEntity = async () => {
    const result = await postEntityMutateAsync({
      code: "brand",
      name: "Brand",
      fieldProp: "brand",
    });

    console.log(result);
  };
  const updateEntity = async () => {
    const result = await putEntityMutateAsync({
      id: 10,
      code: "brand updated",
      name: "Brand updated",
      fieldProp: "brandUpdated",
    });

    console.log(result);
  };
  const deleteEntityFunc = async () => {
    const result = await deleteEntityMutateAsync({
      id: 10,
    });

    console.log(result);
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

      <div>
        <button onClick={() => logReferencesData()}>Log References Data</button>
        <button onClick={() => addReference()}>Add Reference</button>
        <button onClick={() => updateReference()}>update Reference</button>
        <button onClick={() => deleteReferenceFunc()}>delete Reference</button>
      </div>

      <div>
        <button onClick={() => logEntitiesData()}>Log entities</button>
        <button onClick={() => addEntity()}>add entity</button>
        <button onClick={() => updateEntity()}>update entity</button>
        <button onClick={() => deleteEntityFunc()}>delete entity</button>
      </div>

      <div style={{ marginTop: 20 }}>{/* <PatientForm /> */}</div>
    </div>
  );
};

export default Test;
