import { useRouter } from "next/router";
import { ChangeEvent } from "react";
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
} from "@mui/material";
import { useMessageTemplate } from "@/hooks/messageTemplate";
import { useAuthentication } from "@/hooks/authentication";
import { MessageTemplate } from "@/models";

const Id = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const open = true;

  const { messageTemplate, setMessageTemplate, updateTemplate } =
    useMessageTemplate(id);
  const { currentUser } = useAuthentication();

  const handleMessageTemplateChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setMessageTemplate({
      ...messageTemplate,
      [event.target.name]: event.target.value,
    } as MessageTemplate);
  };

  const handleClose = () => {
    router.push("/dashboard/message_templates");
  };

  const handleOnSaveClick = async () => {
    if (!messageTemplate) return;

    await updateTemplate(messageTemplate);
    router.push("/dashboard/message_templates");
  };

  const description =
    "$arg1 $arg2 と記述すると、内容を送信時に内容を置き換えることができます。";

  return (
    <Index>
      <>
        <Dialog open={open} onClose={handleClose} fullWidth sx={{ p: 2 }}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            テンプレート編集
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2, pt: 2 }}>
              <TextField
                label="件名"
                multiline
                rows={1}
                name="subject"
                value={messageTemplate?.subject}
                sx={{ mb: 2 }}
                onChange={handleMessageTemplateChange}
              />
              <TextField
                label="本文"
                name="message"
                multiline
                value={messageTemplate?.message}
                rows={20}
                onChange={handleMessageTemplateChange}
              />
            </FormControl>
            <DialogContentText sx={{ mb: 2 }}>{description}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button onClick={handleOnSaveClick}>保存</Button>
          </DialogActions>
        </Dialog>
      </>
    </Index>
  );
};

export default Id;
