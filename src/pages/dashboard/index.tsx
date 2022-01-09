import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Grid,
  Box,
  Button,
  Paper,
  TextField,
  Autocomplete,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Dashboard from "@/components/layouts/Dashboard";
import Title from "@/components/ui/Title";
import AddIcon from "@mui/icons-material/Add";
import { useAuthentication } from "@/hooks/authentication";
import { useGmail } from "@/hooks/gmail";

// const rows = Array(100)
//   .fill(null)
//   .map((u, i) => {
//     return {
//       id: i,
//       name: "name",
//       email: "aaaa@gmail.com",
//     };
//   });
const rows = [
  {
    id: 1,
    name: "yoshixj4",
    email: "yoshixj4@gmail.com",
  },
  {
    id: 2,
    name: "yoshiwebxj",
    email: "yoshiwebxj@gmail.com",
  },
  {
    id: 2,
    name: "y.masubuchi-nicola",
    email: "y.masubuchi@nicola-inc.co.jp",
  },
];

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

  const [senderEmail, setSenderEmail] = useState("");
  const handleSenderEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSenderEmail(event.target.value);
  };

  const [subject, setSubject] = useState("");
  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  const { currentUser, userGoogleCred } = useAuthentication();

  const { sendGmail } = useGmail();

  const handleSendMailClick = () => {
    const sendGmails = rows.map((row) => {
      return sendGmail({
        to: row.email,
        from: currentUser?.email || "",
        subject: "subject",
        message: `hello ${row.name}`,
      });
    });
    return Promise.all(sendGmails)
      .then(() => alert("send gmail success"))
      .catch((e) => alert(e));
  };

  return (
    <Dashboard currentUser={currentUser}>
      <Grid container spacing={2} sx={{ minHeight: "80%", height: "80%" }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Title>送信内容</Title>
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="差出人メールアドレス"
                id="outlined-size-small"
                defaultValue="sender@gmail.com"
                size="small"
                sx={{ mr: 1, width: "16%" }}
                onChange={handleSenderEmailChange}
              />
              <TextField
                label="件名"
                id="outlined-size-small"
                defaultValue="sender@gmail.com"
                size="small"
                sx={{ mr: 1, width: "16%" }}
                onChange={handleSubjectChange}
              />
              <Autocomplete
                id="size-small-outlined"
                size="small"
                sx={{ mr: 1, width: "16%" }}
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
            <Box>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                置き換え文字列
              </Typography>
              <TextField
                id="outlined-textarea"
                label="変数1 ($arg1 を置き換える文字列) "
                placeholder="Placeholder"
                sx={{ mr: 2, width: "30%" }}
                multiline
              />
              <TextField
                id="outlined-textarea"
                label="変数2 ($arg2 を置き換える文字列)"
                sx={{ mr: 2, width: "30%" }}
                multiline
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Title>送信先</Title>
              <Button
                onClick={handleSendMailClick}
                color="primary"
                startIcon={<AddIcon />}
              >
                SentEmail
              </Button>
            </Box>
            <Box sx={{ height: 520, width: "100%" }}>
              <DataGrid rows={rows} columns={columns} hideFooter />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Dashboard>
  );
}
