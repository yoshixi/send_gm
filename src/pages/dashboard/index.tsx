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
  DialogActions,
  DialogContentText,
  Card,
  IconButton,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Dashboard from "@/components/layouts/Dashboard";
import Title from "@/components/ui/Title";
import AddIcon from "@mui/icons-material/Add";
import { useAuthentication } from "@/hooks/authentication";
import { useGmail, EMAIL_REGEX } from "@/hooks/gmail";
import { useMessageTemplates } from "@/hooks/messageTemplate";
import { MessageTemplate } from "@/models";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import HelpIcon from "@mui/icons-material/Help";
import { indigo } from "@mui/material/colors";
import Papa from "papaparse";

const SENDER_TABLE_COLUMNS = [
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
  const handleConfirmDialogOpen = useCallback((value: boolean) => {
    setConfirmDialogOpen(value);
  }, []);

  const [importSenderDialogOpen, setImportSenderDialogOpen] = useState(false);
  const handleImportSenderDialogOpen = useCallback((value: boolean) => {
    setImportSenderDialogOpen(value);
  }, []);

  const [
    sentEmailSuccessfullySnackbarOpen,
    setSentEmailSuccessfullySnackBarOpen,
  ] = useState(false);
  const handleSentEmailSuccessfullySnackbarOpen = useCallback(
    (value: boolean) => {
      console.log("aa");
      setSentEmailSuccessfullySnackBarOpen(value);
    },
    []
  );

  const [senderRowsData, setSenderRowsData] = useState<SenderRow[]>([]);
  const senderRows = useMemo(
    () => senderRowsData.map((v, i) => ({ ...v })),
    [senderRowsData]
  );
  const addSenderRows = () => {
    const ids: number[] = senderRowsData.map((v) => v.id).filter<number>((v): v is number => typeof v === 'number');
    const  max = ids.length === 0 ? 0 : Math.max(...ids);
    const newRow: SenderRow = { email: "", name: "", id: max + 1 };
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
  const {
    messageTemplates,
    selectedTemplate,
    setSelectedTemplate,
    replaceSelectedTemplateMessageTags,
  } = useMessageTemplates();
  useEffect(() => {
    if (!selectedTemplate?.subject) return;

    setSubject(selectedTemplate?.subject);
  }, [selectedTemplate]);

  const firstSendMessage = useMemo(
    () => {
      const firstRow = senderRowsData[0]
      if (senderRowsData.length === 0) return '';

      return replaceSelectedTemplateMessageTags({
        to: firstRow.email,
        arg1,
        arg2,
        toName: firstRow.name,
      })
    },
    [senderRowsData, arg1, arg2, replaceSelectedTemplateMessageTags]
  );

  const handleSendMailClick = useCallback(() => {
    const sendGmails = senderRows.map((row) => {
      const to = row.email;
      return sendGmail({
        to,
        from: currentUser?.email || "",
        subject: subject,
        message: replaceSelectedTemplateMessageTags({
          to,
          arg1,
          arg2,
          toName: row.name,
        }),
      });
    });

    return Promise.all(sendGmails)
      .then((res) => setSentEmailSuccessfullySnackBarOpen(true))
      .catch((e) => alert(`送信に失敗しました ${e}`));
  }, [
    currentUser?.email,
    arg1,
    arg2,
    subject,
    senderRows,
    sendGmail,
    replaceSelectedTemplateMessageTags,
  ]);

  const handleCsvFileUpload = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      if (!e.currentTarget.files) {
        alert("no file");
        return;
      }
      const file = e.currentTarget.files[0];
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data as string[][];
          const rowsIds: number[] = senderRowsData.map((v) => v.id).filter<number>((v): v is number => typeof v === 'number');
          const  max = rowsIds.length === 0 ? 0 : Math.max(...rowsIds);
          const newRows = data
            .map<SenderRow>((row, index) => {
              return {
                id: index + max + 1,
                name: row[0],
                email: row[1],
              };
            })
            .filter((row) => EMAIL_REGEX.test(row.email));
          setSenderRowsData([...senderRowsData, ...newRows]);
          setImportSenderDialogOpen(false);
        },
      });
    },
    [senderRowsData, setSenderRowsData]
  );

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
                label="*|MERGE1|* を置き換える文字列"
                placeholder="Placeholder"
                sx={{ mr: 2, width: "30%" }}
                multiline
                onChange={handleArg1Change}
              />
              <TextField
                id="outlined-textarea"
                label="*|MERGE2|* を置き換える文字"
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
                onClick={() => handleConfirmDialogOpen(true)}
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
                  onClick={() => handleImportSenderDialogOpen(true)}
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
                  onClick={() => handleConfirmDialogOpen(true)}
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
                columns={SENDER_TABLE_COLUMNS}
                onCellEditCommit={changeCell}
                hideFooter
              />
            </Box>
          </Paper>
        </Grid>

        {/* // Confirm Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => handleConfirmDialogOpen(false)}
          fullWidth
          sx={{ p: 2 }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>
            テンプレート編集
          </DialogTitle>
          <DialogContent sx={{ minHeight: 540 }}>
            <DialogContentText sx={{ pt: 2, fontWeight: 'bold' }}>以下の内容で送信します。</DialogContentText>
            <DialogContentText sx={{ pt: 1, mb: 2, fontWeight: 'bold' }}>* タグの箇所は最初の送信先に置換えて表示されています。</DialogContentText>
            <DialogContentText sx={{ pt: 2, mb: 2, color: 'black', fontSize: '1.3rem' }}>{firstSendMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="text" sx={{ color: 'gray' }} onClick={() => handleConfirmDialogOpen(false)}>キャンセル</Button>
            <Button variant="contained" onClick={handleSendMailClick} autoFocus>
              送信
            </Button>
        </DialogActions>
        </Dialog>

        {/* Import Data Dialog */}
        <Dialog
          open={importSenderDialogOpen}
          onClose={() => handleImportSenderDialogOpen(false)}
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
            <Grid sx={{ px: 1, mb: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  minHeight: 50,
                  bgcolor: indigo[50],
                  color: "primary.main",
                  p: 1,
                }}
              >
                <Typography variant="body1" gutterBottom>
                  以下のようなCSVファイルをアップロードしてください。
                </Typography>
                <Button
                  variant="text"
                  sx={{ fontWeight: "bold" }}
                  startIcon={<DownloadIcon />}
                >
                  サンプルをダウンロード
                </Button>
              </Paper>
            </Grid>
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
        <Snackbar
          open={sentEmailSuccessfullySnackbarOpen}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={() => handleSentEmailSuccessfullySnackbarOpen(false)}
        >
          <Alert
            onClose={() => handleSentEmailSuccessfullySnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>
              送信に成功しました
            </AlertTitle>

          </Alert>
        </Snackbar>
      </Grid>
    </Dashboard>
  );
}
