const express = require("express");
const app = express();
const cors = require('cors')


const userController = require("./controller/UserController");
const productController = require('./controller/ProductController')
const bodyParser = require("body-parser");

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended : true }))
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.use("/user", userController);
app.use('/product', productController)




app.listen(3010, () => {
  console.log("Run e-commerce project at localhost port 3010");
});


