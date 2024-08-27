const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Schema = mongoose.Schema
const PORT = 5005;

// MONGOOSE
mongoose
  .connect("mongodb:localhost:27017/cohorts-tools-api")
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));


const cohortsSchema = new Schema ({
  "inProgress": Boolean,
  "cohortSlug": String,
  "cohortName": String,
  "program": String,
  "campus": String,
  "startDate": Date,
  "endDate": Date,
  "programManager": String,
  "leadTeacher": String,
  "totalHours": Number
})

const Cohort = mongoose.model("Cohort", cohortsSchema);

const studentsSchema = new Schema ({
  "firstName": String,
  "lastName": String,
  "email": String,
  "phone": String,
  "linkedinUrl": String,
  "languages": Array,
  "program": String,
  "background": String,
  "image": String,
  "projects": Array,
  "cohort": {type: mongoose.Schema.Types.ObjectId,
  ref: "Cohort"}
})

const Student = mongoose.model("Student", studentsSchema)

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    // Add the URLs of allowed origins to this array
    origin: [`http://localhost:5173`],
  })
);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);
      res.json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

app.get("/api/students", (req, res) => {
  Student.find({})
    .then((students) => {
      console.log("Retrieved cohorts ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
