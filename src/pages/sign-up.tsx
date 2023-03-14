import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  TextField,
  Card,
  Grid,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  Box,
  CardContent,
  CardHeader,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { signUpSchema, ISignUp } from "../common/validation/auth";
import { trpc } from "../utils/trpc";

const Form = styled("form")(({ theme }) => ({
  maxWidth: 600,
  padding: theme.spacing(12),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const SignUp: NextPage = () => {
  const router = useRouter();
  const { handleSubmit, control, reset } = useForm<ISignUp>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync } = trpc.signup.useMutation();

  const onSubmit = useCallback(
    async (data: ISignUp) => {
      try {
        const result = await mutateAsync(data);
        if (result.status === 201) {
          reset();
          router.push("/");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [mutateAsync, router, reset]
  );

  return (
    <Grid container alignItems="center" justifyContent="center" sx={{ height: "100vh" }}>
      <Card>
        <CardHeader title="Sign Up" />
        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => <TextField fullWidth label="Username" {...field} />}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <TextField fullWidth label="Email" {...field} />}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => <TextField fullWidth label="Password" {...field} />}
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
                    Sign Up!
                  </Button>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ mr: 2 }}>Already have an account?</Typography>
                    <Link href="/" passHref>
                      Log in
                    </Link>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Form>
        </CardContent>
      </Card>
    </Grid>

    // <form
    //   className="flex items-center justify-center h-screen w-full"
    //   onSubmit={handleSubmit(onSubmit)}
    // >
    //   <div className="card w-96 bg-base-100 shadow-xl">
    //     <div className="card-body">
    //       <h2 className="card-title">Create an account!</h2>
    //       <Controlle
  );
};

export default SignUp;
