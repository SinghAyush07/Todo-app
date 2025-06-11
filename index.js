// todo backend

const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();

// data loader
let data = [];

function readFilePromisified() {
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

async function loadData() {
  data = await readFilePromisified();
}

function writeFilePromisified(data) {
  return new Promise((resolve) => {
    let jsonData = JSON.stringify(data, null, 2);
    fs.writeFile("./todos.json", jsonData, (err) => {
      if (err) {
        console.log(err);
      } else {
        resolve("File updated!");
      }
    });
  });
}

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// Signup route handler
app.post("/signup", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username === password) {
    res.json({
      msg: "Enter different username",
    });
  } else {
    await loadData();
    const existingUser = data.find((usr) => usr === username);
    if (existingUser) {
      res.json({
        msg: "Username Not Available",
      });
    }
    data.push({
      username: username,
      password: password,
      todos: [],
    });
    await writeFilePromisified(data);
    res.json({
      msg: "You are signed up",
    });
  }
});

//Sign in end point -> Give token
app.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  await loadData(); // loads all the data
  const foundUser = data.find(
    (usr) => usr.username === username && usr.password === password
  );

  if (foundUser) {
    const token = jwt.sign(
      {
        username: username,
      },
      process.env.JWT_SECRET
    );
    console.log(process.env.JWT_SECRET);
    res.json({
      token: token,
    });
  } else {
    res.send("Invalid Credentials");
  }
});

//Authorization of token
async function auth(req, res, next) {
  try {
    const token = req.headers.token;

    const decodedInformation = jwt.verify(token, process.env.JWT_SECRET);
    await loadData();

    const usr = data.find(
      (data) => decodedInformation.username === data.username
    );

    if (usr) {
      req.todos = usr.todos;
      next();
    }
  } catch (err) {
    console.log(err);
    res.json({
      msg: "Invalid login",
    });
  }
}

app.use(auth);

// Gets all the todos based on user
app.get("/todos", async function (req, res) {
  const todos = req.todos;

  res.json({
    todos: todos,
  });
});

app.post("/todo", async function (req, res) {
  const todo = req.body.todo;
  const todos = req.todos;

  const todochk = todos.find((tod) => tod === todo);

  if (todochk) {
    res.json({
      msg: "todo is already present",
    });
  } else {
    todos.push(todo);
    await writeFilePromisified(data);
    res.json({
      msg: "todo added",
    });
  }
});

// Deletes todo based on id or index
app.delete("/delete/:id", async function (req, res) {
  let todos = req.todos;
  const index = req.params.id;

  todos.splice(index - 1, 1);

  await writeFilePromisified(data);

  res.json({
    msg: "done",
  });
});

//Updates todo based on index
app.put("/update-todos", async function (req, res) {
  let todos = req.todos;
  const id = req.query.id;
  const updatedTodo = req.body.updatedTodo;

  todos[id - 1] = updatedTodo;

  await writeFilePromisified(data);

  res.json({
    msg: "done",
  });
});

app.listen(3000, () => {
  console.log(`Server is online on port ${3000} .....`);
});
