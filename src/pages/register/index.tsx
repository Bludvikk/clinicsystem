// ** React Imports
import {
  ReactNode,
  useState,
  Fragment,
  MouseEvent,
  useCallback,
  useEffect,
} from "react";

// ** Next Import
import Link from "next/link";
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
  useMediaQuery,
  FormGroup,
  Select,
  MenuItem,
} from "@mui/material";

import { styled, useTheme } from "@mui/material/styles";

import MuiFormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  RegisterUserDtoSchemaType,
  registerUserDtoSchema,
} from "@/server/schema/user";

import { trpc } from "@/utils/trpc";

import { NextPage } from "next";
import { useSession } from "next-auth/react";

import Icon from "src/@core/components/icon";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Hooks
import { useSettings } from "src/@core/hooks/useSettings";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import { getReferences } from "@/server/hooks/reference";
import { postUser } from "@/server/hooks/user";
import { toast } from "react-hot-toast";

const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: "0 !important",
  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(10),
  },
}));

const RegisterIllustration = styled("img")(({ theme }) => ({
  maxWidth: "38rem",
  [theme.breakpoints.down("xl")]: {
    maxWidth: "35rem",
  },
  [theme.breakpoints.down("lg")]: {
    maxWidth: "32rem",
  },
}));

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 400,
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: 700,
  },
}));

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("md")]: {
    maxWidth: 600,
  },
}));

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: "0.18px",
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: { marginTop: theme.spacing(8) },
}));

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    marginBottom: theme.spacing(4),
    "& .MuiFormControlLabel-label": {
      fontSize: "0.875rem",
      color: theme.palette.text.secondary,
    },
  })
);

