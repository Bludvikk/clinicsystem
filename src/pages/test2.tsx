import PatientHealthRecordDialog from "@/views/pages/patient/PatientHealthRecordDialog";
import { NextPage } from "next";
import React from "react";

const Test2: NextPage = () => {
  return <PatientHealthRecordDialog />;
};

export default Test2;
Test2.acl = {
  action: "read",
  subject: "patient",
};
