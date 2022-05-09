# International-Conference-Mangement---Backend

This repo is of a web-based application for International Conference Management - Backend. This incorporates development of several modules such User,Course etc. A Course is constructed, for instance, by specifying the broad area of study, the course objectives, NUMERIC of credits. The courses are chosen from a catalogue of courses database. The objectives are brief, clear statements that describe the desired learning outcomes of instruction; i.e., the specific skills, values, and attitudes students should exhibit at the end of the program or after a certain time period following the completion of the program. Classroom is an instance of a course, where the teacher runs a course. This is where teachers interact with students and students interact with: content, teachers, and peers. Students also get evaluated in classrooms and have the freedom to choose the learning modules in collaboration with the teacher.

## Tech Stack
- [NodeJS](https://nodejs.org/en/about/)
- [ExpressJS](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/introduction)


# Getting Started

## Set up in Your local system

1. You must have git and nodejs installed in your local system and an active MongoDB Atlas account to host Database.
2. Fork this repo and then clone the forked repo.
   ```sh
   git clone 'YOUR REPO LINK'
   ```
3. Now create a ``` .env ``` file, and in the file connect MDB services by passing the string in ```MDB_CONNECT ``` and string to be used as jwt secret key as ```JWT_SECRET```.
   ```
   MDB_CONNECT = xx
   JWT_SECRET = xxx
   ```
4. Now install the install dependencies of backend.
    ``` sh
    npm install
    ```
5. Now open another instance of Terminal and run backend server 
    ``` sh
     npm start
    ```
 
 
  
