const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    user_id: {type: String, required: true},
    name: {type: String, required: true},
    timezone: {type: String},
    utc_offset: {type: String},
    abbreviation: {type: String},
    datetime: {type: String},
    utc_datetime: {type: String},
    unixtime: {type: String},
    time: {type: String},
    day_of_week: {type: Number},
    day_of_year: {type: Number},
    week_number: {type: Number},
    client_ip: {type: String},
    imgUrl: {type: String, required: true},
    location: {type: Schema.Types.Mixed, required: true},
    locationDetail: {type: [Object], required: true},
    AttendanceOut: {
      type: Schema.Types.ObjectId,
      ref: 'Attendance'
    },
    type: {type: String, default: 'in'}
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Attendance", DataSchema);
