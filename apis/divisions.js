const express   = require('express');
const router    = express.Router();

const Division      = require("../schemas/divisions");

// All Data
router.get("/", (req, res) => {
  Division.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data });
  }).sort({
    description: 1
  });
});

// Get One
router.get('/:id', (req, res) => {
  Division.findById(req.params.id, (err,data) => {
    if (err) return res.send(err);
    return res.json({
      success: true,
      data
    })
  })
})

// Add Data
router.post("/", (req, res) => {
  let data = new Division();

  const { description, approver_id } = req.body;

  if (description == "" && approver_id == "") {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  data["description"]  = description;
  data["approver_id"]  = approver_id;


  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// Update Data
router.put("/:id", (req, res) => {
  const { description, approver_id } = req.body;
  const update = { description, approver_id };
  
  Division.findByIdAndUpdate(req.params.id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// Delete Data
router.delete("/:id", (req, res) => {
  Division.findByIdAndRemove(req.params.id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});


module.exports = router