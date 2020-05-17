import React, { useState } from "react";
import { TextField, Button, Card } from "@material-ui/core";
import { loginIntoFirebase } from "../firebase/firebaseAuthService";

const Login = () => {
  const [formValue, setFormValue] = useState({});

  const handleChange = ({ target }) => {
    setFormValue({ ...formValue, [target.name]: target.value });
  };

  const handleSubmit = async () => {
    loginIntoFirebase(formValue);
  };

  return (
    <form className="login-form-wrapper h-100">
      <Card className="login-form text-center p-24" elevation={3}>
        <TextField
          //   size="small"
          type="email"
          label="Email"
          variant="outlined"
          placeholder="abc@xmail.com"
          className="mb-16"
          name="email"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          //   size="small"
          type="password"
          label="Password"
          variant="outlined"
          placeholder="abc@xmail.com"
          className="mb-16"
          name="password"
          fullWidth
          onChange={handleChange}
        />
        <Button color="primary" variant="contained" onClick={handleSubmit}>
          Login
        </Button>
      </Card>
    </form>
  );
};

export default Login;
