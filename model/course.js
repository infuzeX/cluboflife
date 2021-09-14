const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please Provide Course Name"]
    },
    description: {
        type: String,
        maxlength: [200, "Maximum Allowed Character is 200"]
    },
    courseLink: {
        type: String,
        required: [true, "Please Provide Course Link"]
    },
    courseCode: {
        type: String,
        required: [true, "Please Provide Course Code"],
        unique: true
    },
    instructor: {
        type: String,
        required: [true, "Please Provide Instructor"]
    },
    publish: {
        type: Boolean,
        default: true
    },
    createtAt: Date
});

module.exports = mongoose.model("course", courseSchema)