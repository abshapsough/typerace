import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import io from "socket.io-client";
import { Store } from "./context";
import { Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Home from "./components/Home";
import Container from "@material-ui/core/Container";
import "./App.css";
import queryString from "query-string";
import RaceRoom from "./components/RaceRoom";
import history from "./utils/history";
import proxy from "./proxy";
import Login from "./components/Login";
import DisplayName from "./components/DisplayName";

const socket = io(proxy);

const firebaseConfig = {
  apiKey: "AIzaSyCvTmQCl8kmkDHDtzeZs1WR-tC7oJKeiOY",
  authDomain: "typerace-292d4.firebaseapp.com",
  databaseURL: "https://typerace-292d4.firebaseio.com",
  projectId: "typerace-292d4",
  storageBucket: "typerace-292d4.appspot.com",
  messagingSenderId: "174094638023",
  appId: "1:174094638023:web:5a768e07aa3c3a7872d7e2",
  measurementId: "G-GKP8GJ381V",
};

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [raceURL, setRaceURL] = useState(
    JSON.parse(localStorage.getItem("typerace.race"))
  );
  const [openLogin, setOpenLogin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    if (parsed.race) {
      setRaceURL({ race_uid: parsed.race, race_admin: "" });
      localStorage.setItem(
        "typerace.race",
        JSON.stringify({ race_uid: parsed.race, race_admin: "" })
      );
      history.push("/race");
    }
  }, []);

  return (
    <Router history={history}>
      <Store.Provider
        value={{
          user,
          setUser,
          raceURL,
          setRaceURL,
          socket,
          openLogin,
          setOpenLogin,
          openDialog,
          setOpenDialog,
        }}
      >
        <Navbar></Navbar>
        {openDialog && (
          <DisplayName open={openDialog} setOpen={setOpenDialog}></DisplayName>
        )}
        {openLogin && <Login provider={provider} firebase={firebase}></Login>}
        <div id="body">
          <Container>
            <Switch>
              <Route exact path="/profile">
                {user ? (
                  <Profile />
                ) : (
                  <div>Please login to view your profile</div>
                )}
              </Route>

              <Route exact path="/race">
                {raceURL ? (
                  <RaceRoom></RaceRoom>
                ) : (
                  <div>Please enter a race url</div>
                )}
              </Route>
              <Route path="/">
                <Home></Home>
              </Route>
            </Switch>
          </Container>
        </div>
      </Store.Provider>
    </Router>
  );
}
