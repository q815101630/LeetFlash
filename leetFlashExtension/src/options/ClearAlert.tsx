import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ClearAlert = ({ AlertOpen, handleClear }) => {
  return (
    <div>
      <Dialog
        open={AlertOpen}
        onClose={() => {
          handleClear(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Attention"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to clear your stats for today?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClear(false);
            }}
            autoFocus
          >
            Nope
          </Button>
          <Button
            onClick={() => {
              handleClear(true);
            }}
          >
            Yep
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClearAlert;
