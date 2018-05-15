import Sequelize from 'sequelize';
import { Course } from './interfaces/Course';
import { Batch } from './interfaces/Batch';
import { Student } from './interfaces/Student';
import { Subject } from './interfaces/Subject';
import { Teacher } from './interfaces/Teacher';
import { Lecture } from './interfaces/Lecture';

export const db = new Sequelize({
    username: 'root',
    password: 'Passw0rd',
    database: 'learning_management_solution',
    host: 'localhost',
    dialect: 'mysql',
   // storage: 'data.db',
    pool: {
        max: 5,
        min: 0,
        idle: 5000
    }
});

export const Courses = db.define<Course, any>('course', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

export const Batches = db.define<Batch, any>('batch', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})



// ???????????????????
export const Students = db.define<Student, any>('student', {   
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

export const Subjects = db.define<Subject, any>('subject', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

export const Teachers = db.define<Teacher, any>('teacher', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

export const Lectures = db.define<Lecture, any>('lecture', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Courses.hasMany(Batches)  // This will add courseId to batches and methods to courses.(get and set.)s
Courses.belongsToMany(Batches, {through: 'CourseBatch'})
Batches.belongsToMany(Courses, {through: 'CourseBatch'})

Subjects.hasMany(Teachers)

Students.belongsToMany(Batches, {through: 'StudentBatch'})
Batches.belongsToMany(Students, {through: 'StudentBatch'})

Batches.hasMany(Lectures)
// Lectures.belongsTo(Subjects)
// Lectures.belongsTo(Teachers)


db.sync()
    .then(() => console.log("Database has been synced"))
    .catch((err) => console.error("Error syncing database " + err))


