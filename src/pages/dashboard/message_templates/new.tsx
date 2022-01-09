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

const Id = () => {
  const router = useRouter();
  const open = true;

  const handleClose = () => {
    router.push("/dashboard/message_templates");
  };

  const { id } = router.query;
  const description =
    "$arg1 $arg2 と記述すると、内容を送信時に内容を置き換えることができます。";

  return (
    <Index>
      <>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <FormControl fullWidth className="mb-6">
              <TextField
                id="outlined-multiline-static"
                label="件名"
                multiline
                rows={1}
                defaultValue=""
                className="mb-6"
              />
              <TextField
                id="outlined-multiline-static"
                label="本文"
                multiline
                rows={10}
                defaultValue=""
              />
            </FormControl>
            <DialogContentText className="mb-6">
              {description}
            </DialogContentText>
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
