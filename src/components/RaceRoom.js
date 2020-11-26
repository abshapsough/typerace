import React, { useContext, useEffect, useState } from "react";
import { Store } from "../context";
import { Emit } from "../socket";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import { UpdateRaceData, UpdateParagraph } from "../Api";
import history from "../utils/history";
import ProgressBar from "./ProgressBar";

export default function RaceRoom(props) {
  const { raceURL, user, socket, setRaceURL, setUser } = useContext(Store);
  const [start, setStart] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [initial] = useState({ timer: 119, countdown: 4 });
  const [timer, setTimer] = useState(119);
  const [correctWords, setCorrectWords] = useState(0);
  const [typedWords, setTypedWords] = useState("");
  const [complete, setComplete] = useState(false);
  const [color, setColor] = useState("#006400");
  const [bgColor, setBgColor] = useState("#90EE90");
  const [timerInterval, setRaceInterval] = useState(0);
  const [WPM, setWPM] = useState(0);
  const [raceData, setRaceData] = useState([]);
  const [completedRace, setCompletedRace] = useState([]);
  const [startedRace, setStartedRace] = useState([]);
  const [copy, setCopy] = useState("Copy");
  const [lightColor, setLightColor] = useState(["", "", ""]);
  const [raceIndex, setRaceIndex] = useState(-1);
  const [paragraphAnimation, setParagraphAnimation] = useState({
    done: "",
    current: "",
    coming: raceURL.paragraph && raceURL.paragraph.paragraph,
  });

  useEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      socket.emit("remove-player", {
        race_uid: raceURL.race_uid,
        uid: user.uid,
        ...JSON.parse(localStorage.getItem("typerace.race")),
      });
      localStorage.removeItem("typerace.race");
      return;
    });

    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      socket.emit("remove-player", {
        race_uid: raceURL.race_uid,
        uid: user.uid,
        ...JSON.parse(localStorage.getItem("typerace.race")),
      });
      localStorage.removeItem("typerace.race");
      history.push("/home");
      return;
    }
    if (user) {
      Emit(socket, "join-race", {
        race_admin: raceURL.race_admin,
        token: user.token,
        race_uid: raceURL.race_uid,
        display_name: user.display_name,
        paragraph: raceURL.paragraph,
        image: user.picture,
      });

      socket.on("new-user-request", (new_racer) => {
        if (raceURL.race_admin === user.uid) {
          Emit(socket, "new-user-request-granted", {
            ...new_racer,
            ...JSON.parse(localStorage.getItem("typerace.race")),
          });
        }
      });

      socket.on("connectToRoom", (race) => {
        setRaceURL({ ...race });
        localStorage.setItem("typerace.race", JSON.stringify({ ...race }));
      });
      const noPaste = document.getElementById("race-input");
      noPaste.onpaste = (e) => {
        e.preventDefault();
        return false;
      };
    } else {
      history.push("/home");
      return;
    }

    socket.on("remove-player-client", (details) => {
      if (details === "error" || (details.kick && details.uid === user.uid)) {
        localStorage.removeItem("typerace.race");
        history.push("/home");
        if (details.kick) alert("You have been kicked");
        return;
      }
      let options = {
        current_users: details.current_users,
        paragraph: details.paragraph,
        race_uid: details.race_uid,
        race_admin: details.race_admin,
      };
      setRaceURL(options);
      localStorage.setItem("typerace.race", JSON.stringify(options));
    });

    socket.on("start-countdown-client", (raceSetup) => {
      raceSetup.current_racers.forEach((racer) => {
        if (racer.display_name === user.display_name) {
          setRaceIndex(racer.index);
        }
      });
      raceSetup.paragraph &&
        setRaceURL({
          ...raceURL,
          paragraph: raceSetup.paragraph,
          current_users: raceSetup.current_racers,
        });
      setCompletedRace([]);
      setTimer(initial.timer);
      setCountdown(initial.countdown);
      setCorrectWords(0);
      setTypedWords("");
      setComplete(false);
      setWPM(0);
      setRaceData(raceSetup.current_racers);
      setStartedRace(
        JSON.parse(localStorage.getItem("typerace.race")).current_users && [
          ...JSON.parse(localStorage.getItem("typerace.race")).current_users,
        ]
      );
      let start = Date.now();
      let interval = setInterval(() => {
        let current = Date.now();
        let difference = current - start;
        let second = Math.floor((difference / 1000) % 60);

        if (countdown - second === 3) setLightColor(["red", "", ""]);
        if (countdown - second === 2) setLightColor(["red", "yellow", ""]);
        if (countdown - second === 1) {
          setStart(true);
          setLightColor(["red", "yellow", "green"]);
        }
        if (countdown - second === 0) {
          clearInterval(interval);
        }
        setCountdown(countdown - second);
      }, 1000);
    });

    return () => {
      socket.emit("remove-player", {
        race_uid: raceURL.race_uid,
        uid: user.uid,
        ...JSON.parse(localStorage.getItem("typerace.race")),
      });
      localStorage.removeItem("typerace.race");
      return;
    };
  }, []);

  useEffect(() => {
    socket.on("update-client-wpm", (updates) => {
      let data = [...raceData];
      data[updates.index] = {
        wpm: updates.wpm,
        correctWords: updates.correctWords,
        image: updates.image,
        race_uid: raceURL.race_uid,
        index: updates.index,
        display_name: updates.display_name,
        uid: updates.uid,
      };
      setRaceData(data);
    });

    return () => {
      socket.off("update-client-wpm");
    };
  }, [raceData]);

  useEffect(() => {
    setParagraphAnimation({
      done: "",
      current: "",
      coming: raceURL.paragraph && raceURL.paragraph.paragraph,
    });
  }, [raceURL.paragraph]);

  useEffect(() => {
    if (copy === "Copied!") {
      setTimeout(() => {
        setCopy("Copy");
      }, 2000);
    }
  }, [copy]);

  useEffect(() => {
    socket.on("completed-race-client", (update) => {
      if (completedRace.includes(update)) return;
      setCompletedRace([...completedRace, update]);
    });

    if (completedRace.length > 0) {
      completedRace.forEach((racer, index) => {
        document.getElementById(`rank-${racer}`).innerHTML =
          "rank " + (index + 1);
      });
    }
    if (start && startedRace && startedRace.length === completedRace.length) {
      (async () => {
        let statistics = await UpdateRaceData({
          race_uid: raceURL.race_uid,
          uid: user.uid,
          wpm: WPM,
          token: user.token,
          rank: completedRace.indexOf(user.display_name) + 1,
        });
        setUser({ ...user, statistics: { ...statistics } });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, statistics: { ...statistics } })
        );
      })();
      setStart(false);
    }

    return () => {
      socket.off("completed-race-client");
    };
  }, [completedRace, startedRace]);

  useEffect(() => {
    if (start && !complete) {
      let start = Date.now();
      setRaceInterval(
        setInterval(() => {
          let current = Date.now();

          let difference = current - start;
          let second = Math.floor((difference / 1000) % 120);

          if (timer - second === 0) {
            setComplete(true);
            clearInterval(timerInterval);
          }
          setTimer(timer - second);
        }, 1000)
      );
    }
  }, [start, complete]);

  useEffect(() => {
    if (complete) {
      clearInterval(timerInterval);
      socket.emit("completed-race", {
        race_uid: raceURL.race_uid,
        display_name: user.display_name,
      });
      let seconds = initial.timer - timer;
      let wpm = Math.round((correctWords / seconds) * 60);
      setWPM(wpm);

      socket.emit("update-wpm", {
        wpm,
        correctWords,
        image: user.picture,
        race_uid: raceURL.race_uid,
        index: raceIndex,
        display_name: user.display_name,
        uid: user.uid,
      });
    }
  }, [complete]);

  useEffect(() => {
    let seconds = initial.timer - timer;
    let wpm = Math.round((correctWords / seconds) * 60);
    setWPM(wpm);
    socket.emit("update-wpm", {
      wpm,
      correctWords,
      image: user.picture,
      race_uid: raceURL.race_uid,
      index: raceIndex,
      display_name: user.display_name,
      uid: user.uid,
    });
  }, [timer]);

  const startCountdown = async () => {
    let new_paragraph = null;
    if (completedRace.length > 0) {
      new_paragraph = await UpdateParagraph();
      if (new_paragraph.error) {
        return;
      } else {
        delete new_paragraph["message"];
      }
    }

    socket.emit("start-countdown", {
      race_uid: raceURL.race_uid,
      users: raceURL.current_users,
      paragraph: new_paragraph,
    });
  };

  const handleText = (e) => {
    if (!complete && start) {
      const { value } = e.target;
      let index = value.length;
      let correct = raceURL.paragraph.paragraph.slice(0, index);

      if (correct !== value) {
        setColor("red");
        setBgColor("#FA8072");
        setLightColor(["red", "red", "red"]);
        setTypedWords(value);
      } else {
        if (typedWords.length > value.length && color === "#006400") return;
        setParagraphAnimation({
          done: value,
          current: raceURL.paragraph.paragraph[index],
          coming: raceURL.paragraph.paragraph.slice(
            index + 1,
            raceURL.paragraph.paragraph.length
          ),
        });

        if (
          value[index - 1] === " " &&
          color === "#006400" &&
          index - 2 >= 0 &&
          value[index - 2] !== " "
        ) {
          setCorrectWords(correctWords + 1);
        }
        if (value === raceURL.paragraph.paragraph) {
          setCorrectWords(correctWords + 1);
          setComplete(true);
        }
        setLightColor(["green", "green", "green"]);
        setBgColor("#90EE90");
        setColor("#006400");
        setTypedWords(value);
      }
    }
  };

  const kickPlayer = (racer) => {
    socket.emit("remove-player", {
      race_uid: raceURL.race_uid,
      uid: racer.uid,
      kick: true,
      ...JSON.parse(localStorage.getItem("typerace.race")),
    });
  };

  const progress = (racer) => {
    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        key={racer.display_name}
      >
        <Grid item xs={3}>
          <div style={{ width: "100%" }}>{racer.display_name}</div>{" "}
        </Grid>
        <Grid item xs={7} style={{ paddingTop: "5px" }}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            style={{ height: "20px" }}
          >
            <ProgressBar
              bgcolor={"#3f51b5"}
              completed={
                Math.round(
                  (raceData[racer.index].correctWords /
                    (raceURL.paragraph && raceURL.paragraph.word_count)) *
                    100
                ) || 0
              }
              image={raceData[racer.index].image}
            ></ProgressBar>{" "}
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <div style={{ width: "100%", marginLeft: "10px" }}>
            {raceData[racer.index].wpm} wpm{" "}
            <span id={`rank-${racer.display_name}`}></span>{" "}
          </div>
        </Grid>
      </Grid>
    );
  };

  return (
    <div>
      {user && (
        <Grid container direction="row" justify="center">
          <Grid item xs={12}>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="center"
              alignItems="center"
              className="page-title"
              style={{ marginTop: "30px" }}
            >
              Welcome to the race lobby
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
              {start ? (
                <span style={{ color: "white" }}>h</span>
              ) : raceURL.race_admin === user.uid ? (
                <div>
                  You are the race admin. Click on "Start race" to begin
                </div>
              ) : (
                <div>Waiting for race admin to start the race</div>
              )}
            </Grid>
          </Grid>
          <Grid item xs={2}>
            Racers
            {raceURL.current_users && (
              <Paper
                variant="outlined"
                elevation={0}
                style={{ marginTop: "10px" }}
                className="race-room-paper"
              >
                <List>
                  {raceURL.current_users.map((racer) => {
                    return (
                      <ListItem key={racer.uid}>
                        <img
                          src={racer.image}
                          style={{
                            height: "30px",
                            width: "30px",
                            borderRadius: "100px",
                            marginRight: "4px",
                          }}
                        ></img>
                        <ListItemText primary={racer.display_name} />
                        <ListItemSecondaryAction>
                          {raceURL.race_admin === user.uid &&
                            user.display_name !== racer.display_name && (
                              <Tooltip title="Kick">
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => kickPlayer(racer)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            )}
          </Grid>
          <Grid item xs={8} style={{ marginTop: "10px" }}>
            <Container>
              <Paper
                variant="outlined"
                elevation={0}
                style={{ marginTop: "20px" }}
                className="race-room-paper"
              >
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <div
                    style={{
                      width: "90%",
                      margin: "10px 0px",
                      lineHeight: "30px",
                    }}
                  >
                    {completedRace.length > 0
                      ? raceData.map((racer) => {
                          return progress(racer);
                        })
                      : start || countdown <= 2
                      ? raceData.map((racer) => {
                          return progress(racer);
                        })
                      : raceURL.current_users &&
                        raceURL.current_users.map((racer) => {
                          return (
                            <div key={racer.uid}>
                              {racer.display_name}{" "}
                              <span id={`rank-${racer.display_name}`}></span>
                            </div>
                          );
                        })}
                  </div>
                </Grid>
              </Paper>
              <Grid
                container
                itemxs={12}
                direction="row"
                justify="center"
                alignItems="center"
                style={{ margin: "10px 0px" }}
              >
                <div>
                  <span style={{ marginRight: "10px" }}>
                    Time {"  "}
                    {Math.floor((timer % 3600) / 60)}:
                    {Math.floor((timer % 3600) % 60) < 10
                      ? "0" + Math.floor((timer % 3600) % 60)
                      : Math.floor((timer % 3600) % 60)}
                  </span>
                  <span
                    style={{
                      borderLeft: "1px solid grey",
                      height: "5px",
                      marginRight: "10px",
                    }}
                  ></span>
                  <span>
                    Speed {"  "} {WPM || 0} wpm
                  </span>
                </div>
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
                <Paper
                  variant="outlined"
                  elevation={0}
                  className="race-room-paper"
                >
                  <Grid
                    item
                    xs={12}
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <div style={{ width: "90%", lineHeight: "30px" }}>
                      <span
                        style={{
                          color: "gray",
                          backgroundColor: bgColor,
                        }}
                      >
                        {paragraphAnimation.done}
                      </span>
                      <span style={{ color: color }}>
                        {paragraphAnimation.current &&
                          paragraphAnimation.current}
                      </span>
                      <span>{paragraphAnimation.coming}</span>
                    </div>
                  </Grid>
                </Paper>
              </Grid>
              <Grid
                container
                itemxs={12}
                direction="row"
                justify="center"
                alignItems="center"
                style={{ margin: "10px 0px" }}
              >
                <React.Fragment>
                  {lightColor.map((light, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "1px solid black",
                          borderRadius: "60px",
                          display: "inline",
                          marginRight: "5px",
                          backgroundColor: light,
                        }}
                      ></div>
                    );
                  })}
                </React.Fragment>
              </Grid>

              <Grid
                item
                xs={12}
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <input
                  id="race-input"
                  style={{
                    width: "100%",
                    height: "50px",
                    borderRadius: "4px",
                    borderStlye: "solid",
                    padding: "0px 20px",
                    outlineColor: color,
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  onChange={handleText}
                  value={typedWords}
                ></input>
              </Grid>

              {raceURL.race_admin === user.uid && !start && (
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="flex-end"
                  style={{ marginTop: "20px" }}
                >
                  {raceURL.current_users &&
                  raceURL.current_users.length === 1 ? (
                    <span>Waiting for more players to join...</span>
                  ) : (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={startCountdown}
                      className="start-race-button"
                    >
                      {completedRace.length > 0 ? (
                        <span>Start new race</span>
                      ) : (
                        <span>Start new race</span>
                      )}
                    </Button>
                  )}
                </Grid>
              )}
            </Container>
          </Grid>
          <Grid item xs={2}>
            <Paper
              variant="outlined"
              elevation={0}
              style={{ marginTop: "30px", padding: "5px" }}
              className="race-room-paper"
            >
              send the following link to your friends to join the race!{" "}
              <Grid
                item
                xs={12}
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <input
                  id="race-link"
                  value={`${window.location.origin}/?race=` + raceURL.race_uid}
                  style={{ marginTop: "5px", marginBottom: "5px" }}
                  readOnly={true}
                ></input>
                <div>
                  <Tooltip title={copy}>
                    <IconButton
                      aria-label="copy"
                      onClick={() => {
                        var copyText = document.getElementById("race-link");
                        copyText.select();
                        copyText.setSelectionRange(0, 99999);
                        document.execCommand("copy");
                        setCopy("Copied!");
                      }}
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
