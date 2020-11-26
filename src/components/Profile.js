import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { Store } from "../context";
import { Link } from "react-router-dom";
import { Grid, Paper } from "@material-ui/core";

export default function Profile(props) {
  const { user, setUser, setRaceURL } = useContext(Store);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(localStorage.getItem("user"));
    localStorage.removeItem("typerace.race");
    setRaceURL(localStorage.getItem("typerace.race"));
  };
  return (
    <div className="profile">
      <Grid container direction="row" justify="center" alignItems="flex-start">
        {" "}
        <Grid
          item
          xs={12}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <h1>Your Profile</h1>
        </Grid>
        <Grid item xs={1} style={{ height: "100%" }}>
          <Button
            component={Link}
            to="/home"
            variant="outlined"
            color="secondary"
            className="back-button"
            style={{ marginTop: "20px" }}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={5} style={{ height: "100%" }}>
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <img
              src={user.picture}
              style={{ height: "150px", width: "150px", borderRadius: "100px" }}
            ></img>
          </Grid>{" "}
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <h2>{user.full_name}</h2>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <h3 style={{ marginLeft: "20px" }}>Account details</h3>
          <Paper variant="outlined" style={{ marginBottom: "30px" }}>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <div id="list" style={{ marginTop: "20px" }}>
                <strong>Email:</strong> {user.email}
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <div id="list">
                <strong>Display name:</strong> {user.display_name}
              </div>
            </Grid>
          </Paper>{" "}
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <h3 style={{ marginLeft: "20px" }}>Statistics</h3>
          </Grid>
          <Paper variant="outlined">
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <div id="list" style={{ marginTop: "20px" }}>
                <strong>Races:</strong> {user.statistics.races}
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <div id="list">
                <strong>Wins:</strong> {user.statistics.wins}
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <div id="list">
                <strong>Average WPM:</strong>{" "}
                {Math.round(user.statistics.average_wpm)}
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <div id="list">
                <strong>Fastest WPM:</strong> {user.statistics.fastest_wpm}
              </div>
            </Grid>{" "}
          </Paper>
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Button
              onClick={handleLogout}
              component={Link}
              to="/home"
              variant="outlined"
              color="primary"
              className="logout-button"
              style={{ marginTop: "20px" }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
