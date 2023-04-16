// ** React Imports
import { useState, MouseEvent } from "react";

// ** Next Imports
import Link from "next/link";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { requireAuth } from "@/common/requireAuth";
import { deletePatient, getPatients } from "@/server/hooks/patient";

// ** MUI Imports
import {
  Box,
  Menu,
  Card,
  CardContent,
  Grid,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Custom Components Imports
import toast from "react-hot-toast";

// ** Types Imports
import { PatientsType } from "@/utils/db.type";

// ** 3rd Party Libraries
import moment from "moment";

// ** Custom Table Components Imports
import TableHeader from "@/views/pages/patient/TableHeader";
import AddPhysicalCheckupDialog from "@/views/pages/patient/AddPhysicalCheckupDialog";
import {
  usePatientFormStore,
  usePhysicalCheckupFormStore,
} from "@/utils/patient.store";
import PatientHealthRecordDialog from "@/views/pages/patient/PatientHealthRecordDialog";
import CanView from "@/layouts/components/acl/CanView";
import PhysicalCheckupDialog from "@/views/pages/patient/PhysicalCheckupDialog";

interface CellType {
  row: PatientsType;
}

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const RowOptions = ({ id }: { id: number }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { mutate: deletePatientMutate } = deletePatient();

  const { onEdit } = usePatientFormStore((state) => state);
  const { onAddVitalSigns } = usePhysicalCheckupFormStore((state) => state);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (id: number) => {
    deletePatientMutate(
      { id },
      {
        onSuccess: (data) => toast.success(data.message),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <Icon icon="mdi:dots-vertical" />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ style: { minWidth: "8rem" } }}
      >
        <CanView action="read" subject="patient">
          <MenuItem
            component={Link}
            sx={{ "& svg": { mr: 2 } }}
            onClick={handleRowOptionsClose}
            href="/"
          >
            <Icon icon="mdi:eye-outline" fontSize={20} />
            View
          </MenuItem>
        </CanView>
        <CanView action="update" subject="patient">
          <MenuItem onClick={() => onEdit(id)} sx={{ "& svg": { mr: 2 } }}>
            <Icon icon="mdi:pencil-outline" fontSize={20} />
            Edit
          </MenuItem>
        </CanView>
        <CanView action="delete" subject="patient">
          <MenuItem
            onClick={() => handleDelete(id)}
            sx={{ "& svg": { mr: 2 } }}
          >
            <Icon icon="mdi:delete-outline" fontSize={20} />
            Delete
          </MenuItem>
        </CanView>
        <MenuItem
          sx={{ "& svg": { mr: 2 } }}
          onClick={() => onAddVitalSigns(id)}
        >
          <Icon icon="tabler:checkup-list" fontSize={20} />
          CheckUp
        </MenuItem>
      </Menu>
    </>
  );
};

const columns: GridColDef[] = [
  {
    flex: 0.1,
    minWidth: 220,
    field: "fullname",
    headerName: "Name",
    description: "Patient's full name",
    renderCell: ({ row }: CellType) => {
      const { lastName, firstName, middleInitial } = row;

      return (
        <Typography noWrap variant="body2">
          {lastName}, {firstName} {middleInitial}.
        </Typography>
      );
    },
  },
  {
    flex: 0.05,
    minWidth: 100,
    field: "gender",
    headerName: "Gender",
    description: "Patient's gender",
    renderCell: ({ row }: CellType) => {
      const {
        gender: { name },
      } = row;

      return (
        <Typography noWrap variant="body2">
          {name}
        </Typography>
      );
    },
  },
  {
    flex: 0.05,
    minWidth: 50,
    field: "age",
    headerName: "Age",
    description: "Patient's age",
    renderCell: ({ row }: CellType) => {
      const { age } = row;

      return (
        <Typography noWrap variant="body2">
          {age}
        </Typography>
      );
    },
  },
  {
    flex: 0.08,
    minWidth: 100,
    field: "birthDate",
    headerName: "Date of Birth",
    description: "Patient's date of birth",
    renderCell: ({ row }: CellType) => {
      const { dateOfBirth } = row;

      return (
        <Typography noWrap variant="body2">
          {moment(dateOfBirth).format("L")}
        </Typography>
      );
    },
  },
  {
    flex: 0.08,
    minWidth: 100,
    field: "civilStatus",
    headerName: "Civil Status",
    description: "Patient's civil status",
    renderCell: ({ row }: CellType) => {
      const {
        civilStatus: { name },
      } = row;
      return (
        <Typography noWrap variant="body2">
          {name}
        </Typography>
      );
    },
  },
  {
    flex: 0.08,
    minWidth: 150,
    field: "occupation",
    headerName: "Occupation",
    description: "Patient's current occupation",
    renderCell: ({ row }: CellType) => {
      const {
        occupation: { name },
      } = row;
      return (
        <Typography noWrap variant="body2">
          {name}
        </Typography>
      );
    },
  },
  {
    flex: 0.08,
    minWidth: 100,
    field: "contactNumber",
    headerName: "Contact Number",
    description: "Patient's contact number",
    renderCell: ({ row }: CellType) => {
      const { contactNumber } = row;
      return (
        <Typography noWrap variant="body2">
          {contactNumber}
        </Typography>
      );
    },
  },
  {
    minWidth: 90,
    sortable: false,
    field: "actions",
    headerName: "Actions",
    description: "Actions to perform",
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />,
  },
];

const Patient: NextPage = () => {
  const { data } = useSession();
  const { data: patientsData, status: patientDataStatus } = getPatients();
  const [searchValue, setSearchValue] = useState<string>("");
  // const [addPatientOpen, setAddPatientOpen] = useState<boolean>(false);

  const [paginationModel, setPaginationModel] = useState<{
    pageSize: number;
    page: number;
  }>({
    pageSize: 10,
    page: 0,
  });

  const { onAdd, showDialog: patientFormShowDialog } = usePatientFormStore(
    (state) => state
  );
  const { showDialog: physicalCheckupShowDialog } = usePhysicalCheckupFormStore(
    (state) => state
  );

  const handleFilter = () => {};
  // const toggleAddPatientDialog = () => setAddPatientOpen((prev) => !prev);

  return (
    <Box width="100%">
      <Card sx={{ width: "100%" }}>
        <Grid>
          <TableHeader
            value={searchValue}
            handleFilter={handleFilter}
            toggle={onAdd}
          />
        </Grid>
        <CardContent sx={{ width: "100%", pt: 3 }}>
          <Box width="100%">
            <DataGrid
              autoHeight
              loading={patientDataStatus === "loading"}
              rows={
                patientsData && patientsData?.length > 0 ? patientsData : []
              }
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: paginationModel.pageSize },
                },
              }}
              pageSizeOptions={[10, 15, 20]}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
        </CardContent>
      </Card>

      {patientFormShowDialog ? <PatientHealthRecordDialog /> : null}
      {physicalCheckupShowDialog ? <PhysicalCheckupDialog /> : null}
    </Box>
  );
};

export default Patient;

Patient.acl = {
  action: "read",
  subject: "patient",
};
