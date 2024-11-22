const express = require("express");
const app = express();
const bpdyParser = require('body-parser')
const cors = require('cors')

const userController = require("./controller/UserController");
const bodyParser = require("body-parser");

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended : true }))
app.use(cors())

app.use("/user", userController);




app.listen(3010, () => {
  console.log("Run e-commerce project at localhost port 3010");
});


