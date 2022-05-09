const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const router = express.Router();
// const File = require("./models/fileModel");

const PORT = 5000;
// app.use();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));

// const StudentAssignments = require("./models/studentAssignmentsModel");

const db=mongoose.connect(process.env.MDB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {console.log("DB Connected");});

app.use("/auth", require("./routers/UserRouter"));
app.use("/course", require("./routers/CourseRouter"));
app.listen(PORT, () => console.log('Server started on port:'+ PORT));