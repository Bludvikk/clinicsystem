import { MouseEvent, useState } from 'react';

import Link from 'next/link';

import { Menu, Grid, Card, Box, MenuItem, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import Icon from 'src/@core/components/icon';
import { ThemeColor } from '@/@core/layouts/types';

import toast from 'react-hot-toast';
import moment from 'moment';

import { deleteCheckup, getCheckups } from '@/server/hooks/checkup';
import { CheckupsType } from '@/utils/db.type';
import CheckupTableHeader from '@/views/apps/checkup/list/CheckupTableHeader';
import { useCheckupFormStore } from '@/stores/checkup.store';
import { useSession } from 'next-auth/react';

interface CheckupStatusType {
  [key: string]: ThemeColor;
}

interface CellType {
  row: CheckupsType;
}

const checkupStatusObj: CheckupStatusType = {
  pending: 'warning',
  completed: 'success',
  cancelled: 'error'
};

const RowOptions = ({ id }: { id: number; status?: string }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleRowOptionsClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>

      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:checkup-list' fontSize={20} />
          CheckUp
        </MenuItem>
        {status && status === 'completed' ? (
          <MenuItem sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:checkup-list' fontSize={20} />
            CheckUp
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
};

const PhysicianCheckupTableList = () => {
  const { data: session } = useSession();
  const [paginationModel, setPaginationModel] = useState<{ pageSize: number; page: number }>({ pageSize: 10, page: 0 });

  const { showDialog, searchFilter } = useCheckupFormStore();
  const { data: checkupsData, status: checkupsDataStatus } = getCheckups({
    searchFilter: { ...searchFilter, dropDown: { physicianId: session?.user.id } }
  });

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 150,
      headerName: 'Date',
      field: 'createdAt',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {moment(row.createAt).format('LL')}
          </Typography>
        );
      }
    },
    {
      flex: 0.15,
      minWidth: 200,
      headerName: 'Patient',
      field: 'fullname',
      renderCell: ({ row }: CellType) => {
        const {
          patient: { firstName, lastName }
        } = row;

        return (
          <Typography noWrap variant='body2'>
            {lastName}, {firstName}
          </Typography>
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      headerName: 'Physician',
      field: 'physician',
      renderCell: ({ row }: CellType) => {
        const {
          physician: { firstName, lastName }
        } = row;

        return (
          <Typography noWrap variant='body2'>
            {firstName} {lastName}
          </Typography>
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      headerName: 'Added By',
      field: 'receptionist',
      renderCell: ({ row }: CellType) => {
        const {
          receptionist: { firstName, lastName }
        } = row;

        return (
          <Typography noWrap variant='body2'>
            {lastName}, {firstName}
          </Typography>
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 150,
      headerName: 'Follow Up',
      field: 'followUp',
      renderCell: ({ row }: CellType) => {
        return row && row.followUp ? (
          <Typography noWrap variant='body2'>
            {moment(row.followUp).format('LL')}
          </Typography>
        ) : null;
      }
    },
    {
      flex: 0.08,
      minWidth: 135,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return row && row.status ? (
          <CustomChip
            skin='light'
            size='small'
            label={row.status.name}
            color={checkupStatusObj[row.status.code.toLowerCase()]}
            sx={{ textTransform: 'capitalize' }}
          />
        ) : null;
      }
    },
    {
      flex: 0.08,
      minWidth: 90,
      headerName: 'Actions',
      field: 'actions',
      description: 'Actions to perform',
      sortable: false,
      renderCell: ({ row }: CellType) => <RowOptions id={row.id} status={row.status.code} />
    }
  ];

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CheckupTableHeader />

          <DataGrid
            autoHeight
            loading={checkupsDataStatus === 'loading'}
            rows={checkupsData && checkupsData.length > 0 ? checkupsData : []}
            columns={columns}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { pageSize: paginationModel.pageSize }
              }
            }}
            pageSizeOptions={[10, 15, 20]}
            onPaginationModelChange={setPaginationModel}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default PhysicianCheckupTableList;
