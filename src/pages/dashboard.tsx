import { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { requireAuth } from "../common/requireAuth";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const Dashboard: NextPage = () => {
  const { data } = useSession();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper" }}>
      <Box sx={{ py: 8 }}>
        <Box sx={{ maxWidth: 600, mx: "auto", px: 2 }}>
          <Typography variant="h2" align="center" gutterBottom>
            You are logged in!
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            You are allowed to visit this page because you have a session,
            otherwise you would be redirected to the login page.
          </Typography>
          <Box sx={{ bgcolor: "grey.700", borderRadius: 2, p: 2, mt: 4 }}>
            <pre>
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </Box>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Button>
          </Box>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              href="/patientform"
            >
              Add Patient
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
