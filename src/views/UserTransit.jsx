import React, { useState, useContext, useEffect } from "react";
import { setUserEvents } from "../services/dataService";
import TransitEvent from "./TransitEvent";
import { useUserEvents } from "./useUserEvents";

const UserTransit = () => {
  let user = useUserEvents();
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    setUserEvents(user);

    if (user && user.events) {
      let temp = [];
      for (const key in user.events) {
        if (user.events.hasOwnProperty(key)) {
          const element = user.events[key];
          temp.push(element);
        }
      }
      setEventList(temp);
      console.log(temp);
    }
  }, [user]);

  return (
    <div className="p-16">
      {eventList.map((e, i) => (
        <div className="mb-32" key={i}>
          <TransitEvent event={e}></TransitEvent>
        </div>
      ))}
    </div>
  );
};

export default UserTransit;
