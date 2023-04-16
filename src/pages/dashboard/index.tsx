import { NextPage } from "next";

import { requireAuth } from "@/common/requireAuth";
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const Dashboard: NextPage = () => {
  return (
    <Grid container>
      <Card>
        <CardHeader title="Dashboard"></CardHeader>
        <CardContent>
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

export default Dashboard;

Dashboard.acl = {
  action: "read",
  subject: "dashboard",
};
