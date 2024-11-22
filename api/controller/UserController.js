const express = require("express");
const app = express.Router();

app.post("/signIn", async (req, res) => {
  try {    
    res.send({ message: "ok" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});


module.exports = app;