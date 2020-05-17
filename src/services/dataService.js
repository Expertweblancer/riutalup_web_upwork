import axios from "axios";
import firebase from "../firebase/firebaseConfig";
import { DateTime } from "luxon";

const ref = "/global/events";
let updatedEventList = [];

const queryString = (params) => {
  return Object.keys(params).map(key => key + '=' + params[key]).join('&');
};

const cleanApiData = (s) => {
  let cleanData1 = s
    .replace(/\n/g, "")
    .replace(/\r/g, "")
    .replace(/\t/g, "")
    .replace(/'/g, "\"")
    .replace(/\s\s+/g, '');

  let jsonStr = cleanData1.replace(/(\w+:)|(\w+ :)/g, function(matchedStr) {
    return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
  });

  return JSON.parse(jsonStr)
}

const cleanSvgData = (svgData) => {
	const key = "<svg "
  let split = svgData.split(key)
  split.shift()
  return split.map(x => key + x)
}

const buildSvgDict = (svgList) => {
  const pattern = new RegExp("id=\".*?transit-(.*?)\"")
  return svgList.reduce(function(obj, x) {
    try {
      let id = x.match(pattern)[1]
      obj[id] = x;
      return obj;
    }
    catch (e) {
      console.log(e)
    }
  }, {});
}

export const getGlobalEvents = async data => {
  let { ts, te } = data;
  ts = new Date(ts).toLocaleDateString("en-GB");
  te = new Date(te).toLocaleDateString("en-GB");

  let params = {
    ts: ts,
    te: te,
    json: true,
    svgstring: true
  }

  return axios.get(`http://104.236.110.128:8080/?${queryString(params)}`);
};

export const getUserEvents = async user => {
  let {
    birthLocation,
    date: { utc }
  } = user;

  let bday = `${utc.day}/${utc.month}/${utc.year}/${utc.hour}/${utc.minute}/${utc.second}`;
  let ts = new Date();
  let te = new Date();

  ts.setDate(ts.getDate() - 30);
  te.setDate(te.getDate() + 30);

  ts = ts.toLocaleDateString("en-GB");
  te = te.toLocaleDateString("en-GB");

  let params = {
    n: bday,
    ts: ts,
    te: te,
    json: true,
    lx: birthLocation.latitude,
    ly: birthLocation.longitude,
    svgstring: true
  }

  return axios.get(
    `http://104.236.110.128:8080/?${queryString(params)}`
  );
};

export const setEvents = async formData => {
  let { data } = await getGlobalEvents(formData);

  updatedEventList = [];

  let eventList = eval(data);
  let update = {};

  let existingEventList = await getFirebaseGlobalEvents();

  eventList.map(event => {
    let {
      d,
      date: { day, month, year }
    } = event;
    let child = d.toString().replace(".", "");

    let eventTime = `${year}-${month
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    event.eventTime = eventTime;

    if (existingEventList && existingEventList[child]) return;
    updatedEventList.push(event);
    update[`/${child}`] = event;
  });

  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(ref)
      .update(update)
      .then(data => {
        resolve(updatedEventList);
      });
  });
};

export const setUserEvents = async user => {
  if (!user) return;
  if (!user.birthLocation || !user.date) return;

  let { data } = await getUserEvents(user);
  if (!data) return;
  data = data.split("}\n[");
  let split = data[1].split("]\n<")

  let data1 = data[0] + "}"
  let data2 = "[" + split[0] + "]"
  let svgData = "<" + split[1]

  // let userInfo = cleanApiData(data1)
  let eventList = cleanApiData(data2)
	let svgList = cleanSvgData(svgData)
	let svgDict = buildSvgDict(svgList)

  updatedEventList = [];

  let update = {};
  let existingEventList = await getFirebaseUserEvents(user);
  let blacklist = []

  eventList.map(event => {
    let {
      d,
      date: { day, month, year, hour, minute, second }
    } = event;

    let child = d.toString().replace(".", "")

    try {
      // note: we are only using the first 4 decimal places of `d`
      let split = d.toString().split(".")
      let eventId = split[0] + split[1].slice(0, 4)
	    if (blacklist.indexOf(eventId) >= 0) {
	      return  // item is a duplicate
      }
      blacklist.push(eventId)
    }
    catch (e) {
      console.log(e)
      return
    }

    let eventTime = `${year}-${month
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    event.eventTime = eventTime;

    // attach matching svg object to event
    try {
      // NOTE: id is composed this way: date.day-date.month-date.year-date.hour-date.minute-date.second
    	let eventId = [day, month, year, hour, minute, second.toString().split('.')[0]].join("-")
      event.svg = svgDict[eventId]
    }
    catch (e) {
      console.log(e)
    }

    if (existingEventList && existingEventList[child]) {
      return;
    }

    updatedEventList.push(event);
    update[`/${child}`] = event;
  });

  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(`/users/${user.uid}/events`)
      .update(update)
      .then(data => {
        resolve(updatedEventList);
      });
  });
};

