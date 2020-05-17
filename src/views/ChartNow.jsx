import React, {useState} from "react";
import axios from "axios";

const ChartNow = () => {
  const [chartImg, setChartImg] = useState("");

  axios.get("http://104.236.110.128:8080/?svgstring=true").then(res => {
    setChartImg(res.data);
  })

  return (
    <div className="login-form p-16">
      <h1>Chart Now</h1>
      <div dangerouslySetInnerHTML={{__html: chartImg}}/>
    </div>
  );
};

export default ChartNow;
