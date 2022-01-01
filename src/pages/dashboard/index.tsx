import * as React from "react";
import type { ReactElement } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  useGridApiRef,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import Dashboard from "@/components/layouts/Dashboard";

const rows = [
  {
    id: 1,
    name: "name",
    email: "aaaa@gmail.com",
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
  {
    id: 2,
    name: "name",
    email: "aaaa@gmail.com",
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
  {
    id: 3,
    name: "name",
    email: "aaaa@gmail.com",
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
  {
    id: 4,
    name: "name",
    email: "aaaa@gmail.com",
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
];

export default function Index() {
  const columns = [
    { field: "name", headerName: "名前", width: 180, editable: true },
    { field: "email", headerName: "Email", type: "string", editable: true },
    {
      field: "dateCreated",
      headerName: "Date Created",
      type: "date",
      width: 180,
      editable: true,
    },
    {
      field: "lastLogin",
      headerName: "Last Login",
      type: "dateTime",
      width: 220,
      editable: true,
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
        background: "white",
      }}
    >
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
}
Index.getLayout = function getLayout(page: ReactElement) {
  return <Dashboard>{page}</Dashboard>;
};
