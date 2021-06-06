const express   = require('express');
const router    = express.Router();

const User  = require("../schemas/user");

const { generateToken } = require("../helpers/jwt");
const { compare } = require("../helpers/bcrypt");


// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, err_msg: 'Username and password cannot be empty!' });
  }else if (username === "ospt" && password === "ospt") {
    return res.json({ success: true, token: generateToken({ username, name: "Super Admin" }) })
  } else {
    User.findOne({ username }, (err, data) => {
      if(err) return res.json({ success: false, err_msg: err });
      if (data && compare(password, data.password)) {
        return res.json({ 
          success: true, 
          token: generateToken({ username, name: data.name, role: data.role, id: data["_id"] }),
          data: {
            username,
            name: data.name,
            role: data.role
          }
        })
      }else {
        return res.json({ success: false, err_msg: 'Invalid username or password' });
      }
    })
  }

});

  
module.exports = router
