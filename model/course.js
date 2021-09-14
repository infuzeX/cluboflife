const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please Provide Course Name"]
    },
    //courses: { type: mongoose.Types.ObjectId, ref: 'course' },
    courseCode: {
        type: String,
        required: [true, "Please Provide Course Code"]
    },
    publish: {
        type: Boolean,
        default: true
    },
    createtAt: Date
});

module.exports = mongoose.model("course", courseSchema)