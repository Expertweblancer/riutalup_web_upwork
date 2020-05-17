import React, { useState, useEffect } from "react";
import { getUserData } from "../firebase/firebaseAuthService";

export const useUserEvents = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    getUserData(user => {
      setUser(user.val());
    });
  }, []);
  return user;
};
