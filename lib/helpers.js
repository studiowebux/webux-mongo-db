/**
 * File: helpers.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

function FirstLetterCaps(text) {
  return text[0].toUpperCase() + text.substring(1);
}

module.exports = FirstLetterCaps;
