# Webux-app

This module contains the definition of the whole app, it uses global variable to simplify the app structure.

# Installation

```
npm i --save webux-app
```

# Usage

this module wraps the mongoose and mongo-in-memory declaration, it also loads allow to load the models in a specific order in case you need to do that.

The available options,

```
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
```

the models scheme  
for example,

```
const { db } = require("webux-mongo-db");

const userSchema = db.Schema(
  {
    fullname: { type: String, required: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = db.model("User", userSchema);
```

Short example to load the database and create dummy datas,

```
const { initDB } = require("webux-mongo-db");

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
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

SEE LICENSE IN license.txt
