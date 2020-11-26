import React, { useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import { Store } from "../context";
import google_img from "../images/btn_google.svg";
import { login } from "../Api";
import history from "../utils/history";

export default function Login(props) {
  const {
    setUser,
    setRaceURL,
    openLogin,
    setOpenLogin,
    setOpenDialog,
  } = useContext(Store);

  const handleLogin = async () => {
    document.addEventListener("login-result", (e) => {
      if (e.detail.result) {
        const race_exist = JSON.parse(localStorage.getItem("typerace.race"));
        if (race_exist && race_exist.race_uid) {
          setRaceURL({ race_uid: race_exist.race_uid, race_admin: "" });
          history.push("/race");
        }
      }
    });
    login(props.firebase, props.provider, setUser, setOpenDialog, setOpenLogin);
  };

  return (
    <div>
      <Dialog
        disableBackdropClick={true}
        open={openLogin || false}
        aria-labelledby="form-dialog-title"
      >
        <div style={{ width: "300px", height: "200px" }}>
          {" "}
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenLogin(false)}
              style={{ padding: "5px" }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <DialogTitle
            id="form-dialog-title"
            style={{ padding: "6px", paddingLeft: "12px" }}
          >
            Login
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Grid
                item
                xs={12}
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <button id="google-login-button" onClick={handleLogin}>
                  <img src={google_img} id="google-login-image" alt="G"></img>
                  <div id="google-login-text">LOGIN WITH GOOGLE</div>
                </button>
              </Grid>
            </DialogContentText>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}