const RegisterPage: NextPage = () => {
  const theme = useTheme();
  const { settings } = useSettings();
  const { skin } = settings;
  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  const { data: referencesData, status: referencesDataStatus } = getReferences({
    entities: [6, 7, 8],
  });
  const { mutate: postUserData } = postUser();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<RegisterUserDtoSchemaType>({
    defaultValues: {
      firstName: "",
      lastName: "",
      middleInitial: "",
      userName: "",
      email: "",
      password: "",
      departmentId: null,
      roleId: 0,
      statusId: 0,
      terms: false,
    },
    mode: "onChange",
    resolver: zodResolver(registerUserDtoSchema),
  });

  useEffect(() => {
    if (referencesData && referencesData?.length > 0) {
      setValue(
        "roleId",
        referencesData
          .filter((ref) => ref.entityId === 6)
          .filter((ref) => ref.isDefault)[0].id
      );
      setValue(
        "statusId",
        referencesData
          .filter((ref) => ref.entityId === 8)
          .filter((ref) => ref.isDefault)[0].id
      );
    }
  }, [referencesData]);

  const onSubmit: SubmitHandler<RegisterUserDtoSchemaType> = (
    data: RegisterUserDtoSchemaType
  ) => {
    postUserData(
      { ...data },
      {
        onSuccess: (data) => {
          toast.success(data.message),
            reset({
              firstName: "",
              lastName: "",
              middleInitial: "",
              userName: "",
              email: "",
              password: "",
              departmentId: null,
              roleId: referencesData!
                .filter((ref) => ref.entityId === 6)
                .filter((ref) => ref.isDefault)[0].id,
              statusId: referencesData!
                .filter((ref) => ref.entityId === 8)
                .filter((ref) => ref.isDefault)[0].id,
              terms: false,
            });
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const imageSource =
    skin === "bordered"
      ? "auth-v2-register-illustration-bordered"
      : "auth-v2-register-illustration";

  return (
    <Box className="content-right">
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RegisterIllustrationWrapper>
            <RegisterIllustration
              alt="register-illustration"
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </RegisterIllustrationWrapper>
          <FooterIllustrationsV2
            image={`/images/pages/auth-v2-register-mask-${theme.palette.mode}.png`}
          />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          skin === "bordered" && !hidden
            ? { borderLeft: `1px solid ${theme.palette.divider}` }
            : {}
        }
      >
        <Box
          sx={{
            p: 7,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper",
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: "flex",
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width={47}
                fill="none"
                height={26}
                viewBox="0 0 268 150"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fillOpacity="0.4"
                  fill="url(#paint0_linear_7821_79167)"
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fillOpacity="0.4"
                  fill="url(#paint1_linear_7821_79167)"
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)"
                />
                <defs>
                  <linearGradient
                    y1="0"
                    x1="25.1443"
                    x2="25.1443"
                    y2="143.953"
                    id="paint0_linear_7821_79167"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop />
                    <stop offset="1" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    y1="0"
                    x1="25.1443"
                    x2="25.1443"
                    y2="143.953"
                    id="paint1_linear_7821_79167"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop />
                    <stop offset="1" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <Typography
                variant="h6"
                sx={{
                  ml: 2,
                  lineHeight: 1,
                  fontWeight: 700,
                  fontSize: "1.5rem !important",
                }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>

            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant="h5" textAlign="center">
                Create an account
              </TypographyStyled>
              <Typography variant="body2" textAlign="center">
                Get started using Well. Please enter your information below.
              </Typography>
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ mb: 4, pr: 4 }}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          name="firstName"
                          label="First Name"
                          error={Boolean(errors.firstName)}
                          helperText={errors.firstName?.message}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          name="lastName"
                          label="Last Name"
                          error={Boolean(errors.lastName)}
                          helperText={errors.lastName?.message}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ mb: 4, pr: 4 }}>
                    <Controller
                      name="middleInitial"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          name="Middle Initial"
                          label="Middle Initial"
                          error={Boolean(errors.middleInitial)}
                          helperText={errors.middleInitial?.message}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name="userName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          name="userName"
                          label="Username"
                          error={Boolean(errors.userName)}
                          helperText={errors.userName?.message}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      name="email"
                      label="Email"
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="password"
                      name="password"
                      label="Password"
                      error={Boolean(errors.password)}
                      helperText={errors.password?.message}
                    />
                  )}
                />
              </FormControl>

              <Grid container>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name="roleId"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth sx={{ mb: 4, pr: 4 }}>
                          <InputLabel id="roleId-label">Role</InputLabel>
                          <Select
                            {...field}
                            label="Role"
                            labelId="roleId-label"
                            disabled={referencesDataStatus === "loading"}
                            error={Boolean(errors.roleId)}
                          >
                            <MenuItem value={0}>Select Role</MenuItem>
                            {referencesData &&
                              referencesData?.length > 0 &&
                              referencesData
                                ?.filter((ref) => ref.entityId === 6)
                                .map((role) => (
                                  <MenuItem key={role.id} value={role.id}>
                                    {role.name}
                                  </MenuItem>
                                ))}
                          </Select>
                          <FormHelperText sx={{ color: "error.main" }}>
                            {errors.roleId?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name="departmentId"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth sx={{ mb: 4 }}>
                          <InputLabel id="departmentId-label">
                            Department
                          </InputLabel>
                          <Select
                            {...field}
                            label="Department"
                            labelId="departmentId-label"
                            disabled={referencesDataStatus === "loading"}
                            error={Boolean(errors.departmentId)}
                          >
                            <MenuItem value="">Select Department</MenuItem>
                            {referencesData &&
                              referencesData?.length > 0 &&
                              referencesData
                                ?.filter((ref) => ref.entityId === 7)
                                .map((department) => (
                                  <MenuItem
                                    key={department.id}
                                    value={department.id}
                                  >
                                    {department.name}
                                  </MenuItem>
                                ))}
                          </Select>
                          <FormHelperText sx={{ color: "error.main" }}>
                            {errors.departmentId?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <FormControl sx={{ mb: 4 }} error={Boolean(errors.terms)}>
                <Controller
                  name="terms"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <FormGroup>
                        <FormControlLabel
                          sx={{
                            marginBottom: 0,
                            ...(errors.terms ? { color: "error.main" } : null),
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.875rem",
                            },
                          }}
                          control={
                            <Checkbox
                              {...field}
                              checked={Boolean(getValues("terms"))}
                              sx={errors.terms ? { color: "error.main" } : null}
                            />
                          }
                          label={
                            <Fragment>
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{ color: errors.terms ? "error.main" : "" }}
                              >
                                I have read and agree to the{" "}
                              </Typography>
                              <Typography
                                href="/"
                                variant="body2"
                                component={Link}
                                sx={{
                                  color: "primary.main",
                                  textDecoration: "none",
                                }}
                                onClick={(e: MouseEvent<HTMLElement>) =>
                                  e.preventDefault()
                                }
                              >
                                privacy policy & terms
                              </Typography>
                            </Fragment>
                          }
                        />

                        {errors.terms && (
                          <FormHelperText sx={{ color: "error.main" }}>
                            {errors.terms.message}
                          </FormHelperText>
                        )}
                      </FormGroup>
                    );
                  }}
                />
              </FormControl>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mb: 7 }}
              >
                Register
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ mr: 2, color: "text.secondary" }}>
                  Already have an account?
                </Typography>
                <Typography
                  href="/login"
                  component={Link}
                  sx={{ color: "primary.main", textDecoration: "none" }}
                >
                  Sign in instead
                </Typography>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  );
};

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

RegisterPage.acl = {
  action: "read",
  subject: "register",
};

export default RegisterPage;
