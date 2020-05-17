import React, {useContext, useState} from "react";
import {AppContext} from "../AppContext";
import {Button, TextField} from "@material-ui/core";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import GoogleMaps from "./GoogleLocation";
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import axios from "axios";

const ChartNew = () => {
  let user = useContext(AppContext);

  const [formValue, setFormValue] = useState({"birthDay": null});
  const [chartImage, setChartImage] = useState("");

  const handleChange = ({target}) => {
    if (target.name === "name" || target.name === "birthDay") {
      setFormValue({...formValue, [target.name]: target.value});
    }
  };

  const handleBlur = ({target}) => {
    setFormValue({...formValue, [target.name]: target.value});
  }

  const getUtcBirthday = (birthDay) => {
    let date = new Date(birthDay);
    let utc = {};
    utc.year = date.getUTCFullYear();
    utc.month = date.getUTCMonth() + 1;
    utc.day = date.getUTCDate();
    utc.hour = date.getUTCHours();
    utc.minute = date.getUTCMinutes();
    utc.second = date.getUTCSeconds();
    return utc
  }

  const handleSubmit = async () => {
    geocodeByAddress(formValue.address)
      .then(
        results => getLatLng(results[0])
      )
      .then(latLng => {
        let latitude = latLng.lat;
        let longitude = latLng.lng;
        let {birthDay} = formValue;
        birthDay = getUtcBirthday(birthDay);
        let dt = `${birthDay.day}/${birthDay.month}/${birthDay.year}/${birthDay.hour}/${birthDay.minute}/${birthDay.second}`;
        let chartUrl = `http://104.236.110.128:8080/?n=${dt}&lx=${latitude}&ly=${longitude}&svgstring=true`
        axios.get(chartUrl).then(res => {
          setChartImage(res.data);
        })
      })
  };

  return (
    <div className="login-form p-16">
      <TextField
        name="name"
        label="Name"
        className="mb-16"
        variant="outlined"
        fullWidth
        value={formValue.name ? formValue.name : ""}
        onChange={handleChange}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          className="mb-16"
          name="birthday"
          margin="none"
          label="Birth Day"
          inputVariant="outlined"
          type="text"
          fullWidth
          value={formValue.birthDay}
          format="MMMM dd, yyyy :-: HH:mm:ss aa"
          onChange={date => {
            handleChange({target: {name: "birthDay", value: date}});
          }}
        />
      </MuiPickersUtilsProvider>

      <GoogleMaps
        onAddressChange={handleBlur}
        address={formValue.birthLocation ? formValue.birthLocation.name : ""}
      />

      <div className="mb-16"></div>

      <Button
        className="capitalize"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Build Chart
      </Button>

      <div dangerouslySetInnerHTML={{__html: chartImage}}/>
    </div>
  );
};

export default ChartNew;
