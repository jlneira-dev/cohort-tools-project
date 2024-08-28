const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Schema = mongoose.Schema
const PORT = 5005;

// MONGOOSE
mongoose
  .connect("mongodb://localhost:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));


const cohortsSchema = new Schema({
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

const studentsSchema = new Schema({
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
  "cohort": {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cohort"
  }
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


// STUDENT ROUTES
app.post("/api/students", (req, res) => {
  Student.create(req.body)
    .then(student => res.status(201).json(student))
    .catch(err => res.status(500).json({ message: "Error in creating a student" + err }));
});

app.get("/api/students", (req, res) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

app.get("/api/students/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Student.find({cohort: cohortId})
    .populate("cohort")
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

app.get("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      res.json(student);
    })
    .catch((error) => {
      console.error("Error while retrieving student ->", error);
      res.status(500).json({ error: "Failed to retrieve student" });
    });
});

app.put("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Student.findByIdAndUpdate(studentId, req.body, {new: true})
    .then((student) => {
      res.json(student);
    })
    .catch((error) => {
      console.error("Error while retrieving and updating student ->", error);
      res.status(500).json({ error: "Failed to retrieve and update student" });
    });
});

app.delete("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Student.findByIdAndDelete(studentId)
    .then(() => {
      res.status(204).send()
    })
    .catch((error) => {
      console.error("Error while deleting student ->", error);
      res.status(500).json({ error: "Failed to delete student" });
    });
});

// COHORTS
app.post("/api/cohorts", (req, res) => {
  Cohort.create(req.body)
    .then(cohort => res.status(201).json(cohort))
    .catch(err => res.status(500).json({ message: "Error in creating a cohort" + err }));
});

app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      res.json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findById(cohortId)
    .then((cohort) => {
      res.json(cohort);
    })
    .catch((error) => {
      console.error("Error while retrieving cohort ->", error);
      res.status(500).json({ error: "Failed to retrieve cohort" });
    });
});

app.put("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndUpdate(cohortId, req.body, {new: true})
    .then((cohort) => {
      res.json(cohort);
    })
    .catch((error) => {
      console.error("Error while retrieving and updating cohort ->", error);
      res.status(500).json({ error: "Failed to retrieve and update cohort" });
    });
});

app.delete("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndDelete(cohortId)
    .then(() => {
      res.status(204).send()
    })
    .catch((error) => {
      console.error("Error while deleting cohort ->", error);
      res.status(500).json({ error: "Failed to delete cohort" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
