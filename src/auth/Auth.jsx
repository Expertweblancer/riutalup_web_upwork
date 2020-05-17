import React, { Fragment } from "react";
import { getLoginStatus } from "../firebase/firebaseAuthService";
import history from "../history";

const Auth = ({ children }) => {
  getLoginStatus(user => {
    if (user) history.push("/transit-import");
    else history.push("/login");
  });

  return <Fragment>{children}</Fragment>;
};

export default Auth;
