const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
    student_id:{type:String,required :true},
    submitted:{type:String,require:true}
});
const AssignmentSchema = new mongoose.Schema({
    course: {type: String, required: true},
    description:{type:String,required:true},
    response:{type:[ResponseSchema],require:false}
});
const Assignment = mongoose.model("Assignment", AssignmentSchema);

module.exports = Assignment;