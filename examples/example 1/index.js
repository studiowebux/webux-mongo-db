const path = require("path");
const webuxDB = require("../../index");

// This configuration is NOT recommended for production
const options = {
  sort: [],
  local: true,
  localPort: 27017,
  debug: true,
  modelDir: path.join(__dirname, "..", "models")
};

async function loadApp() {
  console.log("LOAD APP/CONFIGURATION BEFORE ...");
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

  console.log("Webux Mongo DB loaded !");

  console.log("You can continue / start the server ...");
}

try {
  loadApp();
} catch (e) {
  console.error(e);
  process.exit(1);
}
