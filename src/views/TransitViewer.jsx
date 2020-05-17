import React, { useState, useContext } from "react";
import { TextField, Button } from "@material-ui/core";
import { getDateRangeEvents } from "../services/dataService";
import { aspects, planets, signNumber, signs } from "../unicode";
import { AppContext } from "../AppContext";
import { Link } from "react-router-dom";
import TransitEditor from "./TransitEditor";

const TransitViewer = () => {
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
    getDateRangeEvents(formValue, data => {
      console.log(data);
      setEventList(data);
    });
  };

  return (
    <form className="h-100">
      <h1 className="ml-16">
        Showing transit from {formValue.ts} to {formValue.te}
      </h1>
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
        <Button
          className="mb-32"
          color="primary"
          variant="contained"
          onClick={handleSubmit}
        >
          Display
        </Button>
      </div>
      {eventList.map((e, i) => (
        <TransitEditor key={i} event={e}></TransitEditor>
      ))}
    </form>
  );
};

export default TransitViewer;
