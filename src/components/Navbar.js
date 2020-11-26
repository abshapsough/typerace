import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { Store } from "../context";
import Menu from "./Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const { user, setOpenLogin } = useContext(Store);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link color="inherit" className="navbar-link" to="/home">
              Typerace
            </Link>
          </Typography>
          {user ? (
            <Menu user={user}></Menu>
          ) : (
            <Button color="inherit" onClick={() => setOpenLogin(true)}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
