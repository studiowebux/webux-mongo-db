/**
 * File: db.js
 * Author: Tommy Gingras
 * Date: 2018-07-05
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

let mongoose = require("mongoose");
const { LoadExternalDB, LoadLocalDB } = require("./loader");
/**
 * this function initialise the database, after initiliazing the database, this module will load the models.
 * @param {Object} options The options, the configuration of the database, mandatory
 * @param {Object} log The log function, optional
 * @return {Promise} return a promise with the db object
 */
function InitDB() {
  return new Promise(async (resolve, reject) => {
    this.log.info("webux-mongo-db - Initialiaze Mongo DB ...");
    try {
      // set the mongoose to work with promises
      mongoose.Promise = global.Promise;
      // enable the database debugger
      mongoose.set("debug", this.options.debug);
      // load the local or external databse
      if (this.options.local) {
        this.log.info("webux-mongo-db - Try to use the local Mongo In Memory");
        this.db = await LoadLocalDB(this.options, mongoose, this.log).catch(
          e => {
            throw e;
          }
        );
        return resolve("webux-mongo-db - Mongo In Memory DB attached");
      } else {
        this.log.info("webux-mongo-db - Try to use the external Mongo DB");
        this.db = await LoadExternalDB(this.options, mongoose, this.log).catch(
          e => {
            throw e;
          }
        );
        return resolve("webux-mongo-db - External DB attached");
      }
    } catch (e) {
      this.log.error("webux-mongo-db - " + e.message);
      return reject(e);
    }
  });
}

module.exports = InitDB;
