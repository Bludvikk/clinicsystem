import { requireAuth } from "@/common/requireAuth";
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
  getPhysicalCheckup,
  getPhysicalCheckups,
  postPatient,
  postPhysicalCheckup,
  putPatient,
} from "@/server/hooks/patient";
import {
  getReferences,
  postReference,
  putReference,
  deleteReference,
} from "@/server/hooks/reference";
import AddUserWizard from "@/views/AddUserDialogWizard";
import AddPhysicalCheckupDialog from "@/views/pages/patient/AddPhysicalCheckupDialog";
import PatientForm from "@/views/pages/patient/PatientForm";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

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

  // const { data } = useSession();

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

  // const { mutate: physicalCheckupMutate } = postPhysicalCheckup();
  // const { data: PhysicalCheckupsData } = getPhysicalCheckups({
  //   patientId: "7f63d842-bfc7-465d-81f4-65f2dd7b565b",
  // });
  // const { data: PhysicalCheckupData } = getPhysicalCheckup({
  //   id: "6e505243-15f4-4c4a-984f-09e3a7e91b27",
  // });

  const add = async () => {
    const result = await postPatientMutateAsync({
      firstName: "Kiko",
      lastName: "Canono",
      middleInitial: "S",
      address: "Panacan Davao City",
      dateOfBirth: new Date("01-30-1999"),
      civilStatusId: 10,
      age: 10,
      occupationId: 1,
      genderId: 2,
      contactNumber: "09123456789",
      familyHistory: {
        diseases: [1, 2, 3],
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
        hospitalized: "N/A",
        injuries: "N/A",
        surgeries: "N/A",
        allergies: "N/A",
        measles: "N/A",
        chickenPox: "N/A",
        others: "N/A",
      },
      obGyne: {
        menstrualCycle: new Date("01-24-1999"),
        days: 15,
        p: 1,
        g: 1,
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
        diseases: [1, 2, 3],
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
        p: 12,
        g: 5,
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

  // const addPhysicalCheckup = () => {
  //   physicalCheckupMutate(
  //     {
  //       patientId: "7f63d842-bfc7-465d-81f4-65f2dd7b565b",
  //       physicianId: "4dee3e7c-cd1a-11ed-afa1-0242ac120002",
  //       vitalSigns: {
  //         t: 50,
  //         p: 50,
  //         bp: "150-200",
  //         ht: 150,
  //         wt: 100,
  //         r: 20,
  //         cbg: 150,
  //       },
  //       diagnoses: [
  //         {
  //           name: " Alzheimer’s disease",
  //         },
  //       ],
  //       treatments: [
  //         {
  //           medicineId: 20,
  //           signa: "Once a day after meal",
  //         },
  //         {
  //           medicineId: 21,
  //           signa: "Once a day after meal",
  //         },
  //       ],
  //       followUp: new Date("04-22-2023"),
  //       dietaryAdviseGiven: "Drink more milk and eat more on vegetables.",
  //     },
  //     {
  //       onSuccess(data) {
  //         console.log("🚀 ~ file: test.tsx:280 ~ onSuccess ~ data:", data);
  //       },
  //     }
  //   );
  // };

  // const logPhysicalCheckupByPatietId = () => {
  //   console.log(PhysicalCheckupsData);
  // };
  // const logPhysicalCheckup = () => {
  //   console.log(PhysicalCheckupData);
  // };

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
      {/* 
      <div>
        <button onClick={() => addPhysicalCheckup()}>
          Add Physical Checkup
        </button>
        <button onClick={() => logPhysicalCheckupByPatietId()}>
          Log Physical Checkups by Patient Id
        </button>
        <button onClick={() => logPhysicalCheckup()}>
          Log Physical Checkup
        </button>
      </div> */}

      {/* <div style={{ marginTop: 20 }}>
        <PatientForm />
      </div> */}

      {/* <Box mt={2}>
        <AddPhysicalCheckupDialog />
      </Box> */}
    </div>
  );
};

export default Test;
