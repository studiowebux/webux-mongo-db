//  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝
// ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
// ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
// ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝

/**
 * File: db.js
 * Author: Tommy Gingras
 * Date: 2018-07-05
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const db = require("mongoose");
const fs = require("fs");
const path = require("path");

/**
 * this function initialise the database with mongo in memory
 * @param {Object} log The log function, optional
 * @return {Promise} return a promise
 */
function LoadLocalDB(log = console) {
  log.info("Creating Mongo in memory database");
  return new Promise((resolve, reject) => {
    if (log && typeof log !== "object") {
      return reject(new Error("The log parameter must be an object"));
    }
    const MongoInMemory = require("mongo-in-memory");
    const mongoServerInstance = new MongoInMemory();
    const opts = {
      useNewUrlParser: true
    };

    mongoServerInstance.start((error, dbConfig) => {
      if (error) {
        log.error(
          "DB : An error occur while connecting to the mongo in memory database",
          error
        );
        return reject(
          new error("Unable to start the mongo in memory database.")
        );
      } else {
        log.info("DB In Memory : Database successfully started.");
        log.info("HOST " + dbConfig.host);
        log.info("PORT " + dbConfig.port);

        const mongouri = mongoServerInstance.getMongouri("localtest");

        db.connect(mongouri, opts, err => {
          if (err) {
            log.error(
              "DB : An error occur while connecting to the mongo in memory database",
              err
            );
            return reject(
              new error("Unable to connect to the mongo in memory database.")
            );
          } else {
            log.info("DB : mongo in memory Database connection success.");
            return resolve();
          }
        });
      }
    });
  });
}

/**
 * this function initialise the database with external source
 * @param {Object} options The options, the configuration of the database, mandatory
 * @param {Object} log The log function, optional
 * @return {Promise} return a promise
 */
function LoadExternalDB(options, log = console) {
  log.info("Connection to external mongo database");
  return new Promise((resolve, reject) => {
    if (!options || typeof options !== "object") {
      return reject(
        new Error("The options parameter is required and must be an object")
      );
    }
    if (log && typeof log !== "object") {
      return reject(new Error("The log parameter must be an object"));
    }
    db.connect(
      "mongodb://" +
        options.user +
        ":" +
        encodeURIComponent(options.password) +
        options.URL,
      options.advanced,
      err => {
        if (err) {
          log.error(
            "DB : An error occur while connecting to the database" +
              " : " +
              options.URL +
              " | " +
              err
          );
          return reject(
            new error("Unable to connect to the mongo in memory database.")
          );
        } else {
          log.info("DB : Database connection success.");
          return resolve();
        }
      }
    );
  });
}

/**
 * this function initialise the database, after initiliazing the database, this module will load the models.
 * @param {Object} options The options, the configuration of the database, mandatory
 * @param {Object} log The log function, optional
 * @return {Promise} return a promise with the db object
 */
const initDB = (options, log = console) => {
  return new Promise(async (resolve, reject) => {
    if (!options || typeof options !== "object") {
      return reject(
        new Error("The options parameter is required and must be an object")
      );
    }
    if (log && typeof log !== "object") {
      return reject(new Error("The log parameter must be an object"));
    }
    try {
      // set the mongoose to work with promises
      db.Promise = global.Promise;
      // enable the database debugger
      db.set("debug", options.debug);
      // load the local or external databse
      if (options.local) {
        await LoadLocalDB(log);
      } else {
        await LoadExternalDB(log);
      }

      return resolve(db);
    } catch (e) {
      return reject(e);
    }
  });
};

/**
 * this function load the models in Alphabetical order or in a given order.
 * @param {Object} modelDir Where are located the models, mandatory
 * @param {Object} sort an array that contains the order to load the model, optional
 * @param {Object} log The log function, optional
 * @return {VoidFunction} return nothing
 */
const LoadModels = (modelDir, sort = [], log = console) => {
  log.info("DB : Loading Modules...");
  return new Promise((resolve, reject) => {
    let files = sort && sort.length !== 0 ? sort : fs.readdirSync(modelDir);

    files.forEach(filename => {
      try {
        log.info("DB Module :  Load " + filename);
        require(path.join(modelDir, filename));
        log.info("DB Module : " + filename + " Loaded");
      } catch (e) {
        log.error("DB Module : " + filename + " Not Loaded");
        return reject(e);
      }
    });

    return resolve();
  });
};

module.exports = {
  initDB,
  LoadModels,
  db
};
