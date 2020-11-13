const express             = require('express');
const router              = express.Router();
const { verifyToken }     = require("../helpers/jwt");
const Attendance          = require("../schemas/attendance");
const multer              = require('multer');
const path                = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'faces/');
  },
  filename: (req, file, cb) => {
    const ext       = path.extname(file.originalname);
    const filename  = `${file.fieldname}-${Date.now()}`
    cb(null, `${filename}${ext}`);
  }
})
const uploadHandler          = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no longer than 5 Mb
  }
});

// List Attendance
router.get("/:type", (req, res) => {
  const { type } = req.params;

  const conditions = type && type !== 'all' ? { type: req.params.type } : {};

  const user = verifyToken(req.get("token"));

  if (user.role !== "Administrator") {
      conditions.user_id = user.id;
  }
  
  Attendance.find(conditions, (err, data) => {
    if (err) return res.json({ success: false, err_msg: err });
    return res.json({ success: true, data });
  })
  .populate('AttendanceOut')
  .sort({
    'createdAt': 'desc'
  });
});

// Add Data Attendance / Check in
router.post("/", (req, res) => {  
  const user = verifyToken(req.get("token"));
  let { 
    timezone,
    utc_offset,
    abbreviation,
    datetime,
    utc_datetime,
    unixtime,
    day_of_week,
    day_of_year,
    week_number,
    client_ip,
    location, 
    locationDetail, 
    imgFace,
    type
  } = req.body;


  Attendance.find({
    type: 'in',
    user_id: user.id,
    createdAt: {
      $lt: new Date()
    },
    AttendanceOut: {
      $exists: false
    }
  }, (err, data) => {
    if (err) return res.json({ success: false, err_msg: err });
    if (data.length > 0 && type !== 'out') {
      return res.json({ success: false,  err_msg: 'Attendance for today is already exists. Check out first!' });      
    }else {
      const time = new Date();
    
      const data = new Attendance({
        user_id: user.id,
        name: user.name,
        time,
        imgUrl: imgFace,
        location,
        locationDetail,
        timezone, utc_offset, abbreviation, datetime, utc_datetime, unixtime, day_of_week, day_of_year, week_number, client_ip,
        type
     });
    
      data.save((err, attendance) => {
        if (err) return res.json({ success: false, err_msg: err });
        return res.json({ success: true, id: attendance.id });
      });
    }
  });
});

// Check out
router.put('/:id', (req, res) => {
  const { AttendanceOut } = req.body;
  const update = { AttendanceOut };
  
  Attendance.findByIdAndUpdate(req.params.id, update, err => {
    if (err) return res.json({ success: false, err_msg: err });
    return res.json({ success: true });
  });
});

router.post('/upload_face', uploadHandler.single('img_face'), (req, res) => {
  let file = req.files[0];  
  if (!file) {
    res.status(400).json('No Image Detected');      
    return;
  }

  uploadImageToStorage(file)
    .then((url) => {
      res.status(200).json(url);
    })
    .catch((error) => {
      res.status(500).json(error);
      console.error(error);
    });
});

const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    let newFileName = `img_face_${Date.now()}.${file.originalname.split('.').pop()}`;
    let fileUpload  = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (error) => {
      reject(`Something is wrong! unable to upload at the moment: ${error} `);
    });

    blobStream.on('finish', () => {
      const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
}

module.exports = router