const getFirebaseGlobalEvents = () => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(ref)
      .once("value", snap => {
        resolve(snap.val());
      });
  });
};

export const getDateRangeEvents = (data, callback) => {
  let { ts, te } = data;

  firebase
    .database()
    .ref(ref)
    .orderByChild("eventTime")
    .startAt(ts)
    .endAt(te)
    .on("value", snap => {
      let value = [];
      snap.forEach(e => {
        value.push(e.val());
      });
      callback(value);
    });
};

export const getFirebaseUserEvents = async user => {
  if (!user) return;

  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(`/users/${user.uid}/events`)
      .once("value", snap => {
        let value = [];
        snap.forEach(e => {
          value.push(e.val());
        });
        resolve(value);
      });
  });
};

export const getSingleFirebaseEvent = async id => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(ref)
      .child(id)
      .once("value", snap => {
        resolve(snap.val());
      });
  });
};

export const updateFirebaseEvent = async data => {
  let { d } = data;
  let id = d.toString().replace(".", "");

  return firebase
    .database()
    .ref(ref)
    .child(id)
    .update(data);
};

export const getTz = async (lat, lon) => {
  let url = "http://104.248.119.64:31415/tz/"
  return axios.post(url, {"lat": lat, "lon": lon})
}

export const updateUserProfile = async (formData, user) => {
  let { birthDay, address, latitude, longitude, name } = formData;

  let update = {
    ...user
  };

  let local = {}
  let utc = {}

  if (birthDay) {
    let tz = await getTz(latitude, longitude)
    let timezone = tz.data[0]
  	let dt = DateTime.fromISO(birthDay).setZone(timezone)
    let dtUTC = dt.toUTC()

    local = {
      year: dt.year,
      month: dt.month,
      day: dt.day,
      hour: dt.hour,
      minute: dt.minute,
      second: dt.second
    };

    utc = {
      year: dtUTC.year,
      month: dtUTC.month,
      day: dtUTC.day,
      hour: dtUTC.hour,
      minute: dtUTC.minute,
      second: dtUTC.second
    };

    update.date = { atBirthLocation: local, utc: utc };
    update.birthDay = birthDay;
  }

  if (address) {
    update.birthLocation = {
      name: address,
      latitude,
      longitude
    };
  }

  if (name) update.name = name;

  const updateClosure = () => {
    if (user.uid) {
      return firebase
        .database()
        .ref(`/users`)
        .child(user.uid)
        .update(update)
        .then(tempData => {
          alert("User profile updated");
          return tempData;
        });
    }
  }

  try {
    // load house and sign from other endpoint
    let dt = `${utc.day}/${utc.month}/${utc.year}/${utc.hour}/${utc.minute}/${utc.second}`
    let params = {
      n: dt,
      lx: update.birthLocation.latitude,
	    ly: update.birthLocation.longitude,
      json: true,
    }
    let chartUrl = `http://104.236.110.128:8080/?${queryString(params)}`
    axios.get(chartUrl).then(res => {
      // get the json data we want, then save to user obj
      let userInfo = cleanApiData(res.data)
      user.planets = userInfo.planets
      user.houses = userInfo.houses
      // update the firebase db
      updateClosure()
    })
  } catch (e) {
    updateClosure()
  }
};
