import { useState } from "react";
import type { ReactElement } from "react";
import {
  Grid,
  Box,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Dashboard from "@/components/layouts/Dashboard";
import Title from "@/components/ui/Title";
import AddIcon from "@mui/icons-material/Add";

const rows = Array(100)
  .fill(null)
  .map((u, i) => {
    return {
      id: i,
      name: "name",
      email: "aaaa@gmail.com",
    };
  });
const columns = [
  { field: "name", headerName: "名前", width: 180, editable: true },
  {
    field: "email",
    headerName: "Email",
    type: "string",
    width: 200,
    editable: true,
  },
];

// wil remove
const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
];

export default function Index() {
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <Grid container spacing={2} className="min-h-80 h-5/6">
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box className="flex justify-between mb-4">
            <Title>送信内容</Title>
            <Button color="primary" startIcon={<AddIcon />}>
              Add record
            </Button>
          </Box>
          <Box>
            <TextField
              label="差出人メールアドレス"
              id="outlined-size-small"
              defaultValue="sender@gmail.com"
              size="small"
              className="mr-4 w-1/6"
            />
            <TextField
              label="件名"
              id="outlined-size-small"
              defaultValue="sender@gmail.com"
              size="small"
              className="mr-4 w-1/6"
            />
            <Autocomplete
              id="size-small-outlined"
              size="small"
              className="mr-4 w-1/6"
              options={top100Films}
              getOptionLabel={(option) => option.title}
              defaultValue={top100Films[1]}
              style={{ display: "inline-block" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="テンプレート"
                  placeholder="Favorites"
                />
              )}
            />
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Box className="flex justify-between mb-4">
            <Title>送信先</Title>
            <Button color="primary" startIcon={<AddIcon />}>
              Add record
            </Button>
          </Box>
          <div style={{ height: 520, width: "100%" }}>
            <DataGrid rows={rows} columns={columns} hideFooter />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}
Index.getLayout = function getLayout(page: ReactElement) {
  return <Dashboard>{page}</Dashboard>;
};
