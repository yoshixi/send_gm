import { useRouter } from "next/router";
import { useState } from "react";
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
import { grey } from "@mui/material/colors";
import { useMessageTemplate } from "@/hooks/messageTemplate";

const Id = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const open = true;

  const { messageTemplate } = useMessageTemplate(id);

  const handleClose = () => {
    router.push("/dashboard/message_templates");
  };

  const description =
    "$arg1 $arg2 と記述すると、内容を送信時に内容を置き換えることができます。";

  return (
    <Index>
      <>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            テンプレート作成
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                id="outlined-multiline-static"
                label="件名"
                multiline
                rows={1}
                value={messageTemplate?.subject}
                sx={{ mb: 2 }}
              />
              <TextField
                id="outlined-multiline-static"
                label="本文"
                multiline
                value={messageTemplate?.message}
                rows={20}
                defaultValue=""
              />
            </FormControl>
            <DialogContentText sx={{ mb: 2 }}>{description}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button onClick={handleClose}>保存</Button>
          </DialogActions>
        </Dialog>
      </>
    </Index>
  );
};

export default Id;
