# Webux-app

This module is a wrapper for mongoose.

# Installation

```
npm i --save webux-mongo-db
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
module.exports = db => {
  const languageSchema = db.Schema(
    {
      language: { type: String, required: true }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  return db.model("Language", languageSchema);
};
```

Short example to load the database and create dummy datas,

```
const path = require("path");

const webuxDB = require("webux-mongo-db");

async function loadApp() {
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

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

SEE LICENSE IN license.txt
