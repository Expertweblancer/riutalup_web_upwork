import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContext";

import { TextField, Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import GoogleMaps from "./GoogleLocation";
import { updateUserProfile } from "../services/dataService";
import ReactPlaces from "./ReactPlaces";

const ProfileEditor = () => {
  let user = useContext(AppContext);

  const [formValue, setFormValue] = useState({});

  useEffect(() => {
    if (formValue.address) {
      geocodeByAddress(formValue.address)
        .then(results => getLatLng(results[0]))
        .then(latLng => {
          setFormValue({
            ...formValue,
            latitude: latLng.lat,
            longitude: latLng.lng
          });
        });
    }
  }, [formValue.address]);

  useEffect(() => {
    if (user) setFormValue(user);
  }, [user]);

  const handleChange = ({ target }) => {
    setFormValue({ ...formValue, [target.name]: target.value });
  };

  const handleSubmit = async () => {
    updateUserProfile(formValue, user);
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
          margin="none"
          label="Birth Day"
          inputVariant="outlined"
          type="text"
          fullWidth
          value={formValue.birthDay}
          // value={formValue.birthDay ? new Date(formValue.birthDay) : new Date()}
          format="MMMM dd, yyyy :-: HH:mm:ss aa"
          onChange={date => {
            console.log(date);
            handleChange({ target: { name: "birthDay", value: date } });
          }}
        />
      </MuiPickersUtilsProvider>

      <GoogleMaps
        onAddressChange={handleChange}
        address={formValue.birthLocation ? formValue.birthLocation.name : ""}
      ></GoogleMaps>
      {/* <ReactPlaces></ReactPlaces> */}

      <div className="mb-16"></div>
      <Button
        className="capitalize"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Save
      </Button>
    </div>
  );
};

export default ProfileEditor;
