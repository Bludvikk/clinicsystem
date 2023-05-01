import { MouseEvent, useRef, useState } from 'react';

import Link from 'next/link';

import { Menu, Grid, Card, MenuItem, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import Icon from 'src/@core/components/icon';
import { ThemeColor } from '@/@core/layouts/types';

import toast from 'react-hot-toast';
import moment from 'moment';

import { deleteCheckup, getCheckups } from '@/server/hooks/checkup';
import { CheckupsType, ReferencesEntityType } from '@/utils/db.type';
import CheckupTableHeader from './CheckupTableHeader';
import { useCheckupFormStore } from '@/stores/checkup.store';
import CanView from '@/layouts/components/acl/CanView';
import DialogScroll from './DialogScroll';
import { useSession } from 'next-auth/react';
import { usePDF } from '@react-pdf/renderer';
import { handlePrintPDF } from '@/utils/helper';
import PrescriptionPDF from './PrescriptionPDF';
import { getReferences } from '@/server/hooks/reference';

interface CheckupStatusType {
  [key: string]: ThemeColor;
}

interface CellType {
  row: CheckupsType;
}

interface CheckupTableListPropsType {
  physicianId?: number;
}

const checkupStatusObj: CheckupStatusType = {
  pending: 'warning',
  completed: 'success',
  cancelled: 'error'
};

const RowOptions = ({
  id,
  checkupStatus,
  medicinesData
}: {
  id: number;
  checkupStatus?: string;
  medicinesData: ReferencesEntityType[];
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const iframeRef = useRef(null);
  const [instance, updateInstance] = usePDF({
    document: PrescriptionPDF({ id, medicinesData })
  });

  const { onEdit } = useCheckupFormStore();
  const { mutate: deleteCheckupMutate } = deleteCheckup();

  const handleRowOptionsClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleRowOptionsClose = () => setAnchorEl(null);

  const handleEdit = (id: number) => onEdit(id);
  const handleDelete = (id: number) => {
    deleteCheckupMutate(
      { id, module: 'Checkup' },
      {
        onSuccess: data => toast.success(data.message),
        onError: err => toast.error(`Error deleting: ${err}`)
      }
    );
  };

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
        <MenuItem component={Link} sx={{ '& svg': { mr: 2 } }} href='/'>
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        {checkupStatus && checkupStatus !== 'completed' && (
          <CanView action='update' subject='checkup-vital-signs'>
            <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleEdit(id)}>
              <Icon icon='mdi:pencil-outline' fontSize={20} />
              Edit
            </MenuItem>
          </CanView>
        )}
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleDelete(id)}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
        <CanView action='create' subject='checkup'>
          <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleEdit(id)}>
            <Icon icon='tabler:checkup-list' fontSize={20} />
            CheckUp
          </MenuItem>
        </CanView>
        {checkupStatus && checkupStatus === 'completed' && (
          <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handlePrintPDF({ pdfDocument: instance, iframeRef })}>
            <Icon icon='mdi:prescription' fontSize={20} />
            Print
            <iframe ref={iframeRef} style={{ display: 'none' }}></iframe>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const CheckupTableList = ({ physicianId }: CheckupTableListPropsType) => {
  const { data: session } = useSession();
  const [paginationModel, setPaginationModel] = useState<{ pageSize: number; page: number }>({ pageSize: 10, page: 0 });

  const { showDialog, searchFilter } = useCheckupFormStore();
  const { data: checkupsData, status: checkupsDataStatus } = getCheckups({ searchFilter });
  const { data: medicinesData, status: medicinesDataStatus } = getReferences({ entities: [9] });

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 150,
      headerName: 'Date',
      field: 'createdAt',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {moment(row.createdAt).format('LL')}
          </Typography>
        );
      }
    },
    {
      flex: 0.1,
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
    ...(!physicianId
      ? [
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
          }
        ]
      : []),
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
            {session && session.user.id === row.receptionistId ? 'Me' : `${lastName}, ${firstName}`}
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
      renderCell: ({ row }: CellType) => (
        <RowOptions
          id={row.id}
          checkupStatus={row.status.code}
          medicinesData={
            medicinesDataStatus === 'loading'
              ? []
              : (JSON.parse(JSON.stringify(medicinesData)) as ReferencesEntityType[])
          }
        />
      )
    }
  ];

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CheckupTableHeader physicianId={physicianId} />

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

      {showDialog ? <DialogScroll formId='checkup-form-dialog' maxWidth='lg' /> : null}
    </Grid>
  );
};

export default CheckupTableList;
