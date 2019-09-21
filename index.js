//  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝
// ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
// ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
// ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝

/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2018-07-05
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const InitDB = require('./lib/db');
const LoadModels = require('./lib/model');

/**
 * An object To use mongoose within our app.
 * @param {Object} options The options, Mandatory
 * @param {Object} log The custom logger function, optional
 */
function webuxDB(options, log = console) {
  this.db = null;

  this.options = options;
  this.log = log;
}

webuxDB.prototype.InitDB = InitDB;
webuxDB.prototype.LoadModels = LoadModels;

module.exports = webuxDB;
