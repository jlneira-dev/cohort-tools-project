const router = require('express').Router();

const Cohort = require('../models/Cohort.model');

router.post("/cohorts", (req, res, next) => {
    Cohort.create(req.body)
        .then(cohort => res.status(201).json(cohort))
        .catch(error => next(error));
});

router.get("/cohorts", (req, res, next) => {
    Cohort.find({})
        .then((cohorts) => res.json(cohorts))
        .catch(error => next(error));
});

router.get("/cohorts/:cohortId", (req, res, next) => {
    const { cohortId } = req.params;
    Cohort.findById(cohortId)
        .then((cohort) => res.json(cohort))
        .catch(error => next(error));
});

router.put("/cohorts/:cohortId", (req, res, next) => {
    const { cohortId } = req.params;
    Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
        .then((cohort) => res.json(cohort))
        .catch(error => next(error));
});

router.delete("/cohorts/:cohortId", (req, res, next) => {
    const { cohortId } = req.params;
    Cohort.findByIdAndDelete(cohortId)
        .then(() => res.status(204).send())
        .catch(error => next(error));
});

module.exports = router;