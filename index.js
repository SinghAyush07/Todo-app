const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { json } = require("stream/consumers");
const JWT_SECRET = "AyushLovesDevelopment";
const app = express();

function readTodos() {
  return new Promise((resolve) => {
    fs.readFile("./todos.json", "utf-8", (err, content) => {
      if (err) {
        console.log(err);
      } else {
        let data = JSON.parse(content);
        resolve(data);
      }
    });
  });
}

function writeTodos(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile("./todos.json", data, (err) => {
      if (err) {
        console.log(err);
      } else {
        resolve("Todos updated!!");
      }
    });
  });
}

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  let data = {
    username: username,
    password: password,
    todos: [],
  };

  let orgdata = await readTodos();
  orgdata.push(data);

  let jsondata = JSON.stringify(orgdata);

  await writeTodos(jsondata);

  res.json({
    msg: "you have signed up",
  });
});

app.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  let users = await readTodos();

  const foundUser = users.find(
    (users) => username === users.username && password === users.password
  );
  if (foundUser) {
    res.json({
      msg: "you are signed in",
    });
  } else {
    res.json({
      msg: "user not found",
    });
  }
});

app.get("/todos", function (req, res) {});

app.listen(3000);
