const express = require("express");
const app = express();

const userController = require("./controller/UserController");


app.use("/user", userController);




app.listen(3010, () => {
  console.log("Run e-commerce project at localhost port 3010");
});


