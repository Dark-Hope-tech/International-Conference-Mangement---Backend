const router =  require("express").Router();
const Course = require("../models/courseModel");
const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");
const Announcement = require("../models/announcementModel");
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
        // if(proffesion!== "Teacher"){
        //     res.send(false).json({error:"Only Teacher can add course"});
        // }
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