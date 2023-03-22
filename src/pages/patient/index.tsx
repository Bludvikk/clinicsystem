import { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";

import { Box, Dialog, DialogContent, DialogActions } from "@mui/material";

import { requireAuth } from "@/common/requireAuth";
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import AddUserWizard from "@/views/AddUserDialogWizard";
export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const Patient: NextPage = () => {
  const { data } = useSession();

  return (
    <Grid container>
      <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    ></Box>
      <Card>
        <CardHeader title="Patient"></CardHeader>
        <CardContent>
          <Grid container spacing={3}>
          <Grid item xs={12}>
            <AddUserWizard />
          </Grid>

          </Grid>


          <Typography variant="subtitle1" component="p">
            add text
          </Typography>


        </CardContent>
      </Card>
    </Grid>
  );
};

export default Patient;
