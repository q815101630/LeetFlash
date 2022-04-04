import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./options.css";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  setStoredUser,
  getStoredUser,
  User,
  getStoredOnlyVisitor,
  setStoredOnlyVisitor,
  clearTodayPerformance,
  DefaultUserPerformance,
  DefaultUser,
  RemindSettings,
  DefaultRemindSettings,
  getStoredRemindSettings,
  setStoredRemindSettings,
} from "../utils/storage";
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Switch from "@mui/material/Switch";
import Link from "@mui/material/Link";
import ClearAlert from "./ClearAlert";
import { verifyUser } from "../utils/api";
import { AxiosError } from "axios";
import { alarmSetter } from "../background/background.api";
type FormState = "ready" | "saving";
const App: React.FC<{}> = () => {
  const [user, setUser] = useState<User>(DefaultUser);
  const [formState, setFormState] = useState<FormState>("ready");
  const [onlyVisitor, setOnlyVisitor] = useState<boolean>(false);
  const [signIn, setSignIn] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [settings, setSettings] = useState<RemindSettings>(
    DefaultRemindSettings
  );
  const [hoursToSet, setHoursToSet] = useState<string>("");
  useEffect(() => {
    getStoredRemindSettings().then((settings) => {
      console.log("Current settings ");
      console.log(settings);
      setSettings(settings);
      setHoursToSet(settings.timeSlots.map((slot) => slot / 60).toString());
    });
    getStoredUser().then((currentUser) => {
      console.log("Get currentUser ");
      console.log(currentUser);
      if (currentUser && currentUser.email) {
        setUser(currentUser);
        setSignIn(true);
      } else {
        getStoredOnlyVisitor().then((onlyVisitor) => {
          setOnlyVisitor(onlyVisitor);
        });
        setSignIn(false);
      }
    });
  }, []);

  const submitHandler = () => {
    setFormState("saving");
    toast.info("Saving your info...");
    verifyUser(user._id)
      .then((returnUser: User) => {
        setUser(returnUser);
        setStoredUser(returnUser).then(() => {
          setTimeout(() => {
            setFormState("ready");
            toast.success(
              "Successfully linked the extension with your account!"
            );
            setSignIn(true);
          }, 1000);
        });
      })
      .catch((status: AxiosError) => {
        if (status.response.status == 401 || status.response.status == 400) {
          toast.error(
            "Cannot link your account with LeetFlash. Please check if the credential is valid. "
          );
        } else {
          toast.error(
            "Cannot connect to the server, use Only Extension mode first"
          );
        }
        setFormState("ready");
      });

    const newTimeSlots = hoursToSet.split(",");
    const newSlots = newTimeSlots.reduce((filteredSlots, slot) => {
      !isNaN(parseFloat(slot)) && filteredSlots.push(parseFloat(slot) * 60);
      return filteredSlots;
    }, []);

    setStoredRemindSettings({
      timeSlots: newSlots,
      delayMins: settings.delayMins,
    })
      .then(getStoredRemindSettings)
      .then((settings) => {
        setHoursToSet(settings.timeSlots.map((slot) => slot / 60).toString());
        setSettings(settings);
        console.log("fired!");
        alarmSetter(settings);
        toast.success("Reminder settings updated!");
      })

      .catch(() => toast.error("Reminder settings failed!"));
  };

  const handleOnlyVisitorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOnlyVisitor(event.target.checked);
    setStoredOnlyVisitor(event.target.checked);
    toast.success("Only Visitor mode is now: " + event.target.checked);
  };

  const signoutUserHandler = () => {
    setStoredUser(DefaultUser);
    setUser(DefaultUser);
    setSignIn(false);
    toast.success("Successfully signed out!");
  };

  const handleClear = (clear: boolean) => {
    if (clear) {
      clearTodayPerformance();
      toast.success("Cleared your history for today !");
    }
    setOpenAlert(false);
  };

  if (!user) {
    return null;
  }

  // const handleAutoOverlayChange = (hasAutoOverlay: boolean) => {
  //   setOptions({ ...options, hasAutoOverlay });
  // };
  const isFieldsDisabled = formState === "saving";
  return (
    <Grid
      container
      item
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <Paper sx={{ px: 10, py: 5 }}>
          <Typography variant="h2" pb={5}>
            Setting
          </Typography>

          <Link
            href="#"
            underline="hover"
            onClick={() => {
              setOpenAlert(true);
            }}
            sx={{ display: "block", mb: 2 }}
          >
            Clear Today History
          </Link>

          <Typography variant="body2">
            App is still developing, so feel free to use Only Extension option
            :)
          </Typography>

          <Grid container direction="column">
            <Grid
              item
              py={5}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Grid item>
                <Typography variant="h6">LeetFlash Token</Typography>
              </Grid>
              <Grid item>
                <TextField
                  label="User "
                  value={user._id}
                  variant="standard"
                  onChange={(e) => setUser({ ...user, _id: e.target.value })}
                  disabled={isFieldsDisabled || onlyVisitor}
                />
              </Grid>
            </Grid>
            <Grid
              item
              py={5}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Grid item>
                <Typography variant="h6">Remind Me at Hour</Typography>
              </Grid>
              <Grid item>
                <TextField
                  label="hours"
                  value={hoursToSet}
                  variant="standard"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setHoursToSet(e.target.value);
                  }}
                  disabled={isFieldsDisabled}
                />
              </Grid>
            </Grid>
            <Typography variant="body2">
              * a list of time you want LeetFlash to remind you, of 24 hours
            </Typography>

            <Typography variant="body2">
              e.g. [9,15, 18]: You will receive reminder notifications at 9am,
              3pm, 6pm
            </Typography>

            <Grid
              item
              py={5}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Grid item>
                <Typography variant="h6">Only Extension</Typography>
              </Grid>
              <Grid item sx={{ pr: 10 }}>
                <Switch
                  disabled={isFieldsDisabled || signIn}
                  checked={onlyVisitor || false}
                  onChange={handleOnlyVisitorChange}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                *Only Extension: only use extension functionality without
                signin.
              </Typography>

              <Typography variant="body2" sx={{ pb: 2 }}>
                *If you signed in, this field will be ignored.
              </Typography>

              <Typography variant="body2"></Typography>

              <Link
                component="button"
                disabled
                // href="http://localhost:300/user/sign-up"
                target="_blank"
                rel="noopener"
                underline="hover"
              >
                No Account? Sign up
              </Link>
              <div></div>
              <Link
                href="#"
                underline="hover"
                onClick={signoutUserHandler}
                sx={{ display: !signIn ? "none" : "inline" }}
              >
                Sign out
              </Link>
            </Grid>
            <Grid container item justifyContent="center" sx={{ pt: 5 }}>
              <Button
                disabled={isFieldsDisabled}
                variant="contained"
                size="medium"
                onClick={submitHandler}
              >
                {formState === "saving" ? "Saving..." : "Save"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <ToastContainer />
      <ClearAlert AlertOpen={openAlert} handleClear={handleClear} />
    </Grid>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<App />, root);
