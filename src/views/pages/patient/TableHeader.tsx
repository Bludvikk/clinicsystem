// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import AddUserWizard from "@/views/AddUserDialogWizard";
interface TableHeaderProps {
  value: string;
  toggle: () => void;
  handleFilter: (val: string) => void;
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props;

  return (
    <div>
      <Box
        sx={{
          px: 5,
          pt: 5,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          sx={{ mr: 4, mb: 2 }}
          color="secondary"
          variant="outlined"
          startIcon={<Icon icon="mdi:export-variant" fontSize={20} />}
        >
          Export
        </Button>

        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            size="small"
            value={value}
            sx={{ mr: 6, mb: 2, mt: 2}}
            placeholder="Search Patient"
            onChange={(e) => handleFilter(e.target.value)}
          />

          <AddUserWizard />
        </Box>
      </Box>
    </div>
  );
};

export default TableHeader;
