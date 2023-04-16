// ** React Imports
import { useState, MouseEvent } from "react";

// ** Next Imports
import Link from "next/link";
import { NextPage } from "next";
import { requireAuth } from "@/common/requireAuth";

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

// ** 3rd Party Libraries
import moment from "moment";
import { VitalSignsType } from "@/utils/db.type";
import { useSession } from "next-auth/react";
import { getVitalSignsToday } from "@/server/hooks/patient";

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

interface CellType {
  row: VitalSignsType;
}

const RowOptions = ({ id }: { id: number }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <Icon icon="mdi:dots-vertical" />
      </IconButton>

      {/* actions menu */}
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
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
        <MenuItem
          component={Link}
          sx={{ "& svg": { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href="/"
        >
          <Icon icon="mdi:eye-outline" fontSize={20} />
          View
        </MenuItem>
        <MenuItem sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="mdi:pencil-outline" fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="mdi:delete-outline" fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

const columns: GridColDef[] = [
  {
    flex: 0.05,
    headerName: "Date",
    field: "createdAt",
    description: "Date when the vital signs record was added",
    renderCell: ({ row }: CellType) => {
      const { createdAt } = row;

      return (
        <Typography noWrap variant="body2">
          {moment(createdAt).format("L")}
        </Typography>
      );
    },
  },
  {
    flex: 0.05,
    minWidth: 220,
    headerName: "Name",
    field: "fullname",
    description: "Patient's full name",
    renderCell: ({ row }: CellType) => {
      const {
        patient: { firstName, lastName, middleInitial },
      } = row;

      return (
        <Typography noWrap variant="body2">
          {lastName}, {firstName} {middleInitial}.
        </Typography>
      );
    },
  },
  {
    flex: 0.05,
    minWidth: 220,
    headerName: "Physician",
    field: "physician",
    description: "Physician assigned to the patient",
    renderCell: ({ row }: CellType) => {
      const {
        physician: { firstName, lastName, middleInitial },
      } = row;

      return (
        <Typography noWrap variant="body2">
          {lastName}, {firstName} {middleInitial}.
        </Typography>
      );
    },
  },
  {
    flex: 0.05,
    minWidth: 220,
    headerName: "Added By",
    field: "receptionist",
    description: "Receptionist who added the patient vital signs",
    renderCell: ({ row }: CellType) => {
      const {
        receptionist: { firstName, lastName, middleInitial },
      } = row;

      return (
        <Typography noWrap variant="body2">
          {lastName}, {firstName} {middleInitial}.
        </Typography>
      );
    },
  },
  {
    minWidth: 90,
    headerName: "Actions",
    field: "actions",
    description: "Actions to perform",
    sortable: false,
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />,
  },
];

const UpcomingCheckup: NextPage = () => {
  const { data: session } = useSession();
  const { data: vitalSignsData, status: vitalSignsDataStatus } =
    getVitalSignsToday();

  const [paginationModel, setPaginationModel] = useState<{
    pageSize: number;
    page: number;
  }>({
    pageSize: 10,
    page: 0,
  });

  return (
    <Box width="100%">
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <DataGrid
            autoHeight
            loading={vitalSignsDataStatus === "loading"}
            rows={
              vitalSignsData && vitalSignsData?.length > 0 ? vitalSignsData : []
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
        </CardContent>
      </Card>
    </Box>
  );
};

UpcomingCheckup.acl = {
  action: "read",
  subject: "upcoming checkup",
};

export default UpcomingCheckup;
