import { useRouter } from "next/router";
import { useState, ChangeEvent } from "react";
import Index from "./index";
import {
  Dialog,
  Button,
  TextField,
  FormControl,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { MessageTemplate } from "@/models";
import { createTemplate } from "@/hooks/messageTemplate";
import { useAuthentication } from "@/hooks/authentication";

const open = true;
const Id = () => {
  const router = useRouter();
  const [messageTemplate, setMessageTemplate] = useState<MessageTemplate>({
    subject: "",
    message: "",
  });
  const { currentUser } = useAuthentication();
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(true);

  const handlePageClose = () => {
    router.push("/dashboard/message_templates");
  };

  const handleMessageTemplateChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setMessageTemplate({
      ...messageTemplate,
      [event.target.name]: event.target.value,
    });
  };

  const handleOnSaveClick = async () => {
    if (!currentUser || !currentUser.uid) {
      return;
    }

    await createTemplate(currentUser?.uid, messageTemplate);
    router.push("/dashboard/message_templates");
  };

  const { id } = router.query;
  const description =
    "$arg1 $arg2 と記述すると、内容を送信時に内容を置き換えることができます。";

  return (
    <Index>
      <>
        <Snackbar
          color="primary"
          open={openSnackBar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackBar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            This is a success message!
          </Alert>
        </Snackbar>
        <Dialog open={open} onClose={handlePageClose} fullWidth sx={{ p: 2 }}>
          <DialogTitle sx={{ fontWeight: "bold" }}>新規作成</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                id="outlined-multiline-static"
                label="件名"
                multiline
                rows={1}
                name="subject"
                defaultValue=""
                sx={{ mb: 2 }}
                onChange={handleMessageTemplateChange}
              />
              <TextField
                id="outlined-multiline-static"
                label="本文"
                multiline
                name="message"
                rows={20}
                defaultValue=""
                onChange={handleMessageTemplateChange}
              />
            </FormControl>
            <DialogContentText sx={{ mb: 2 }}>{description}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePageClose}>キャンセル</Button>
            <Button onClick={handleOnSaveClick}>保存</Button>
          </DialogActions>
        </Dialog>
      </>
    </Index>
  );
};

export default Id;
