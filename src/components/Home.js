import React, { useContext, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Store } from "../context";
import { Link } from "react-router-dom";
import DisplayName from "./DisplayName";
import { create } from "../Api";
import history from "../utils/history";
import queryString from "query-string";
import FlagIcon from "@material-ui/icons/Flag";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

export default function Home(props) {
  const { user, setRaceURL, raceURL, setOpenLogin } = useContext(Store);
  const [view, setView] = useState("home");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (raceURL && raceURL.race_uid && !user) {
      setOpenLogin(true);
    }
  }, []);

  const handleCreate = () => {
    if (user) {
      create(user.token).then((res) => {
        if (res.message) {
          setRaceURL({
            race_uid: res.race_uid,
            race_admin: user.uid,
            paragraph: {
              paragraph: res.paragraph,
              word_count: res.word_count,
              char_count: res.char_count,
            },
          });
          localStorage.setItem(
            "typerace.race",
            JSON.stringify({
              race_uid: res.race_uid,
              race_admin: user.uid,
              paragraph: {
                paragraph: res.paragraph,
                word_count: res.word_count,
                char_count: res.char_count,
              },
            })
          );
          history.push("/race");
        }
      });
    } else {
      setOpenLogin(true);
    }
  };

  const handleLinkChange = (e) => {
    const { value } = e.target;
    setLink(value);
  };

  const handleJoin = () => {
    if (user) {
      const parsed = queryString.parse(queryString.extract(link));
      if (parsed.race) {
        setRaceURL({ race_uid: parsed.race, race_admin: "" });
        localStorage.setItem(
          "typerace.race",
          JSON.stringify({ race_uid: parsed.race, race_admin: "" })
        );
        history.push("/race");
      }
    } else {
      setOpenLogin(true);
    }
  };

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      {view === "home" && (
        <Grid item xs={5}>
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ marginTop: "70px", marginBottom: "60px" }}
          >
            <div className="page-title">Welcome to Typerace!</div>{" "}
          </Grid>
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ marginTop: "20px" }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCreate}
              className="home-button"
              style={{
                marginTop: "20px",
              }}
            >
              <FlagIcon style={{ marginRight: "10px" }}></FlagIcon>
              Create race
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ marginTop: "20px" }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setView("join")}
              className="home-button"
            >
              <ArrowForwardIcon
                style={{ marginRight: "10px" }}
              ></ArrowForwardIcon>
              Join race
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <DisplayName></DisplayName>
          </Grid>
          {user && (
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="center"
              alignItems="center"
              style={{ marginTop: "20px" }}
            >
              <Button
                component={Link}
                to="/profile"
                variant="outlined"
                color="primary"
                className="home-button"
              >
                <AccountBoxIcon
                  style={{ marginRight: "10px" }}
                ></AccountBoxIcon>
                Profile
              </Button>
            </Grid>
          )}
        </Grid>
      )}
      {view === "join" && (
        <Grid
          item
          xs={12}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ marginTop: "20px" }}
          >
            <TextField
              id="standard-basic"
              label="Link"
              onChange={handleLinkChange}
              value={link}
            />
          </Grid>
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ marginTop: "20px" }}
          >
            <Button variant="contained" color="primary" onClick={handleJoin}>
              Join
            </Button>{" "}
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="center"
              alignItems="center"
              style={{ marginTop: "20px" }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setView("home")}
              >
                Cancel
              </Button>{" "}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
