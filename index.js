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

function updateTodo(oldTodo, newTodo) {}

function deleteTodo(todo) {}

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
    const token = jwt.sign(
      {
        username: foundUser.username,
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
  } else {
    res.json({
      msg: "user not found",
    });
  }
});

// single point authorization for getting todos, updating and deleting todos
async function auth(req, res, next) {
  const token = req.headers.token;
  const decodedInformation = jwt.verify(token, JWT_SECRET);

  const users = await readTodos();

  const matchUser = users.find(
    (user) => decodedInformation.username === user.username
  );

  if (matchUser) {
    req.username == matchUser.username;
    next();
  } else {
    res.json({
      msg: "Invalid Credential",
    });
  }
}

app.use(auth);

app.get("/todos", async function (req, res) {
  const username = req.username;

  const data = await readTodos();
});

app.put("/update-todos", async function (req, res) {
  const username = req.username;
});

app.delete("/delete-todo", async function (req, res) {
  const username = req.username;
});

app.listen(3000, () => {
  console.log(`Server Live on port ${3000}`);
});
