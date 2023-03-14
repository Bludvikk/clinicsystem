// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Container } from '@mui/material'
// ** Styled Component

// ** Demo Components Imports
import FormLayoutsSeparator from '@/views/AddPatientForm'

const FormLayouts = () => {
  return (
    <Container>
      <Grid container spacing={6}>


        <Grid item xs={12}>
          <FormLayoutsSeparator />
        </Grid>

      </Grid>
    </Container>
  )
}

export default FormLayouts
