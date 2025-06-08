const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "AyushLovesDevelopment";
const app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", function (req, res) {});

app.post("/signin", function (req, res) {});

app.get("/todos", function (req, res) {});

app.listen(3000);
