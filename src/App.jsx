import "./app.scss";
import React, { useState, useEffect } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import Auth from "./auth/Auth";
import history from "./history";
import Login from "./views/Login";
import TransitImporter from "./views/TransitImporter";
import TransitViewer from "./views/TransitViewer";
import Topbar from "./views/Topbar";
import { AppContext } from "./AppContext";
import { getUserData } from "./firebase/firebaseAuthService";
import TransitEditor from "./views/TransitEditor";
import ProfileEditor from "./views/ProfileEditor";
import UserTransit from "./views/UserTransit";
import ChartNow from "./views/ChartNow";
import ChartNew from "./views/ChartNew";
import ChartUser from "./views/ChartUser";

function App() {
  const [context, setContext] = useState();

  useEffect(() => {
    getUserData(userData => {
      let user = userData.val();

      if (user) history.push("/user-profile");
      else history.push("/login");
      setContext(user);
    });
  }, []);

  return (
    <AppContext.Provider value={context}>
      {/* <Auth> */}
      <Router history={history}>
        <Topbar></Topbar>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/user-profile" exact component={ProfileEditor} />
          <Route path="/transit-import" exact component={TransitImporter} />
          <Route path="/global-transit" exact component={TransitViewer} />
          <Route path="/my-transit" exact component={UserTransit} />
          <Route path="/transit-edit/:id" exact component={TransitEditor} />
          <Route path="/chart/now" exact component={ChartNow} />
          <Route path="/chart/user" exact component={ChartUser} />
          <Route path="/chart/new" exact component={ChartNew} />
          <Route path="/" exact render={props => <Redirect to="/login" />} />
        </Switch>
      </Router>
      {/* </Auth> */}
    </AppContext.Provider>
  );
}

export default App;
