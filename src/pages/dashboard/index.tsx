import { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";

import Box from "@mui/material/Box";

import { requireAuth } from "@/common/requireAuth";
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import PatientInfoForm from "@/views/pages/patient/PatientInfoForm";
import { FormPropsType } from "@/utils/common.type";
import AddMedicationForm from "@/views/pages/patient/addMedication";

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const Dashboard = ({formId}: FormPropsType) => {
  const { data } = useSession();

  return (
    <Grid container>
      <Card>
        <CardHeader title="Dashboard"></CardHeader>
        <CardContent>
          <PatientInfoForm formId={formId}/>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Dashboard;
