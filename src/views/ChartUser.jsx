import React, {useContext, useState} from "react";
import {AppContext} from "../AppContext";
import axios from "axios";

const ChartUser = () => {
  let user = useContext(AppContext);
  let [chartImg, setChartImg] = useState("");

  let {birthLocation, date: {utc}} = user;
  let dt = `${utc.day}/${utc.month}/${utc.year}/${utc.hour}/${utc.minute}/${utc.second}`;
  let chartUrl = `http://104.236.110.128:8080/?n=${dt}&lx=${birthLocation.latitude}&ly=${birthLocation.longitude}&svgstring=true`

  axios.get(chartUrl).then(res => {
    setChartImg(res.data);
  })

  return (
    <div className="login-form p-16">
      <h1>Chart User</h1>
      <div dangerouslySetInnerHTML={{__html: chartImg}}/>
    </div>
  );
};

export default ChartUser;
