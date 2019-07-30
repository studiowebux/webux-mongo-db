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

let mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { LoadExternalDB, LoadLocalDB } = require("./lib/loader");
const { FirstLetterCaps } = require("./lib/helpers");

/**
 * this function initialise the database, after initiliazing the database, this module will load the models.
 * @param {Object} options The options, the configuration of the database, mandatory
 * @param {Object} log The log function, optional
 * @return {Promise} return a promise with the db object
 */
function InitDB() {
  return new Promise(async (resolve, reject) => {
    if (!this.options || typeof this.options !== "object") {
      return reject(
        new Error("The options parameter is required and must be an object")
      );
    }
    try {
      // set the mongoose to work with promises
      mongoose.Promise = global.Promise;
      // enable the database debugger
      mongoose.set("debug", this.options.debug);
      // load the local or external databse
      if (this.options.local) {
        this.db = await LoadLocalDB(mongoose, this.log);
      } else {
        this.db = await LoadExternalDB(this.options, mongoose, this.log);
      }

      return resolve();
    } catch (e) {
      this.log.error(e);
      return reject(e);
    }
  });
}

/**
 * this function load the models in Alphabetical order or in a given order.
 * @param {Object} modelDir Where are located the models, mandatory
 * @param {Object} db The DB object, mandatory
 * @param {Object} sort an array that contains the order to load the model, optional
 * @param {Object} log The log function, optional
 * @return {VoidFunction} return nothing
 */
function LoadModels() {
  return new Promise((resolve, reject) => {
    if (!this.options.modelDir || typeof this.options.modelDir !== "string") {
      return reject(
        new Error("The modelDir parameter is required and must be a string")
      );
    }
    if (this.options.sort && typeof this.options.sort !== "object") {
      return reject(new Error("The sort parameter must be an array"));
    }

    this.log.info("DB : Loading Modules...");
    let files =
      this.options.sort && this.options.sort.length !== 0
        ? this.options.sort
        : fs.readdirSync(this.options.modelDir);

    files.forEach(filename => {
      try {
        if (filename.indexOf(".js") > 0) {
          this.log.info("DB Module :  Load " + filename);

          let model = FirstLetterCaps(filename.split(".js")[0]);
          this[model] = require(path.join(this.options.modelDir, filename))(
            this.db
          );
          this.log.info(
            "DB Module : ",
            "\x1b[32m",
            filename,
            " Loaded",
            "\x1b[0m"
          );
        }
      } catch (e) {
        this.log.error(e);
        this.log.error(
          "DB Module : ",
          "\x1b[31m",
          filename,
          " Not Loaded",
          "\x1b[0m"
        );
        return reject(e);
      }
    });

    return resolve();
  });
}

function webuxDB(options, log = console) {
  this.db = null;

  this.options = options;
  this.log = log;
}

webuxDB.prototype.InitDB = InitDB;
webuxDB.prototype.LoadModels = LoadModels;

module.exports = webuxDB;
