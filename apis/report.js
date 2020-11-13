const express   = require('express');
const router    = express.Router();

const Attendance      = require("../schemas/attendance");

// Report by Salary
router.get("/salary", (req, res) => {
  Attendance.aggregate([
    { $match: { AttendanceOut: { $ne: null } } },
    {
     "$group": {
      _id: {
        period: {
          $substr: ['$createdAt', 0, 7]
        },
        user_id: "$user_id",
        name: "$name"
      },
      total_attendances: {
        $sum: 1
      }  
     }
    },
    { "$sort": { _id: -1, "createdAt": -1 } },
    { "$project": {
        "period": "$_id.period",
        "user_id": "$_id.user_id",
        "name": "$_id.name",
        "total_attendances": "$total_attendances",
        "_id": 0,
    }},
  ]).exec(  
    (err, data) => {
      if (err) return res.json({ success: false, err_msg: err });
      return res.json({ success: true, data });
    }
  );
});

module.exports = router