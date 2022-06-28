const express = require("express");
const res = require("express/lib/response");
const app = express();
const db = require("./connection");
const Employee = require("./employeeModel");
const jwt = require("jsonwebtoken");
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 62ae02359e2a5c2d9fcb424d

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    req.token = bearerHeader.split(" ")[1];
    next();
  } else {
    res.sendStatus(403);
  }
}

app.post("/login", async (req, res) => {
  //authenticate
  const data = await Employee.findById("62ae02359e2a5c2d9fcb424d");
  const email = req.body.email;
  const password = req.body.password;
  let flag = false;

  try {
    data.employeeData.forEach((ele) => {
      if (ele[0].email == email && ele[0].password == password) {
        flag = true;
        const user = ele[0];
        delete user.email;
        delete user.password;

        jwt.sign({ user }, "secretkey", (err, token) => {
          res.json({
            token,
            user,
          });
        });
      }
    });
    if (!flag) res.json("Invalid email/password");
  } catch (err) {
    res.json("Error! Plz try again");
  }
});

app.post("/signup", async (req, res) => {
  //authenticate

  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  try {
    const data = await Employee.findById("62ae02359e2a5c2d9fcb424d");
    const email = req.body.email;
    const password = req.body.password;

    let flag = false;
    let newUser = {
      id: randomInteger(10000,99999),
      email,
      password,
      age: null,
      designation: null,
      teamName: null,
      address: null,
      role: null,
      employeeName: null,
    };

    //check for same email

    data.employeeData.forEach((ele) => {
      if (ele[0].email == email) {
        flag = true;
        res.json("email exists");
      }
    });
    if (!flag) {
      const data1 = await Employee.findByIdAndUpdate(
        "62ae02359e2a5c2d9fcb424d",
        { employeeData: [...data.employeeData, [newUser]] }
      );
      res.json("Success");
    }
  } catch (err) {
    res.json("Error! Plz try again");
  }
});

app.post("/", verifyToken, async (req, res) => {
  const { data } = req.body;

  try {
    const newEntry = await Employee.create({ employeeData: data });
    res.json(newEntry);
  } catch {
    res.status(500).send(error);
  }
});

app.get("/", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const data = await Employee.findById("62ae02359e2a5c2d9fcb424d");
        const finalData = data.employeeData.map((element) => {
          delete element[0].email;
          delete element[0].password;
          return element;
        });
        res.json(finalData);
      }
    });
  } catch (err) {
    res.json("Error! Plz try again");
  }
});

app.put("/:id", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const data = await Employee.findById("62ae02359e2a5c2d9fcb424d");
        // console.log(data.employeeData)
        const age = req.body.age;
        const designation = req.body.designation;
        const teamName = req.body.teamName;
        const address = req.body.address;
        const role = req.body.role;
        const employeeName = req.body.employeeName;

        let id = req.params.id;
        console.log(age, designation, address, role, id);
        let finalData = data.employeeData.map((ele) => {
          if (ele[0].id == id) {
            return [
              {
                id,
                email: ele[0].email,
                password: ele[0].password,
                age,
                designation,
                role,
                employeeName,
                address,
                teamName,
              },
            ];
          }
          return ele;
        });

        console.log("finalData", finalData);
        const data1 = await Employee.findByIdAndUpdate(
          "62ae02359e2a5c2d9fcb424d",
          { employeeData: finalData },
          { new: true }
        );
        console.log("data1", data1.employeeData);
        res.json(data1.employeeData);
      }
    });
  } catch (err) {
    res.json("Error! Plz try again");
  }
});

app.delete("/:id", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const data = await Employee.findById("62ae02359e2a5c2d9fcb424d");

        let temp = data.employeeData;
        let id = req.params.id;

        const data1 = await Employee.findByIdAndUpdate(
          "62ae02359e2a5c2d9fcb424d",
          { employeeData: temp.filter((entry) => entry[0].id !== id) },
          { new: true }
        );
        res.json(data1.employeeData);
      }
    });
  } catch (err) {
    res.json("Error! Plz try again");
  }
});

app.post("/add", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const data = await Employee.findById("62ae02359e2a5c2d9fcb424d");
        const age = req.body.age;
        const designation = req.body.designation;
        const teamName = req.body.teamName;
        const address = req.body.address;
        const role = req.body.role;
        const employeeName = req.body.employeeName;
        const email = req.body.email;
        let flag = false;
        let finalData = data.employeeData.map((ele) => {
          if (ele[0].email == email) {
            flag = true;
            return [
              {
                id: ele[0].id,
                email: ele[0].email,
                password: ele[0].password,
                age,
                designation,
                role,
                employeeName,
                address,
                teamName,
              },
            ];
          }
          return ele;
        });

        if (!flag) {
          res.json("Invalid email");
        } else {
          console.log("finalData", finalData);
          const data1 = await Employee.findByIdAndUpdate(
            "62ae02359e2a5c2d9fcb424d",
            { employeeData: finalData },
            { new: true }
          );
          console.log("data1", data1.employeeData);
          res.json("Success");
        }
      }
    });
  } catch (err) {
    res.json("Error! Plz try again");
  }
});

app.listen(3001, () => {
  console.log("Listening to 3001!");
});
