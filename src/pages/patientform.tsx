// ** React Imports
import { ChangeEvent, MouseEvent, useState, SyntheticEvent } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import form from "@mui/material";
import { width } from "@mui/system";

interface State {
  password: string;
  showPassword: boolean;
}

const FormLayoutsBasic = () => {


  return (
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
                <TextField fullWidth label="Address" placeholder="Davao City" />
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
                <TextField fullWidth label="Gender" placeholder="Male" />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  placeholder="0977091060"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  2. Family History
                </Typography>
              </Grid>
              <Grid item xs={6}>
                  <FormControlLabel
                    label="Bronchial Asthma"
                    control={
                      <Checkbox
                        
                        name="controlled"
                      />
                    }
                  />
              </Grid>
              <Grid item xs={6}>
                  <FormControlLabel
                    label="Diabetes Milletus"
                    control={
                      <Checkbox
                        
                        name="controlled"
                      />
                    }
                  />
              </Grid>
              <Grid item xs={6}>
                  <FormControlLabel
                    label="Pulmonary Tuberculosis"
                    control={
                      <Checkbox
                        
                        name="controlled"
                      />
                    }
                  />
              </Grid>
              <Grid item xs={6}>
                  <FormControlLabel
                    label="Heart Disease"
                    control={
                      <Checkbox
                        
                        name="controlled"
                      />
                    }
                  />
              </Grid>
              <Grid item xs={6}>
                  <FormControlLabel
                    label="Hypertension"
                    control={
                      <Checkbox
                        
                        name="controlled"
                      />
                    }
                  />
              </Grid>
              <Grid item xs={6}>
                  <FormControlLabel
                    label="Cancer"
                    control={
                      <Checkbox
                        
                        name="controlled"
                      />
                    }
                  />
              </Grid>

              <Grid item xs={3}>    
                <Box
                  sx={{
                    gap: 5,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button type="submit" variant="contained" size="large">
                    Submit
                  </Button>
                  <Box sx={{ display: "flex", alignItems: "center" }}></Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default FormLayoutsBasic;
