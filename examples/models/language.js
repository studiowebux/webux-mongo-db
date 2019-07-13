// ███╗   ███╗ ██████╗ ██████╗ ███████╗██╗
// ████╗ ████║██╔═══██╗██╔══██╗██╔════╝██║
// ██╔████╔██║██║   ██║██║  ██║█████╗  ██║
// ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██║
// ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗███████╗
// ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝

/**
 * File: language.js
 * Author: Tommy Gingras
 * Date: 2019-07-10
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

module.exports = db => {
  const languageSchema = db.Schema(
    {
      language: { type: String, required: true }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  return db.model("Language", languageSchema);
};
