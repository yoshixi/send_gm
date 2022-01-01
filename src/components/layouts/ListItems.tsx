import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import { EmailOutlined, Article, History } from "@mui/icons-material";

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <EmailOutlined />
      </ListItemIcon>
      <ListItemText primary="メール送信" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Article />
      </ListItemIcon>
      <ListItemText primary="テンプレート" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <History />
      </ListItemIcon>
      <ListItemText primary="送信履歴" />
    </ListItem>
  </div>
);

export default mainListItems;
