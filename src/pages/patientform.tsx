// ** React Imports
import { ChangeEvent, MouseEvent, useState, SyntheticEvent } from "react";

// ** MUI Imports

import {
  Box,
  Card,
  Grid,
  Link,
  Button,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const PatientForm = () => {
  const [isSmoking, setIsSmoking] = useState(false);

  const [isAlcohol, setIsAlcohol] = useState(false);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        "& > *": { mt: 5, maxWidth: 1000 },
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ height: "", width: "150vh" }}
      >
        <Card>
          <CardHeader title="Patient Info Form" />
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={1.5}>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 20, fontWeight: 600 }}
                  >
                    1. Personal Info
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <TextField fullWidth label="First Name" placeholder="Glenn" />
                </Grid>
                <Grid item xs={5}>
                  <TextField fullWidth label="Last Name" placeholder="Nituda" />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label="Middle Initial"
                    placeholder="POWER"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    placeholder="Davao City"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    placeholder="June 11, 2000"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Civil Status"
                    placeholder="Married"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Age" placeholder="69" />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Occupation"
                    placeholder="Carpenter"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="gender-form-select">Gender</InputLabel>
                    <Select
                      label="Gender"
                      id="gender-select"
                      //onChange={handleChange}
                      labelId="gender-form-select"
                      defaultValue={""}
                    >
                      <MenuItem value={"Male"}>Male</MenuItem>
                      <MenuItem value={"Female"}>Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    placeholder="0977091060"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 20, fontWeight: 600 }}
                  >
                    2. Family History
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    label="Bronchial Asthma"
                    control={<Checkbox name="controlled" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    label="Diabetes Milletus"
                    control={<Checkbox name="controlled" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    label="Pulmonary Tuberculosis"
                    control={<Checkbox name="controlled" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    label="Heart Disease"
                    control={<Checkbox name="controlled" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    label="Hypertension"
                    control={<Checkbox name="controlled" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    label="Cancer"
                    control={<Checkbox name="controlled" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Others"
                    placeholder="Hemophilia"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 20, fontWeight: 600 }}
                  >
                    3. Personal History
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    label="Smoking"
                    control={
                      <Checkbox
                        onClick={() => setIsSmoking(!isSmoking)}
                        name="smoking"
                      />
                    }
                  />
                  <Grid item xs={12}>
                    <TextField
                      disabled={!isSmoking}
                      fullWidth
                      label="No. of sticks per day"
                      placeholder="10"
                    />
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <FormControlLabel
                    label="Alcohol"
                    control={
                      <Checkbox
                        onClick={() => setIsAlcohol(!isAlcohol)}
                        name="alcohol"
                      />
                    }
                  />
                  <Grid item xs={12}>
                    <TextField
                      disabled={!isAlcohol}
                      fullWidth
                      label="No. of years"
                      placeholder="10"
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 20, fontWeight: 600 }}
                  >
                    4. Present Health Condition
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 12, lineHeight: 2, fontWeight: 400 }}
                  >
                    List any medication taken regularly
                  </Typography>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Medication"
                      placeholder="dosage, generic, brand name"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 20, fontWeight: 600 }}
                  >
                    5. Past Medical History
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    label="Have you ever been hospitalized?"
                    control={<Checkbox name="isHospitalized" />}
                  />
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="When and Why"
                      placeholder="last year, I was impaled by a nail"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    label="Have you every had any serious injuries and/or broken bones?"
                    control={<Checkbox name="isInjuries" />}
                  />
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Please specify"
                      placeholder="last year, I was impaled by a nail"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    label="Have you undergone any surgeries?"
                    control={<Checkbox name="isSurgery" />}
                  />
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Please specify"
                      placeholder="last year, I was impaled by a nail"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    label="Do you have any allergies?"
                    control={<Checkbox name="isAllergies" />}
                  />
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Please specify"
                      placeholder="last year, I was impaled by a nail"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    label="Have you had measles??"
                    control={<Checkbox name="isMeasles" />}
                  />
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="please specify"
                      placeholder="last year, I was impaled by a nail"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    label="Have you had chicken pox?"
                    control={<Checkbox name="isChickenPox" />}
                  />
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="When and Why"
                      placeholder="last year, I was impaled by a nail"
                    />
                  </Grid>
                </Grid>

                <Grid item sm={12}>
                  <Box
                    sx={{
                      gap: 10,
                      display: "flex",
                      flexWrap: "wrap",

                      justifyContent: "flex-end",
                    }}
                  >
                    <Button type="submit" variant="contained" size="large">
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default PatientForm;
