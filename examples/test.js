const path = require("path");

const options = {
  sort: [],
  local: true,
  debug: true,
  URL: "@127.0.0.1:27017/framework",
  user: "",
  password: "",
  modelDir: path.join(__dirname, "models"),
  advanced: {
    keepAlive: 300000,
    socketTimeoutMS: 30000,
    replicaSet: "",
    autoIndex: false,
    useNewUrlParser: true,
    reconnectTries: 30
  }
};

const { initDB } = require("../index");

async function loadApp() {
  await initDB(options);

  // generate data...
  const User = require("./models/user");
  const Language = require("./models/language");

  User.create({ fullname: "Bobby" })
    .then(created => {
      console.log(created);

      User.find()
        .then(created => {
          console.log(created);
        })
        .catch(error => {
          console.error(error);
        });
    })
    .catch(error => {
      console.error(error);
    });
  Language.create({ language: "en" });
}

loadApp();
