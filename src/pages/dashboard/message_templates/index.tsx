import { useRouter } from "next/router";
import {
  Grid,
  Box,
  Paper,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Dashboard from "@/components/layouts/Dashboard";
import Title from "@/components/ui/Title";
import { useAuthentication } from "@/hooks/authentication";
import { useMessageTemplates } from "@/hooks/messageTemplate";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import type { ReactChild, ReactChildren } from "react";

interface Props {
  children?: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

const Index = (props: Props) => {
  const router = useRouter();
  const { currentUser, userGoogleCred } = useAuthentication();
  const { messageTemplates } = useMessageTemplates();

  const templateNames = [{ name: "template1" }, { name: "template2" }];

  return (
    <Dashboard currentUser={currentUser}>
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Title>送信内容</Title>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() =>
                    router.push("/dashboard/message_templates/new")
                  }
                >
                  <AddIcon sx={{ mr: 1 }} />
                  新規追加
                </Button>
              </Box>
              <Box>
                <List>
                  {messageTemplates.map((row, index) => {
                    return (
                      <ListItemButton
                        key={row.id}
                        onClick={() =>
                          router.push(`/dashboard/message_templates/${row.id}`)
                        }
                      >
                        <ListItemIcon>
                          <InsertDriveFileIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={row.subject}
                          secondary={row.message}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        {props.children}
      </>
    </Dashboard>
  );
};

export default Index;
