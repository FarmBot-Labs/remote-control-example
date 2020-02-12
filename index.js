// FarmBotJS requires a global atob() function for
// decoding tokens. In NodeJS, we must add a polyfill.
// To learn more about the issue, see:
//   https://github.com/FarmBot/farmbot-js/issues/33
global.atob = require("atob");

// Now that we have access to atob(), we can load
// FarmbotJS, a Farmbot client.
// NodeJS uses CommonJS modules. You can learn more
// about CommonJS here:
//   https://flaviocopes.com/commonjs/

// The first library we will load is FarmBotJS.
// Using FarmBotJS is a smart idea because it is
// the same wrapper library used by FarmBot, Inc.
// to control FarmBot. Using it ensures that your
// application will remain compatibile with future
// FarmBot OS versions.
//
// Learn more about it here:
//   https://github.com/FarmBot/farmbot-js
const Farmbot = require("farmbot").Farmbot;

// We will need an HTTP client in order to create
// a FarmBot authorization token.
// Learn more about tokens here:
//   https://developer.farm.bot/docs/rest-api#section-generating-an-api-token
// Learn more about Axios the HTTP client here:
//   https://github.com/axios/axios
const post = require("axios").post;

// Now that we have loaded all the third party libraries,
// Let's store some application config as constants.
// We need this information to create an auth token
// and also to log in to the FarmBot server so that
// we can remote control the device.
const PASSWORD = process.env.FARMBOT_PASSWORD;
const EMAIL = process.env.FARMBOT_EMAIL;
const SERVER = process.env.FARMBOT_SERVER || "https://my.farm.bot";

// We will also store some application state in an
// object known as "APPLICATION_STATE".
const APPLICATION_STATE = {
  // This object will be populated later,
  // after we connect to the server.
  // Please see the FarmBotJS documentation for
  // more information about what the FarmBot object
  // can do.
  farmbot: undefined,
  // This application is trivial- it just moves the
  // Z-axis up and down. We will keep track of that
  // here.
  direction: "up",
  // The correct way to track FarmBot's busy state
  // is via Javascript "Promises". Promises are beyond
  // the scope of this example, so we will just use
  // a simple boolean flag.
  // If you don't know what promises are, YouTube
  // tutorials are a good place to start.
  // Promises are tricky to learn at first, but
  // will make your code very clean once you understand
  // them.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
  busy: false
};

// The function below will be used to extract a JSON
// Web Token (JWT) from the Farmbot server. It is
// a callback that will be used by an HTTP POST
// request by Axios later. Continue reading to learn more.
const tokenOK = (response) => {
  console.log("GOT TOKEN: " + response.data.token.encoded);
  return response.data.token.encoded;
};

// This is a generic error handler. We will use it
// to catch miscellaneous "promise rejections".
// Check out egghead.io and YouTube to learn more
// about Javascript promises.
const errorHandler = (error) => {
  console.log("=== ERROR ===");
  console.dir(error);
};

// This function will perform an HTTP post and
// resolve a promise that contains a FarmBot auth
// token (string).
// Call this function with an email and password
const createToken = (email, password) => {
  const payload = { user: { email, password } };
  return post(SERVER + "/api/tokens", payload).then(tokenOK);
};

// This function is called exactly once at the start
// of the application lifecycle.
const start = () => {
  // Perform an HTTP reqeust to create a token:
  return createToken(EMAIL, PASSWORD)
    // Pass the token to FarmBotJS so that we
    // can connect ot the server:
    .then((token) => {
      // Set the global FarmBot object instance for the entire app.
      APPLICATION_STATE.farmbot = new Farmbot({ token: token });
      // Were ready to connect!
      return APPLICATION_STATE.farmbot.connect();
    })
    // Once we are connected to the server,
    // we can display a helpful message.
    .then(() => { console.log("CONNECTED TO FARMBOT!"); })
    // If anything goes wrong, throw the error to
    // our error handler function.
    .catch(errorHandler);
};

// This is the main loop of the application.
// It gets called every 3,000 ms.
// You don't need to do it like this in a real app,
// but it is good enough for our purposes.
const loop = () => {
  // Perform busy handling.
  // This is to prevent sending too many commands.
  // In a real world application, you should use
  // promises.
  if (APPLICATION_STATE.busy) {
    console.log("Busy. Not running loop.");
    return;
  } else {
    console.log("Move Z Axis " + APPLICATION_STATE.direction);
    APPLICATION_STATE.busy = true;
  }

  // Are we moving the z-axis up, or down?
  if (APPLICATION_STATE.direction == "up") {
    // Move the bot up.
    APPLICATION_STATE
      .farmbot
      .moveRelative({ x: 0, y: 0, z: 1 })
      .then(() => {
        APPLICATION_STATE.direction = "down";
        APPLICATION_STATE.busy = false;
      })
      .catch(errorHandler);
  } else {
    // Move the bot down.
    APPLICATION_STATE
      .farmbot
      .moveRelative({ x: 0, y: 0, z: -1 })
      .then(() => {
        APPLICATION_STATE.direction = "up";
        APPLICATION_STATE.busy = false;
      })
      .catch(errorHandler);
  }
};

// OK. Everything is ready now.
// Let's connect to the server and start the main
// loop.
// I've added a quick "safety check" in case
// `.env` is missing:
if (PASSWORD && EMAIL) {
  // It is important to use promises here-
  // The run loop won't start until we are finished
  // connecting t the server. If we don't do this,
  // the app might try to send commands before we
  // are connected to the server
  start()
    // setInterval will call a function every X milliseconds.
    // In our case, it is the main loop.
    // https://www.w3schools.com/jsref/met_win_setinterval.asp
    .then(() => setInterval(loop, 3000));
} else {
  // You should not see this message if your .env file is correct:
  throw new Error("You did not set FARMBOT_EMAIL or FARMBOT_PASSWORD in the .env file.");
}

// That's the end of the tutorial!
// The most important next step is to learn FarmBotJS.
// It has everything you need to control a FarmBot remotely.
// Learn more at:
//   https://github.com/FarmBot/farmbot-js
