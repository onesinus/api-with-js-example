const express   = require('express');
const router    = express.Router();
const User      = require("../schemas/user");

/* Clear All Data */
router.delete("/", (req, res) => {
    let arr_Tables = [User];
    for (let index = 0; index < arr_Tables.length; index++) {
      const table = arr_Tables[index];
      table.find((err, data) => {
        data.forEach(function(data) {
          data.remove();
        });
      });
    }
    return res.json({ success: "Semua data telah terhapus" });
  });
  /* End Clear All Data */
  
  module.exports = router
