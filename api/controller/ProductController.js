const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

app.post("/create", async (req, res) => {
  try {
    // agr = await prisma.model_name.method
    const result = await prisma.product.create({
      data: req.body,
    });
    res.send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = app;
