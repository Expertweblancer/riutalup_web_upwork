import React, { useState, useEffect, useContext } from "react";
import { TextField, Button, Card } from "@material-ui/core";
import { setEvents } from "../services/dataService";
import { AppContext } from "../AppContext";

const TransitImporter = () => {
  const [formValue, setFormValue] = useState({
    ts: new Date().toISOString().split("T")[0],
    te: new Date().toISOString().split("T")[0]
  });

  let user = useContext(AppContext);
  const [eventList, setEventList] = useState([]);

  const handleChange = ({ target }) => {
    setFormValue({ ...formValue, [target.name]: target.value });
  };

  const handleSubmit = async () => {
    let data = await setEvents(formValue);
    console.log(data);
    setEventList(data);
  };

  return (
    <form className="h-100">
      {user && !user.isAdmin && (
        <h2 className="m-0 p-16">Hello {user.email}</h2>
      )}
      {user && user.isAdmin && (
        <div className="login-form p-16">
          <h2 className="m-0 mb-16">Enter Transit Date Range</h2>
          <TextField
            label="Start Date"
            variant="outlined"
            className="mb-16"
            name="ts"
            fullWidth
            type="date"
            value={formValue.ts}
            onChange={handleChange}
          />
          <TextField
            label="End Date"
            variant="outlined"
            className="mb-16"
            name="te"
            type="date"
            value={formValue.te}
            fullWidth
            onChange={handleChange}
          />
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Go
          </Button>
          {eventList.map((e, i) => (
            <p key={i}>{JSON.stringify(e)}</p>
          ))}
        </div>
      )}
    </form>
  );
};

export default TransitImporter;
