import React, { Fragment } from "react";
import { aspects, planets, signNumber, signs } from "../unicode";

const TransitEvent = ({ event: e }) => {
  return (
    <Fragment>
      <div className="transitEvent">
        <div className="event-date-time">
          <p>{e.d}</p>
          <h4 className="p-0 m-0 mb-8">
            {e.date.utc
              ? new Date(
                  `${e.date.utc.year}/${e.date.utc.month}/${e.date.utc.day}`
                ).toLocaleDateString()
              : new Date(
                  `${e.date.year}/${e.date.month}/${e.date.day}`
                ).toLocaleDateString()}
            {}
          </h4>
          <h4 className="p-0 m-0 mb-8">{`${e.date.hour
            .toString()
            .padStart(2, "0")}:${e.date.minute
            .toString()
            .padStart(2, "0")}:${e.date.second.toFixed(0)}`}</h4>
        </div>
        <div className="planets-aspect">
          <div className="flex items-center mb-8">
            <i className={planets[e.planet1] + " mr-12"}></i>
            <h4 className="p-0 m-0 mr-8">{e.planet1} <span className="text-muted">in</span></h4>
            <i className={signs[signNumber[e.position1.sign]] + " text-muted mr-8"}></i>
            <h4 className="p-0 m-0 mr-8 text-muted">{signNumber[e.position1.sign]}</h4>


          </div>
          <div className="flex items-center mb-4">
            <i className={aspects[e.aspect] + " mr-12"}></i>
            <h4 className="p-0 m-0 mr-12">{e.aspect}</h4>

            <h4 className="m-0 text-muted">
                <span>{e.position1.degree}</span>
                <sup className="mr-8 deg">&deg;</sup>
              </h4>
              <h4 className="m-0 text-muted">
                <span>{e.position1.min}</span>
                <sup className="deg">
                  <span>&#x2033;</span>
                </sup>
              </h4>
          </div>
          <div className="flex items-center mb-8">
            <i className={planets[e.planet2] + " mr-12"}></i>
            <h4 className="p-0 m-0 mr-8">{e.planet2} <span className="text-muted">in</span></h4>
            <i className={signs[signNumber[e.position2.sign]] + " text-muted mr-8"}></i>
            <h4 className="p-0 m-0 mr-8 text-muted">{signNumber[e.position2.sign]}</h4>


          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TransitEvent;
