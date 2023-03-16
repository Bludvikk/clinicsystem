import { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";

import { Box, Dialog, DialogContent, DialogActions } from "@mui/material";

import { requireAuth } from "@/common/requireAuth";
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import AddUserDialog from "@/views/AddUserDialog";

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
        <Grid item md={4} sm={6} xs={12}>
            <AddUserDialog />
          </Grid>
          <Typography variant="subtitle1" component="p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            tincidunt dui id libero gravida pharetra. Pellentesque augue velit,
            venenatis id vehicula id, tincidunt eget tellus. Duis mollis gravida
            erat, eu malesuada quam tincidunt sit amet. Phasellus ut augue sed
            ipsum tempus feugiat sit amet eu nisl. Nulla aliquam ex ex,
          </Typography>


        </CardContent>
      </Card>
    </Grid>
  );
};

export default Patient;
