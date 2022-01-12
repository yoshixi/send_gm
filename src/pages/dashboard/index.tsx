import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Grid,
  Box,
  Button,
  Paper,
  TextField,
  Autocomplete,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Dashboard from "@/components/layouts/Dashboard";
import Title from "@/components/ui/Title";
import AddIcon from "@mui/icons-material/Add";
import { useAuthentication } from "@/hooks/authentication";
import { useGmail } from "@/hooks/gmail";
import { useMessageTemplates } from "@/hooks/messageTemplate";
import { MessageTemplate } from "@/models";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";

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

  const [arg1, setArg1] = useState("");
  const handleArg1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArg1(event.target.value);
  };

  const [arg2, setArg2] = useState("");
  const handleArg2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArg2(event.target.value);
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const { currentUser } = useAuthentication();
  useEffect(() => {
    if (!currentUser?.email) return;

    setSenderEmail(currentUser?.email);
  }, [currentUser]);

  const { sendGmail } = useGmail();
  const { messageTemplates, selectedTemplate, setSelectedTemplate } =
    useMessageTemplates();
  useEffect(() => {
    if (!selectedTemplate?.subject) return;

    setSubject(selectedTemplate?.subject);
  }, [selectedTemplate]);

  const sendMessage = useMemo(() => {
    return selectedTemplate?.message;
  }, [selectedTemplate]);

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
              <Autocomplete
                id="size-small-outlined"
                size="medium"
                sx={{ mr: 1, width: "30%" }}
                options={messageTemplates}
                getOptionLabel={(option) => option.subject}
                value={selectedTemplate}
                style={{ display: "inline-block" }}
                onChange={(event: any, newValue: MessageTemplate | null) => {
                  setSelectedTemplate(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="テンプレート" />
                )}
              />
              <TextField
                label="差出人メールアドレス"
                id="outlined-size-small"
                defaultValue="sender@gmail.com"
                size="medium"
                sx={{ mr: 1, width: "30%" }}
                value={senderEmail}
                onChange={handleSenderEmailChange}
              />
              <TextField
                label="件名"
                id="outlined-size-small"
                defaultValue="sender@gmail.com"
                value={subject}
                size="medium"
                sx={{ mr: 1, width: "30%" }}
                onChange={handleSubjectChange}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                置き換え文字列
              </Typography>
              <TextField
                id="outlined-textarea"
                label="変数1 ($arg1 を置き換える文字列) "
                placeholder="Placeholder"
                sx={{ mr: 2, width: "30%" }}
                multiline
                onChange={handleArg1Change}
              />
              <TextField
                id="outlined-textarea"
                label="変数2 ($arg2 を置き換える文字列)"
                sx={{ mr: 2, width: "30%" }}
                multiline
                onChange={handleArg2Change}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                disableElevation
                startIcon={<CheckIcon />}
                size="small"
                sx={{ fontWeight: "bold" }}
                onClick={() => setConfirmDialogOpen(true)}
              >
                送信内容を確認
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Title>送信先</Title>
              <Box>
                <Button
                  onClick={handleSendMailClick}
                  color="primary"
                  size="small"
                  variant="contained"
                  disableElevation
                  startIcon={<AddIcon />}
                  sx={{ fontWeight: "bold", mr: 1 }}
                >
                  送信先を追加
                </Button>
                <Button
                  onClick={handleSendMailClick}
                  color="primary"
                  size="small"
                  variant="contained"
                  disableElevation
                  startIcon={<SendIcon />}
                  sx={{ fontWeight: "bold" }}
                >
                  送信
                </Button>
              </Box>
            </Box>
            <Box sx={{ height: 420, width: "100%" }}>
              <DataGrid rows={rows} columns={columns} hideFooter />
            </Box>
          </Paper>
        </Grid>
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          fullWidth
          sx={{ p: 2 }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>
            テンプレート編集
          </DialogTitle>
          <DialogContent sx={{ minHeight: 540 }}>
            <DialogContentText sx={{ mb: 2 }}>{sendMessage}</DialogContentText>
          </DialogContent>
        </Dialog>
      </Grid>
    </Dashboard>
  );
}
