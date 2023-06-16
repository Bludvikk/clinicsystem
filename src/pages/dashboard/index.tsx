import { NextPage, InferGetServerSidePropsType } from "next";
import { useSession, signOut } from "next-auth/react";

import Box from "@mui/material/Box";

import { requireAuth } from "@/common/requireAuth";
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import PatientInfoForm from "@/views/pages/patient/PatientInfoForm";
import { FormPropsType } from "@/utils/common.type";
import { useEffect, useState } from "react";
// import AddMedicationForm from "@/views/pages/patient/addMedication";

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const Dashboard = ({formId}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const { data } = useSession();
  const [xx, setXX] = useState()
  console.log(xx);

  useEffect( () => {
    const fetchData = async () => {
      const result = await fetch('https://sentry-testdpy.vercel.app/api/trpc/sales', { method: 'GET' })
      const json = await result.json()

      setXX(json)
     }  

    fetchData().then(data => console.log(data)).catch(err => console.log(err))
    // const body =  result.json()
  }, [])


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
