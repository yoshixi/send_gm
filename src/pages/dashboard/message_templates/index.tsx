import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Grid,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Dashboard from "@/components/layouts/Dashboard";
import Title from "@/components/ui/Title";
import { useAuthentication } from "@/hooks/authentication";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import type { ReactChild, ReactChildren } from "react";

interface Props {
  children?: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

const Index = (props: Props) => {
  const router = useRouter();
  const { currentUser, userGoogleCred } = useAuthentication();

  const templateNames = [{ name: "template1" }, { name: "template2" }];

  return (
    <Dashboard currentUser={currentUser}>
      <>
        <Grid container spacing={2} className="min-h-80 h-5/6">
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box className="flex justify-between mb-4">
                <Title>送信内容</Title>
              </Box>
              <Box>
                <List>
                  {templateNames.map((row) => {
                    return (
                      <ListItemButton
                        key={row.name}
                        onClick={() =>
                          router.push(`/dashboard/message_templates/2`)
                        }
                      >
                        <ListItemIcon>
                          <InsertDriveFileIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Single-line item"
                          secondary={"Secondary text"}
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
