const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fileupload = require("express-fileupload");

dotenv.config();

app.use(fileupload());

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

    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/upload", async (req, res) => {
  try {
    if (req.files != undefined) {
      if (req.files.img != undefined) {
        const img = req.files.img;
        const fs = require("fs");
        const myDate = new Date();
        const y = myDate.getFullYear();
        const m = myDate.getMonth()+1;
        const d = myDate.getDate();
        const h = myDate.getHours();
        const mi = myDate.getMinutes();
        const s = myDate.getSeconds();
        const ms = myDate.getMilliseconds();

        const arrFileName = img.name.split('.');
        const ext = arrFileName[arrFileName.length - 1]
        //create file name from upload date
        const newName = `${y}${m}${d}${h}${mi}${s}${ms}.${ext}`

        img.mv('./uploads/' + newName, (err) => {
          if(err) throw err

          res.send({ newName : newName })
        })
      } 
    } else {
      res.status(501).send('not implemented')
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = app;
