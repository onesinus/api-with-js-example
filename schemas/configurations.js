const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    login_logo: {type: String},
    menu_logo: {type: String},
    footer_copyright: {type: String},
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Configuration", DataSchema);
