"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
exports.db = new sequelize_1.default({
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
exports.Courses = exports.db.define('course', {
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports.Batches = exports.db.define('batch', {
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
// ???????????????????
exports.Students = exports.db.define('student', {
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports.Subjects = exports.db.define('subject', {
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports.Teachers = exports.db.define('teacher', {
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports.Lectures = exports.db.define('lecture', {
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
//Courses.hasMany(Batches)  // This will add courseId to batches and methods to courses.(get and set.)s
exports.Courses.belongsToMany(exports.Batches, { through: 'CourseBatch' });
exports.Batches.belongsToMany(exports.Courses, { through: 'CourseBatch' });
exports.Subjects.hasMany(exports.Teachers);
exports.Students.belongsToMany(exports.Batches, { through: 'StudentBatch' });
exports.Batches.belongsToMany(exports.Students, { through: 'StudentBatch' });
exports.Batches.hasMany(exports.Lectures);
// Lectures.belongsTo(Subjects)
// Lectures.belongsTo(Teachers)
exports.db.sync()
    .then(() => console.log("Database has been synced"))
    .catch((err) => console.error("Error syncing database " + err));
