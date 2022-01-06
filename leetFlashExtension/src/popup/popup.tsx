import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import "./popup.css";
import { SxProps, Theme, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import { MyPie } from "./pie";

import { AcStackBar } from "./AcStackBar";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import { getStoredUser, User } from "../utils/storage";

const Item: React.FC<{ label: string; value: number | string }> = ({
  label,
  value,
}) => {
  return (
    <Grid item container direction="row" justifyContent="space-around">
      <Grid item>
        <Typography variant="h6" sx={{ fontWeight: "regular" }}>
          {label}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6">{value}</Typography>
      </Grid>
    </Grid>
  );
};

const App: React.FC<{}> = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getStoredUser().then((user) => {
      console.log("popup user");
      console.log(user);
      setUser(user);
    });
  }, []);

  if (!user) {
    return null;
  }

  console.log("total " + user.performance.today_num_question);
  console.log("aced" + user.performance.today_ac_count);
  console.log("easy" + user.performance.num_easy);
  console.log("medium" + user.performance.num_medium);
  console.log("hard" + user.performance.num_hard);

  return (
    <div>
      <Box
        sx={{
          bgcolor: "orange",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          py: 0.5,
        }}
      >
        <Box
          sx={{
            fontStyle: "italic",
            typography: "h5",
            display: "inline",
          }}
        >
          LeetFlash
        </Box>
        <IconButton onClick={() => chrome.runtime.openOptionsPage()}>
          <SettingsIcon />
        </IconButton>
      </Box>
      <Typography variant="subtitle1">Today's Stats:</Typography>
      <Grid container direction="column">
        <Item
          label={"AC Rate"}
          value={(
            Math.round(
              (user.performance.today_ac_count /
                user.performance.today_num_question) *
                100
            ) / 100
          ).toFixed(2)}
        />
        <MyPie
          easy={user.performance.num_easy}
          medium={user.performance.num_medium}
          hard={user.performance.num_hard}
        />
        <AcStackBar
          total={user.performance.today_num_question}
          ac_count={user.performance.today_ac_count}
        />
      </Grid>
    </div>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<App />, root);
