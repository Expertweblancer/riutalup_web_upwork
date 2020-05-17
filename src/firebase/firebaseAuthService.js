import firebase from "./firebaseConfig";
import history from "../history";

export const loginIntoFirebase = async data => {
  let { email, password } = data;

  let { user } = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);

  if (user) history.push("/user-profile");
  return user;
};

export const logout = async () => {
  return firebase.auth().signOut();
};

export const getLoginStatus = async callback => {
  return await firebase.auth().onAuthStateChanged(callback);
};

export const getUserData = async callback => {
  firebase.auth().onAuthStateChanged(async user => {
    if (user && user.uid) {
      firebase
        .database()
        .ref(`/users`)
        .child(user.uid)
        .on("value", callback);
    } else callback({ val: () => null });
  });
};
