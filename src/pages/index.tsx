import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback } from "react";
import { signIn } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardActions,
  Grid,
  Box,
  TextField,
  Typography,
  CardContent,
  CardHeader,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import { loginSchema, ILogin } from "../common/validation/auth";

const Form = styled("form")(({ theme }) => ({
  maxWidth: 600,
  padding: theme.spacing(12),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));
const Home: NextPage = () => {
  const { handleSubmit, control, reset } = useForm<ILogin>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useCallback(
    async (data: ILogin) => {
      try {
        await signIn("credentials", { ...data, callbackUrl: "/" });
        reset();
      } catch (err) {
        console.error(err);
      }
    },
    [reset]
  );

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh" }}
    >
      <Card>
        <CardHeader title="Sign In" />
        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField fullWidth label="Email" {...field} />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField fullWidth label="Password" {...field} />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    gap: 5,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button type="submit" variant="contained">
                    Login
                  </Button>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ mr: 2 }}>
                      Dont Have an Account Yet?
                    </Typography>
                    <Link href="/sign-up" passHref>
                      Sign Up!
                    </Link>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Form>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Home;
