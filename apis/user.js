const express   = require('express');
const router    = express.Router();

const { hash } = require("../helpers/bcrypt");
const { setValue, getValue } = require("../helpers/redis");

const User      = require("../schemas/user");

// All Data
router.get("/", (req, res) => {
  const cache_name = 'users';
  getValue(cache_name, (err, users_cache) => {
    if (users_cache) {
      return res.json({
        success: true,
        data: JSON.parse(users_cache)
      });
    }else {
      User.find((err, data) => {
        if (err) return res.json({ success: false, err_msg: err });
        setValue(cache_name, JSON.stringify(data));
        return res.json({ success: true, data })
      }).sort({
        username: 1
      });
    }
  });
});

// Get all user with approver role
// This must be above /:id, to prevent not pointed to /:id
router.get('/approvers', (req, res) => {
  User.find({ role: 'Approver' }, ['name', 'username'], (err, data) => {
    if (err) return res.json({ success: false, err_msg: err });
    return res.json({ success: true, data });
  }).sort({
    username: 1
  });
});


// Get One
router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err,data) => {
    if (err) return res.send(err);
    return res.json({
      success: true,
      data
    })
  });
})

// Add Data
router.post("/", (req, res) => {
  const { 
    username, 
    name, 
    role, 
    password, 
    job_title_id, 
    division_id,
    daily_salary
  } = req.body;

  if (username == "" && role == "") {
    return res.json({
      success: false,
      err_msg: "INVALID INPUTS"
    });
  }

  let data = new User();

  data["username"]          = username;
  data["name"]              = name;
  data["job_title_id"]      = job_title_id;
  data["division_id"]       = division_id;
  data["role"]              = role;
  data["daily_salary"]      = daily_salary;

  if (password) {    
    data["password"]  = hash(password);
  }

  data.save(err => {
    if (err) return res.json({ success: false, err_msg: err });
    return res.json({ success: true });
  });
});

// Update Data
router.put("/:id", (req, res) => {
  const { 
    username, 
    name, 
    role, 
    password, 
    division_id, 
    job_title_id,
    daily_salary
  } = req.body;
  let update = {};
  
  if (password) { // For update password form
    update.password = hash(password);
  }

  if (username) {
    update = { username, name, division_id, job_title_id, role, daily_salary };
  }
  
  User.findByIdAndUpdate(req.params.id, update, err => {
    if (err) return res.json({ success: false, err_msg: err });
    return res.json({ success: true });
  });
});

// Delete Data
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

module.exports = router