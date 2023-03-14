import { ReactNode, useState, Fragment, MouseEvent } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Divider,
  Checkbox,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  IconButton,
  CssBaseline,
  Paper,
  Grid,
  Avatar,
  FormControlLabel,
  Typography
} from "@mui/material";

import Box, { BoxProps } from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import Icon from "@/@core/components/icon";

import { trpc } from "@/common/trpc";

import { signUpSchema, ISignUp } from "../../common/validation/auth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { createTheme, ThemeProvider } from "@mui/material/styles";


const theme = createTheme();

const RegisterPage: NextPage = (props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const {
    control,
    setError,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      terms: false,
    },
    mode: "onBlur",
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync } = trpc.signup.useMutation();
  const registerHandler = useCallback(
    async (data: ISignUp) => {
      try {
        const result = await mutateAsync(data);
        if (result.status === 201) {
          reset();
          router.push("/login/");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [mutateAsync, router, reset]
  );

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh " }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random/?hospital/)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Box sx={{ mb: 6 }}>
              <Typography variant="body2">
                Please sign-in to your account and start the adventure
              </Typography>
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(registerHandler)}
            >
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      value={value}
                      onBlur={onBlur}
                      label="Username"
                      onChange={onChange}
                      placeholder="johndoe"
                      error={Boolean(errors.username)}
                    />
                  )}
                />
                {errors.username && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.username.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label="Email"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder="glennpower@gmail.com"
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth>
                <InputLabel
                  htmlFor="auth-login-v2-password"
                  error={Boolean(errors.password)}
                >
                  Password
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label="Password"
                      onChange={onChange}
                      id="auth-login-v2-password"
                      error={Boolean(errors.password)}
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon
                              icon={
                                showPassword
                                  ? "mdi:eye-outline"
                                  : "mdi:eye-off-outline"
                              }
                              fontSize={20}
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: "error.main" }} id="">
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl sx={{ my: 0 }} error={Boolean(errors.terms)}>
                <Controller
                  name='terms'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <FormControlLabel
                        sx={{
                          ...(errors.terms ? { color: 'error.main' } : null),
                          '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
                        }}
                        control={
                          <Checkbox
                            checked={value}
                            onChange={onChange}
                            sx={errors.terms ? { color: 'error.main' } : null}
                          />
                        }
                        label={
                          <Fragment>
                            <Typography
                              variant='body2'
                              component='span'
                              sx={{ color: errors.terms ? 'error.main' : '' }}
                            >
                              I agree to{' '}
                            </Typography>
                            <Typography
                              href='/'
                              variant='body2'
                              component={Link}
                              sx={{ color: 'primary.main', textDecoration: 'none' }}
                              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                            >
                              privacy policy & terms
                            </Typography>
                          </Fragment>
                        }
                      />
                    )
                  }}
                />
                {errors.terms && (
                  <FormHelperText sx={{ mt: 0, color: 'error.main' }}>{errors.terms.message}</FormHelperText>
                )}
              </FormControl>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                Sign up
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>Already have an account?</Typography>
                <Typography href='/login' component={Link} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                  Sign in instead
                </Typography>
              </Box>
              <Divider
                sx={{
                  '& .MuiDivider-wrapper': { px: 4 },
                  mt: theme => `${theme.spacing(5)} !important`,
                  mb: theme => `${theme.spacing(7.5)} !important`
                }}
              >
                or
              </Divider>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  href="/"
                  component={Link}
                  sx={{ color: "#497ce2" }}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                >
                  <Icon icon="mdi:facebook" />
                </IconButton>
                <IconButton
                  href="/"
                  component={Link}
                  sx={{ color: "#1da1f2" }}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                >
                  <Icon icon="mdi:twitter" />
                </IconButton>
                <IconButton
                  href="/"
                  component={Link}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#272727" : "grey.300",
                  }}
                >
                  <Icon icon="mdi:github" />
                </IconButton>
                <IconButton
                  href="/"
                  component={Link}
                  sx={{ color: "#db4437" }}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                >
                  <Icon icon="mdi:google" />
                </IconButton>
              </Box>
              {/* <Copyright sx={{ mt: 5 }} /> */}
            </form>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default RegisterPage;
