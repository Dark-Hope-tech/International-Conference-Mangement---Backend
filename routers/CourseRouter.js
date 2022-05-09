const router =  require("express").Router();
const Course = require("../models/courseModel");
const jwt = require("jsonwebtoken");
const app = require('../index');
const Student = require("../models/studentModel");
const Announcement = require("../models/announcementModel");
const Assignment = require("../models/assignemntModel");
const { updateOne } = require("../models/assignemntModel");
// const Faq = require("../models/faqModel");
// const Schedule = require("../models/scheduleModel");

router.post("/AddCoreCourse",async (req,res) => {
    try {
        const{name,id,credits,description,link,image} = req.body;
        if(!name || !id || !credits || !description || !link || !image)
            return res
                .status(400)
                .json({errorMessage: "Please enter all details"});

        const existingCourse = await Course.findOne({id})
        if(existingCourse)
            return res
                .status(400)
                .json({errorMessage: "A course with same id already exists"});    
        
        var token = req.cookies.token;
        
        if(!token)
            return res.json(false);
        
        token = token.replace('Bearer','');
        var decoded = jwt.decode(token);

        var teacher = await Student.findById(decoded.student);
        var proffesion = teacher.proffesion;
        teacher = teacher.firstName + " " + teacher.lastName;
        if(proffesion!== "Teacher"){
            res.send(false).json({error:"Only Teacher can add course"});
        }
        const NewCourse = new Course({
            name: name,
            id: id,
            credits: credits,
            description: description,
            type: "Core",
            teacher: teacher,
            link: link,
            image: image
        });
        
        await NewCourse.save();

        res.send(true);

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post("/postAssignment",async (req,res) => {
    try{
        const{course_id,des} = req.body;
        const individualCourse = await Course.findById(course_id);
        if(individualCourse)
        {
            // let x = [];
            // let len = individualCourse.student.lenght;
            // for(let i=0;i<len;i++)
            // {
            //     x.push({
            //         student_id: individualCourse.student[i],
            //         submitted: "No"
            //     });
            // }
            let x = individualCourse.student.map(obj => ({
                student_id: obj,
                submitted: "No"
            }));
            //console.log(x);
            newAssignment = new Assignment({
                course: course_id,
                description:des,
                response: x
            });
            await newAssignment.save();
        }
        
        res.send(true);
    }
    catch(err){
        console.error(err);
        res
            .status(401)
            .json({errorMessage: "Unauthorised"});
    }
});
router.post("/AssignmentStatus",async(req,res)=>{
    try {
        const{assign_id,student_id,final_status} = req.body;
        if(!assign_id)
            return res
                .status(400)
                .json({errorMessage: "Please enter all details"});
        console.log(assign_id);
        const existingAssignment = await Assignment.findById(assign_id);
        if(!existingAssignment)
            return res
                .status(400)
                .json({errorMessage: "Assignment does't exist.."});    
        
        var token = req.cookies.token;

        if(!token)
            return res.json(false);
        
        token = token.replace('Bearer','');
        var decoded = jwt.decode(token);
        console.log(decoded);
        var teacher = await Student.findById(decoded.student);
        var proffesion = teacher.proffesion;
        teacher = teacher.firstName + " " + teacher.lastName;
        console.log(teacher);
        if(proffesion!== "Teacher"){
            return res.send(false).json({error:"Only Teacher can change status"});
            
        }
        let len=existingAssignment.response.length;
        for(let i=0;i<len;i++){
            if (existingAssignment.response[i].student_id===student_id) {
                console.log(existingAssignment.response[i]);
                existingAssignment.response[i].submitted = final_status;
                await existingAssignment.save();
                //     { student_id: student_id },
                //     { $set: {submitted:final_status}}
                // );
                return res.send(true);
            }
        }
        // return res.send(false);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
router.get("/GetCoreCourses", async (req,res) => {
    try {
        const getCourses = await Course.find({
            type: "Core"
        });
        res.send(getCourses);

    }catch(err) {
        console.error(err);
        res
            .status(401)
            .json({errorMessage: "Unauthorised"});
    }
});

router.get("/course/:id", async(req, res) => {
    try {
        const individualCourse = await Course.find(req.params.id);
        res.send(individualCourse);

    }catch(err) {
        console.error(err);
        res
            .status(401)
            .json({errorMessage: "Unauthorised"});
    }
});

router.post("/Announcement", async(req, res) => {
    try {
        const{course_id,type,description,link} = req.body;
        
        newAnnouncement = new Announcement({
            course: course_id,
            type: type,
            description: description,
            link: link,
        });

        await newAnnouncement.save();

        res.send(true);

    }catch(err) {
        console.error(err);
        res
            .status(401)
            .json({errorMessage: "Unauthorised"});
    }
});

router.get("/getAnnouncements",  async(req, res) => {
    try {
       
        const AllAnnouncemt= await Announcement.find();
        if(!AllAnnouncemt)
        res
        .status(401)
        .json({errorMessage: "No announcement exist"});
        res.send(AllAnnouncemt);


    }
    catch(err) {
        console.error(err);
        res
            .status(401)
            .json({errorMessage: "No announcement"});
    }
});
router.get("/GetStuCourses", async (req,res) => {
    try {
        var token = req.cookies.token;
        if(!token) 
            res.status(403).json("Permission denied.");
        
        token = token.replace('Bearer','');
        var decoded = jwt.decode(token);
        decoded = decoded.student;
        const stu = await Student.findById(decoded);
        const len = stu.course.length;
        
        const arr = new Array;
        for(i=0;i<len;i++)
        {
            const y = stu.course[i];
            if(y !== null)
            {
                const x = await Course.findOne({id: y});
                const name = x.name;
                const id = x._id;
                const credits = x.credits;
                const teacher = x.teacher;
                const description = x.description;
                const image = x.image;
                arr.push({name,id,credits,teacher,description, image});
            }

        }

        res.send({arr});

    }catch(err) {
        console.error(err);
        res
            .status(401)
            .json({errorMessage: "Unauthorised"});
    }
});
module.exports = router;