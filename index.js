const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const peoples = require("./Peoples");
require('dotenv').config();

//connecting to database
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlPraser: true, useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("connected to database..."));
port = 5000;

//creating database schema
const student = new mongoose.Schema({
  name: String,
  fname: String,
  session: String,
  department: String,
  cgpa: { type: Number, min: 2, max: 4 },
  semester: { type: Number, min: 1, max: 8 },
  email: String,
  phone: String
});

// creating a model for schema
const newStudent = mongoose.model("Students_record", student);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setting view engine
app.engine("handlebars", hbs());
app.set("view engine", "handlebars");

// HOME
app.get("/", (req, res) => {
  res.render("home");
});

// STUDENTS
app.get("/students", (req, res) => {
  newStudent.find({}, (err, newStudent) => {
    if (err) throw err;
    res.render("students", {
      newStudent
    });
  });
});

// SENDING DATA
app.post("/", (req, res) => {
  const newStud = new newStudent(req.body);
  newStud
    .save()
    .then(i => {
      res.redirect("/");
    })
    .catch(error => {
      res.status(400).send("please try again!");
    });
});

// SINGLE ITEM RETREIVING
app.get("/students/:id", (req, res) => {
  newStudent.findById(req.params.id, (err, singleStudent) => {
    if (err) throw err;
    res.render("singleStudent", {
      singleStudent
    });
  });
});

// UPDATE FROM
app.get("/students/:id/edit", (req, res) => {
  newStudent.findById(req.params.id, (err, student) => {
    if (err) throw err;
    res.render("update", {
      student
    });
  });
});

// POSTING UPDATED DATA
app.post("/students/:id/edit", (req, res) => {
  let student = {};
  // student.name = req.body.name;
  // student.fname = req.body.fname;
  // student.session = req.body.session;
  // student.department = req.body.department;
  // student.cgpa = req.body.cgpa;
  // student.semester = req.body.semester;
  // student.email = req.body.email;
  // student.phone = req.body.phone;

  student = req.body;

  let query = { _id: req.params.id };
  newStudent
    .updateOne(query, student, err => {
      if (err) throw err;
    })
    .then(i => {
      res.redirect("/students");
    })
    .catch(error => {
      res.status(400).send("please try again!");
    });
});

// DELETING AN ITEM
app.get("/students/delete/:id", (req, res) => {
  let query = { _id: req.params.id };
  newStudent.findByIdAndDelete(query, err => {
    if (err) console.error(err);
    res.redirect("/students");
  });
});

// app.post("/peoples", (req, res) => {
//   const member = {
//     name: req.body.name,
//     age: req.body.age,
//     rollno: req.body.rollString,
//     department: req.body.department
//   };
// });

app.listen(port, () => {
  console.log("Server is running...");
});
