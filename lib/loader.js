/**
 * File: loader.js
 * Author: Tommy Gingras
 * Date: 2019-07-12
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

/**
 * this function initialise the database with mongo in memory
 * @param {Object} mongoose The mongoose object, Mandatory
 * @param {Object} log The log function, optional
 * @return {Promise} return a promise with the mongoose connected
 */
function LoadLocalDB(mongoose, log = console) {
  return new Promise((resolve, reject) => {
    log.info("Creating Mongo in memory database");
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

        mongoose.connect(mongouri, opts, err => {
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
            return resolve(mongoose);
          }
        });
      }
    });
  });
}

/**
 * this function initialise the database with external source
 * @param {Object} options The options, the configuration of the database, mandatory
 * @param {Object} mongoose The mongoose object, Mandatory
 * @param {Object} log The log function, optional
 * @return {Promise} return a promise with the mongoose connected
 */
function LoadExternalDB(options, mongoose, log = console) {
  return new Promise((resolve, reject) => {
    log.info("Connection to external mongo database");
    if (!options || typeof options !== "object") {
      return reject(
        new Error("The options parameter is required and must be an object")
      );
    }
    if (log && typeof log !== "object") {
      return reject(new Error("The log parameter must be an object"));
    }
    mongoose.connect(
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
          return resolve(mongoose);
        }
      }
    );
  });
}

module.exports = { LoadExternalDB, LoadLocalDB };
