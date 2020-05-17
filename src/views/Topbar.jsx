import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import { AppContext } from "../AppContext";
import { logout } from "../firebase/firebaseAuthService";

const Topbar = ({
  history: {
    location: { pathname }
  }
}) => {
  let user = useContext(AppContext);

  return (
    <div>
      {user && (
        <Link to="/user-profile">
          <Button
            color={pathname.includes("user-profile") ? "primary" : "default"}
            className="m-8 capitalize"
          >
            User
          </Button>
        </Link>
      )}
      {user && user.isAdmin && (
        <Link to="/transit-import">
          <Button
            color={pathname.includes("transit-import") ? "primary" : "default"}
            className="m-8 capitalize"
          >
            Import transit
          </Button>
        </Link>
      )}
      <Link to="/global-transit">
        <Button
          color={pathname.includes("global-transit") ? "primary" : "default"}
          className="m-8 capitalize"
        >
          global transit
        </Button>
      </Link>
      {user && (
        <Link to="/my-transit">
          <Button
            color={pathname.includes("my-transit") ? "primary" : "default"}
            className="m-8 capitalize"
          >
            my transit
          </Button>
        </Link>
      )}
      {user && (
        <Link to="/chart/now">
          <Button
            color={pathname.includes("/chart/now") ? "primary" : "default"}
            className="m-8 capitalize"
          >
            chart now
          </Button>
        </Link>
      )}
      {user && (
        <Link to="/chart/user">
          <Button
            color={pathname.includes("/chart/user") ? "primary" : "default"}
            className="m-8 capitalize"
          >
            chart user
          </Button>
        </Link>
      )}
      {user && (
        <Link to="/chart/new">
          <Button
            color={pathname.includes("/chart/new") ? "primary" : "default"}
            className="m-8 capitalize"
          >
            chart new
          </Button>
        </Link>
      )}
      {!user && (
        <Link to="/login">
          <Button
            color={pathname.includes("my-transit") ? "primary" : "default"}
            className="m-8 capitalize"
          >
            login
          </Button>
        </Link>
      )}
      {user && (
        <Button className="m-8 capitalize" onClick={logout}>
          logout
        </Button>
      )}
    </div>
  );
};

export default withRouter(Topbar);
