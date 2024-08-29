
const router = require('express').Router();

// const mongoose = require("mongoose");

const Student = require('../models/Student.model');

router.post("/students", (req, res, next) => {
    Student.create(req.body)
        .then(student => res.status(201).json(student))
        .catch(error => next(error));
});

router.get("/students", (req, res, next) => {
    Student.find({})
        .populate("cohort")
        .then((students) => res.json(students))
        .catch(error => next(error));
});

router.get("/students/cohort/:cohortId", (req, res, next) => {
    const { cohortId } = req.params;
    Student.find({ cohort: cohortId })
        .populate("cohort")
        .then((students) => res.json(students))
        .catch(error => next(error));
});

router.get("/students/:studentId", (req, res, next) => {
    const { studentId } = req.params;
    Student.findById(studentId)
        .populate("cohort")
        .then((student) => res.json(student))
        .catch(error => next(error));
});

router.put("/students/:studentId", (req, res, next) => {
    const { studentId } = req.params;
    Student.findByIdAndUpdate(studentId, req.body, { new: true })
        .then((student) => res.json(student))
        .catch(error => next(error));
});

router.delete("/students/:studentId", (req, res, next) => {
    const { studentId } = req.params;
    Student.findByIdAndDelete(studentId)
        .then(() => res.status(204).send())
        .catch(error => next(error));
});

module.exports = router;