const express   = require('express');
const router    = express.Router();

const JobTitle      = require("../schemas/job_titles");

// All Data
router.get("/", (req, res) => {
  JobTitle.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data });
  }).sort({
    description: 1
  });
});

// Get One
router.get('/:id', (req, res) => {
  JobTitle.findById(req.params.id, (err,data) => {
    if (err) return res.send(err);
    return res.json({
      success: true,
      data
    })
  })
})

// Add Data
router.post("/", (req, res) => {
  let data = new JobTitle();

  const { description, division_id } = req.body;

  if (description == "" && division_id == "") {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  data["description"]  = description;
  data["division_id"]  = division_id;


  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// Update Data
router.put("/:id", (req, res) => {
  const { description, division_id } = req.body;
  const update = { description, division_id };
  
  JobTitle.findByIdAndUpdate(req.params.id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// Delete Data
router.delete("/:id", (req, res) => {
  JobTitle.findByIdAndRemove(req.params.id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});


module.exports = router