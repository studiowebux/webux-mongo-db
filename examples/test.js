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

const { initDB, LoadModels } = require("../index");

async function loadApp() {
  await initDB(options);
  await LoadModels(options.modelDir, options.sort);

  // generate data...
  const User = require("./models/user");
  const Language = require("./models/language");

  await User.create({ fullname: "Bobby" })
    .then(async created => {
      console.log(created);

      try {
        const users = await User.find();
        if (!users) {
          console.error("No users found");
        }

        console.log(users);
      } catch (e) {
        console.error(e);
      }
    })
    .catch(error => {
      console.error(error);
    });
  await Language.create({ language: "en" });

  console.log("done");
}

loadApp();
