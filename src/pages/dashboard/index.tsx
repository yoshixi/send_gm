import { useState, useEffect, useMemo, useCallback, FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
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
  Card,
  IconButton,
} from "@mui/material";
import { GridEvents, GridEventListener } from "@mui/x-data-grid";
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HelpIcon from "@mui/icons-material/Help";
import Papa from "papaparse";

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
    name: "yoshixj4",
    email: "yoshixj4@gmail.com",
  },
  {
    name: "yoshiwebxj",
    email: "yoshiwebxj@gmail.com",
  },
  {
    name: "y.masubuchi-nicola",
    email: "y.masubuchi@nicola-inc.co.jp",
  },
];

const columns = [
  { field: "id", headerName: "#", width: 100, editable: false },
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

interface SenderRow {
  id?: number;
  name: string;
  email: string;
}

export default function Index() {
  const [senderEmail, setSenderEmail] = useState("");
  const handleSenderEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSenderEmail(event.target.value);
  };

  const [subject, setSubject] = useState("");
  const handleSubjectChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSubject(event.target.value);
    },
    []
  );

  const [arg1, setArg1] = useState("");
  const handleArg1Change = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setArg1(event.target.value);
    },
    []
  );

  const [arg2, setArg2] = useState("");
  const handleArg2Change = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setArg2(event.target.value);
    },
    []
  );

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [importSenderDialogOpen, setImportSenderDialogOpen] = useState(false);

  const [senderRowsData, setSenderRowsData] = useState<SenderRow[]>([]);
  const senderRows = useMemo(
    () => senderRowsData.map((v, i) => ({ ...v, id: i })),
    [senderRowsData]
  );
  const addSenderRows = () => {
    const newRow: SenderRow = { email: "", name: "" };
    setSenderRowsData([...senderRowsData, newRow]);
  };
  const changeCell = (v: any) => {
    const rows = [...senderRows];
    const idx = rows.findIndex(
      (d) => d.id == v.id
    ); /* 該当データのindexを取得 */

    // @ts-ignore:next-line
    rows[idx][v.field] = v.value;
    setSenderRowsData(rows); /* 編集されたデータを置き換える */
  };
  const deleteSenderRow = (id: number) => {
    const newRows = senderRowsData.filter((row) => !(row.id === id));
    setSenderRowsData(newRows);
  };

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

  const handleCsvFileUpload = useCallback((e: FormEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      alert("no file");
      return;
    }
    const file = e.target.files[0];
    const data = Papa.parse(file, {
      complete: (results) => {
        console.log(data);
        debugger;
      },
    });
  }, []);

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
                  onClick={() => setImportSenderDialogOpen(true)}
                  color="primary"
                  size="small"
                  variant="contained"
                  disableElevation
                  startIcon={<AddIcon />}
                  sx={{ fontWeight: "bold", mr: 1 }}
                >
                  送信先をインポート
                </Button>
                <Button
                  onClick={addSenderRows}
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
              <DataGrid
                rows={senderRows}
                columns={columns}
                onCellEditCommit={changeCell}
                hideFooter
              />
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
        <Dialog
          open={importSenderDialogOpen}
          onClose={() => setImportSenderDialogOpen(false)}
          fullWidth
          sx={{ p: 2 }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>
            インポート
            <IconButton
              aria-label="delete"
              sx={{ position: "relative", top: "-5px", right: "3px" }}
            >
              <HelpIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ minHeight: 180, minWidth: 600, px: 0 }}>
            <Grid container justifyContent="space-around" sx={{ px: 1 }}>
              <Grid item>
                <label htmlFor="csvFileUploadInput">
                  <input
                    type="file"
                    name="csvFileUploadInput"
                    id="csvFileUploadInput"
                    style={{ display: "none" }}
                    onInput={handleCsvFileUpload}
                  />
                  <Card
                    variant="outlined"
                    sx={{
                      height: 140,
                      width: 180,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <Box sx={{ width: "100%", p: 1 }}>
                      <Box
                        sx={{
                          mx: "auto",
                          textAlign: "center",
                          height: 70,
                          mb: 2,
                        }}
                      >
                        <CloudUploadIcon
                          fontSize="large"
                          sx={{ width: "3em", height: "3em" }}
                        />
                      </Box>
                      <Typography
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        CSVファイルをアップロード
                      </Typography>
                    </Box>
                  </Card>
                </label>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    </Dashboard>
  );
}
