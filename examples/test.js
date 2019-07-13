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

const webuxDB = require("../index");

async function loadApp() {
  // call db
  const db = new webuxDB(options);
  await db.InitDB();
  await db.LoadModels();

  await db.User.create({ fullname: "Bobby" })
    .then(async created => {
      console.log(created);

      try {
        const users = await db.User.find();
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
  await db.Language.create({ language: "en" });

  console.log("done");
}

loadApp().then(() => {
  process.exit(0);
});
