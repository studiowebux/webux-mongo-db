/**
 * File: loader.js
 * Author: Tommy Gingras
 * Date: 2019-07-12
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

/**
 * this function initialise the database with mongo in memory
 * @param {Object} options The options object, Mandatory
 * @param {Object} mongoose The mongoose object, Mandatory
 * @param {Object} log The log function, optional
 * @return {Promise} return a promise with the mongoose connected
 */
function LoadLocalDB(options, mongoose, log = console) {
  return new Promise((resolve, reject) => {
    try {
      log.info("webux-mongo-db - Creating Mongo in memory database");

      const MongoInMemory = require("mongo-in-memory");
      const mongoServerInstance = new MongoInMemory(options.localPort);
      const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
      };

      mongoServerInstance.start((error, dbConfig) => {
        if (error) {
          log.error(error);
          return reject(
            new Error("Unable to start the mongo in memory database.")
          );
        } else {
          log.info("webux-mongo-db - Database successfully started.");
          log.debug("HOST " + dbConfig.host);
          log.debug("PORT " + dbConfig.port);

          const mongouri = mongoServerInstance.getMongouri("localtest");

          mongoose.connect(mongouri, opts, err => {
            if (err) {
              log.error(err);
              return reject(
                new Error("Unable to connect to the mongo in memory database.")
              );
            } else {
              log.info(
                "webux-mongo-db - mongo in memory Database connection success."
              );
              return resolve(mongoose);
            }
          });
        }
      });
    } catch (e) {
      throw e;
    }
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
    try {
      log.info("webux-mongo-db - Connection to external mongo database");

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
              "webux-mongo-db - An error occur while connecting to the database" +
                " : " +
                options.URL +
                " | " +
                err
            );
            return reject(
              new Error("Unable to connect to the mongo in memory database.")
            );
          } else {
            log.info("webux-mongo-db - Database connection success.");
            return resolve(mongoose);
          }
        }
      );
    } catch (e) {
      throw e;
    }
  });
}

module.exports = { LoadExternalDB, LoadLocalDB };
