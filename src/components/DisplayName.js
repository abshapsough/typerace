import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Store } from "../context";
import { update } from "../Api";
import history from "../utils/history";

export default function DisplayName(props) {
  const { user, setUser, setRaceURL } = useContext(Store);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (displayName) {
      const updated = await update(
        { ...user, display_name: displayName },
        setUser
      );

      if (updated) {
        props.setOpen(false);
        const race_exist = JSON.parse(localStorage.getItem("typerace.race"));
        if (race_exist && race_exist.race_uid) {
          setRaceURL({ race_uid: race_exist.race_uid, race_admin: "" });
          history.push("/race");
        }
      } else {
        setError("Display name already exists");
      }
    }
  };

  const handleDisplayName = (e) => {
    setDisplayName(e.target.value);
  };

  return (
    <div>
      <Dialog
        disableBackdropClick={true}
        open={props.open || false}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Display name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a display name to show while you're racing
          </DialogContentText>
          <div className="error">{error}</div>
          <TextField
            autoFocus
            margin="dense"
            id="display-name"
            label="Display name"
            type="text"
            fullWidth
            value={displayName}
            onChange={handleDisplayName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
