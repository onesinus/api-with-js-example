const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    username: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    division_id: {type: String, required: true},
    job_title_id: {type: String, required: true},
    role: {type: String, required: true},
    password: {type: String},
    daily_salary: {type: Number}
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("User", DataSchema);
