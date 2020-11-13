const mongoose      = require("mongoose");

const mongoose_connect = () => {
    // this is our MongoDB database
      let dbRoute = '';
      if (process.env.NODE_ENV === "dev") {
        dbRoute = process.env.DB_URL_DEV;
      }else {
        dbRoute = process.env.DB_URL;
      }
              
      // connects our back end code with the database
      const mongooseOps = { 
        useNewUrlParser: true, 
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
      };
      
      mongoose.connect(dbRoute, mongooseOps, function(err) {
        if (err) { return console.error('Failed connect to database ', err);}
      });
      
      let db = mongoose.connection;
      
      db.once("open", () => console.log("connected to the database"));
      
      // checks if connection with the database is successful
      db.on("error", console.error.bind(console, "MongoDB connection error:"));     
}

module.exports = mongoose_connect;