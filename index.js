const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const JWT_SECRET = "AyushLovesDevelopment";
const app = express();

// will load whole todos.json to put a new user in the todos.json file
// this function is only used for signup and signin end point
function loadData() {
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

// will only load the todos of a user that is currently signed in
function readTodos(username) {
  return new Promise((resolve) => {
    fs.readFile("./todos.json", "utf-8", (err, content) => {
      if (err) {
        console.log(err);
      } else {
        let data = JSON.parse(content);
        const usr = data.find((user) => username === user.username);
        const usrdata = usr.todos;
        resolve(usrdata);
      }
    });
  });
}

function writeData(data) {
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

async function updateTodo(username, oldTodo, newTodo) {
  let data = await readTodos();
}

async function deleteTodo(todo) {}

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

  let orgdata = await loadData();

  orgdata.push(data);

  let jsondata = JSON.stringify(orgdata);

  await writeData(jsondata);

  res.json({
    msg: "you have signed up",
  });
});

app.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const users = await loadData();

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
    console.log(foundUser.username);
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
  const username = decodedInformation.username;

  const users = await loadData();

  const matchUser = users.find(
    (user) => decodedInformation.username === user.username
  );

  if (matchUser) {
    req.username = matchUser.username;
    next();
  } else {
    res.json({
      msg: "Invalid Credential",
    });
  }
}

app.use(auth);

// add todos
app.post("/todos", async function (req, res) {
  const username = req.username;
  const todo = req.body.todo;

  let data = await loadData();
  const user = data.find((user) => username === user.username);
  user.todos.push(todo);
  const jsondata = JSON.stringify(data);

  await writeData(jsondata);

  res.json({
    msg: "Todos added",
  });
});

app.get("/todos", async function (req, res) {
  const username = req.username;

  const todos = await readTodos(username);

  res.json({
    todos: todos,
  });
});

app.put("/update-todos", async function (req, res) {
  const username = req.username;
  const updatedTsk = req.body;
});

app.delete("/delete-todo", async function (req, res) {
  const username = req.username;
});

app.listen(3000, () => {
  console.log(`Server Live on port ${3000}`);
});
