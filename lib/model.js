/**
 * File: models.js
 * Author: Tommy Gingras
 * Date: 2018-07-05
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const fs = require("fs");
const path = require("path");
const FirstLetterCaps = require("./helpers");

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
    this.log.info("webux-mongo-db - Loading Models ...");
    let files =
      this.options.sort && this.options.sort.length !== 0
        ? this.options.sort
        : fs.readdirSync(this.options.modelDir);

    files.forEach(filename => {
      try {
        if (!this.options.sort || this.options.sort.length === 0) {
          // if we are in auto detect mode
          if (filename.indexOf(".js") === -1) {
            this.log.debug(
              "webux-mongo-db - Skip " + filename + ", Invalid file extension."
            );
            // if the file does not contains .js extension.
            return; // skip that file
          }
        }
        this.log.info("webux-mongo-db - Load " + filename);
        let model = FirstLetterCaps(filename.split(".js")[0]);
        this[model] = require(path.join(this.options.modelDir, filename))(
          this.db
        );
        this.log.info(
          "webux-mongo-db - ",
          "\x1b[32m",
          filename,
          " Loaded",
          "\x1b[0m"
        );
      } catch (e) {
        this.log.error(
          "webux-mongo-db - File not loaded " +
            filename +
            ", Reason : " +
            e.message
        );
        return reject(e);
      }
    });

    return resolve();
  });
}

module.exports = LoadModels;
