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
} from "../utils/storage";
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Switch from "@mui/material/Switch";
import Link from "@mui/material/Link";

type FormState = "ready" | "saving";
const App: React.FC<{}> = () => {
  const [user, setUser] = useState<User>(DefaultUser);
  const [password, setPassword] = useState<string>("");
  const [formState, setFormState] = useState<FormState>("ready");
  const [onlyVisitor, setOnlyVisitor] = useState<boolean>(false);
  const [signIn, setSignIn] = useState<boolean>(false);
  useEffect(() => {
    getStoredUser().then((user) => {
      console.log("Get user ");
      console.log(user);

      setUser(user);
      if (!user.email) {
        getStoredOnlyVisitor().then((onlyVisitor) => {
          setOnlyVisitor(onlyVisitor);
        });
        setSignIn(false);
      } else {
        setSignIn(true);
      }
    });
  }, []);

  const SUBMIT_URL = "http://localhost:3000/api/user/signin-return-id";

  const submitHandler = () => {
    setFormState("saving");
    toast.info("Saving your info...");
    // make a post request to SUBMIT_URL with fetch
    fetch(SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          const returnUser: User = {
            email: res.email,
            uuid: res.id,
            performance: DefaultUserPerformance,
          };
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
        } else {
          toast.error(
            "Cannot link your account with LeetFlash. Please check if the credential is valid. "
          );
          setTimeout(() => {
            setFormState("ready");
          }, 1000);
        }
      })
      .catch((err) => {
        toast.error(
          "Cannot connect to the server, use Only Extension mode first"
        );
        setFormState("ready");
      });
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

  if (!user) {
    return null;
  }

  // const handleAutoOverlayChange = (hasAutoOverlay: boolean) => {
  //   setOptions({ ...options, hasAutoOverlay });
  // };
  const temp = true;
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
              clearTodayPerformance();
              toast.success("Cleared your history for today !");
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
                <Typography variant="h6">LeetFlash Email</Typography>
              </Grid>
              <Grid item>
                <TextField
                  label="User Email"
                  value={user.email}
                  variant="standard"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  disabled={isFieldsDisabled || onlyVisitor || temp}
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
                <Typography variant="h6">Password</Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  value={password}
                  variant="standard"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isFieldsDisabled || onlyVisitor || temp}
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
                disabled={isFieldsDisabled || temp}
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
    </Grid>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<App />, root);
