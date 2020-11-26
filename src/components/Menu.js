import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import { Store } from "../context";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";

export default function SimpleMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user, setUser, setRaceURL } = useContext(Store);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(localStorage.getItem("user"));
    localStorage.removeItem("typerace.race");
    setRaceURL(localStorage.getItem("typerace.race"));
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
        style={{ borderRadius: "60px" }}
      >
        <img
          src={props.user.picture}
          style={{ height: "45px", width: "45px", borderRadius: "100px" }}
        ></img>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} component={Link} to="/profile">
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
