// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

interface TableHeaderProps {
  value: string;
  toggle: (() => void) | ((id: number) => void);
  handleFilter: (val: string) => void;
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props;

  return (
    <Box>
      <Box
        sx={{
          px: 5,
          pt: 5,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Button
          sx={{ mr: 4 }}
          color='secondary'
          variant='outlined'
          startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
        >
          Export
        </Button>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end' }}>
          <TextField
            size='small'
            value={value}
            sx={{ mr: 6 }}
            placeholder='Search Patient'
            onChange={e => handleFilter(e.target.value)}
          />
          {/* uses onAdd from the store */}
          <Button variant='contained' onClick={() => toggle()}>
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TableHeader;
