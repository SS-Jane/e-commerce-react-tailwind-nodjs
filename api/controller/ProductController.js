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
    await prisma.product.create({
      data: req.body,
    });
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/list", async (req, res) => {
  try {
    const data = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        status: "use",
      },
    });
    res.send({ results: data });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.delete("/remove/:id", async (req, res) => {
  try {
    await prisma.product.update({
      data: {
        status: "delete",
      },
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.put("/update", async (req, res) => {
  try {
    await prisma.product.update({
      data: req.body,
      where: {
        id: parseInt(req.body.id),
      },
    });

    res.send({ message : 'success'})
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = app;
