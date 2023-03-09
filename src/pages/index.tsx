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
  CardContent,
  CardHeader,
} from "@mui/material";

import Typography, { TypographyProps } from "@mui/material/Typography";

import { styled } from "@mui/material/styles";

import { loginSchema, ILogin } from "../common/validation/auth";

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: "0.18px",
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: { marginTop: theme.spacing(8) },
}));

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

  // const onSubmit = useCallback(
  //   async (data: ILogin) => {
  //     try {
  //       await signIn("credentials", { ...data, callbackUrl: "/dashboard" });
  //       console.log('succesfully signed in')
  //       reset();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   },
  //   [reset]
  // );

  const loginHandler = async (data: ILogin) => {
    const result = await signIn("credentials", {
      ...data,
      callbackUrl: "/dashboard",
    });
    console.log({ result });
  };

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
          <Form onSubmit={handleSubmit(loginHandler)}>
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
              <Grid item xs={6}>
                <Box
                  
                >
                  <Button type="submit" variant="contained">
                    Login
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  
                >
                  <Button variant="contained" color="secondary" href="/sign-up">
                    Sign Up
                  </Button>
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
