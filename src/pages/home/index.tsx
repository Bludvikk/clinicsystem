import React from 'react'
import { NextPage } from 'next'
import { useSession, signOut } from "next-auth/react";

import {
  Button,
  Box,
  Typography,
  CardHeader,
  Card,
  Grid,
  CardContent,
  
} from '@mui/material'

import { requireAuth } from "@/common/requireAuth"

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const Home: NextPage = () => {

    const data = useSession
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Kick start your project 🚀'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>All the best for your new project.</Typography>
            <Typography>
              Please make sure to read our Template Documentation to understand where to go from here and how to use our
              template.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='ACL and JWT 🔒'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>
              Access Control (ACL) and Authentication (JWT) are the two main security features of our template and are
              implemented in the starter-kit as well.
            </Typography>
            <Typography>Please read our Authentication and ACL Documentations to get more out of them.</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    
    
  )
}   

export default Home
