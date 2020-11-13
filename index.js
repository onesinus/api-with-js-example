/* API Configurations */
require('dotenv').config()

const mongoose_connect  = require("./connections/mongoose");
const express           = require("express");
const cors              = require("cors");
const bodyParser        = require("body-parser");
const logger            = require("morgan");

const app               = express();

const authentication = require("./middlewares/authentication");

app
  .use(cors())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(logger("dev"));
/* END API Configurations */

/* Setup Routes */
const authRoute             = require('./apis/auth');
const dataRoute             = require('./apis/data');
const divisionRoute         = require('./apis/divisions');
const jobTitleRoute         = require('./apis/job_titles');
const userRoute             = require('./apis/user');
const attendanceRoute       = require('./apis/attendance');
const reportRoute           = require('./apis/report');

mongoose_connect();

app
  .get('/', (req, res, next) => res.send("Connected to Restful API"))
  .use('/auth', authRoute)
  .use(authentication)
  .use('/data', dataRoute)
  .use('/divisions', divisionRoute)
  .use('/job_titles', jobTitleRoute)
  .use('/users', userRoute)
  .use('/attendance', attendanceRoute)
  .use('/report', reportRoute)

/* End Setup Routes */

app.listen(3001, () => console.log("Server is running on port 3001"));