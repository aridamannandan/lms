"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../../db");
const db_2 = require("../../db");
const db_3 = require("../../db");
const db_4 = require("../../db");
exports.courses = express_1.Router();
exports.courses.get('/', (req, res) => {
    return db_1.Courses.findAll({
        attributes: ['id', 'name']
    })
        .then((allCourses) => {
        res.status(200).send(allCourses);
    })
        .catch((err) => {
        res.status(500).send({
            err
        });
    });
});
exports.courses.post('/', (request, response) => {
    if (!request.body.name)
        return response.status(400).send("COURSE NAME NOT PROVIDED.");
    db_1.Courses.create({
        name: request.body.name
    })
        .then((course) => {
        response.status(200).send(course);
    });
});
exports.courses.get('/:id', (req, res) => {
    return db_1.Courses.findOne({
        attributes: ['id', 'name'],
        where: { id: [req.params.id] }
    })
        .then((course) => {
        res.status(200).send(course);
    })
        .catch((err) => {
        res.status(500).send({
            err
        });
    });
});
exports.courses.get('/:id/batches', (req, res) => {
    db_1.Courses.findOne({
        where: {
            id: req.params.id
        }
    })
        .then((course) => {
        course.getBatches().then((batches) => res.send(batches));
    });
});
exports.courses.post('/:id/batches', (request, response) => {
    if (isNaN(parseInt(request.params.id)))
        return response.status(400).send("COURSE ID IS NOT VALID");
    db_1.Courses.findOne({
        where: {
            id: request.params.id
        }
    })
        .then((course) => {
        db_2.Batches.create({ name: request.body.name }).then((batch) => {
            course.addBatches(batch).then((ans) => response.send(ans));
        });
    });
});
exports.courses.get('/:courseId/batches/:batchId', (req, res) => {
    db_1.Courses.findOne({
        where: {
            id: req.params.courseId
        }
    })
        .then((course) => {
        course.getBatches().then((batchArray) => {
            for (let obj of batchArray) {
                if (obj.CourseBatch.batchId == req.params.batchId)
                    return res.send(obj);
            }
            res.send("NO SUCH BATCH EXIST.");
        });
    });
});
exports.courses.get('/:id/batches/:bid/lectures', (req, res) => {
    db_1.Courses.findOne({ where: { id: req.params.id } })
        .then((course) => {
        if (!course)
            return res.send("NO SUCH COURSE AND LECTURE EXIST.");
        course.getBatches()
            .then((batchArray) => {
            if (!batchArray)
                return res.send("NO SUCH BATCH AND LECTURE EXIST.");
            let exist = false;
            for (let obj of batchArray) {
                if (obj.CourseBatch.batchId == req.params.bid) {
                    exist = true;
                    db_3.Lectures.findAll({
                        where: {
                            batchId: req.params.bid
                        }
                    })
                        .then(lectures => {
                        return res.send(lectures);
                    });
                }
            }
            if (!exist)
                res.send('NO SUCH LECTURE EXIST.');
        });
    });
});
exports.courses.get('/:id/batches/:bid/lectures/:lid', (req, res) => {
    db_3.Lectures.findAll({
        where: {
            id: req.params.lid,
            batchId: req.params.bid
        }
    })
        .then((lectures) => {
        res.status(200).send(lectures);
    })
        .catch((err) => {
        res.status(500).send({
            err
        });
    });
});
exports.courses.post('/:courseId/batches/:batchId/lectures', (request, response) => {
    db_1.Courses.findOne({ where: { id: request.params.courseId } }).then((course) => {
        if (!course)
            return response.send("NO SUCH COURSE EXIST.");
        course.getBatches().then((batches) => {
            if (!batches)
                return response.send("NO SUCH BATCH EXIST.");
            db_3.Lectures.create({
                name: request.body.name,
                batchId: request.params.batchId
            })
                .then((lecture) => response.send(lecture));
        });
    });
});
exports.courses.get('/:id/batches/:bid/teachers', (req, res) => {
    return db_3.Lectures.findAll({
        attributes: ['id'],
        include: [{
                model: db_2.Batches,
                attributes: ['batchName'],
                include: [{
                        model: db_1.Courses,
                        attributes: ['courseName'],
                        required: true
                    }],
                where: {
                    cid: [req.params.id],
                    id: [req.params.bid]
                }
            },
            {
                model: db_4.Teachers,
                attributes: ['teacherName']
            }],
        group: ['tid']
    })
        .then((lectures) => {
        res.status(200).send(lectures);
    })
        .catch((err) => {
        res.status(500).send({
            err
        });
    });
});
exports.courses.get('/:id/batches/:bid/students', (req, res) => {
    db_1.Courses.findOne({
        where: {
            id: req.params.id
        }
    })
        .then((course) => {
        if (!course)
            return res.json("NO SUCH COURSE EXIST.");
        db_2.Batches.findOne({
            where: {
                id: req.params.bid
            }
        })
            .then((batch) => {
            if (!batch)
                return res.json("NO SUCH BATCH EXIST");
            batch.getStudents().then((students) => res.send(students));
        });
    });
});
//add a course
exports.courses.post('/', (req, res) => {
    return db_1.Courses.create({
        courseName: req.body.courseName,
    })
        .then((course) => {
        res.status(200).send(course);
    });
});
//delete a course
exports.courses.delete('/:id', (req, res) => {
    return db_1.Courses.destroy({
        where: { id: [req.params.id] }
    })
        .catch((err) => {
        res.status(500).send({
            err
        });
    });
});
