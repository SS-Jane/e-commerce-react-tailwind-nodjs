const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fileupload = require("express-fileupload");
const exceljs = require("exceljs");

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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20

    const skip = (page -1) * pageSize
    const take = pageSize

    const data = await prisma.product.findMany({
      skip : skip,
      take : take,
      orderBy: {
        id: "desc",
      },
      where: {
        status: "use",
      },
    });

    const totalCount = await prisma.product.count({
      where : {
        status : 'use'
      }
    })
    const totalPages = Math.ceil(totalCount / pageSize)

    res.send({ results: data,
      totalCount : totalCount,
      totalPages : totalPages,
      currentPage : page,
     });
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
    const fs = require('fs')
    const oldData = await prisma.product.findFirst({
      where : {
        id : parseInt(req.body.id)
      }
    })
    //remove old image
    const imagePath = './uploads/' + oldData.img;

    if(oldData.img != ''){
      if (fs.existsSync(imagePath)) {
        await fs.unlinkSync(imagePath)
      }
    }
    
    
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
        const m = myDate.getMonth() + 1;
        const d = myDate.getDate();
        const h = myDate.getHours();
        const mi = myDate.getMinutes();
        const s = myDate.getSeconds();
        const ms = myDate.getMilliseconds();

        const arrFileName = img.name.split(".");
        const ext = arrFileName[arrFileName.length - 1];
        //create file name from upload date
        const newName = `${y}${m}${d}${h}${mi}${s}${ms}.${ext}`;

        img.mv("./uploads/" + newName, (err) => {
          if (err) throw err;

          res.send({ newName: newName });
        });
      }
    } else {
      res.status(501).send("not implemented");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/uploadFromExcel", (req, res) => {
  try {
    
    const fileExcel = req.files.fileExcel;

    if(fileExcel != undefined) {

      if(fileExcel != null) {

        fileExcel.mv("./uploads/" + fileExcel.name, async (error) => {
          if (error) throw error;
          // read from file and insert to database
          const workbook = new exceljs.Workbook();
          await workbook.xlsx.readFile("./uploads/" + fileExcel.name);
    
          const ws = workbook.getWorksheet(1);
    
          for (let i = 2; i <= ws.rowCount; i++) {
            const name = ws.getRow(i).getCell(1).value ?? "";
            const cost = ws.getRow(i).getCell(2).value ?? 0;
            const price = ws.getRow(i).getCell(3).value ?? 0;
    
            //check if each row and cell don't have data
            if (name != "" && cost >= 0 && price >= 0) {
              //create data from excel to database
              await prisma.product.create({
                data: {
                  name: name,
                  cost: cost,
                  price: price,
                  img: "",
                },
              });
            }
            }
            
          // remove file from server
          const fs = require("fs");
          await fs.unlinkSync("./uploads/" + fileExcel.name);
    
          res.send({ message: "success" });
        });

      } else {
        res.status(500).send({ message : 'File excel is null'})
      } 
      
    } else {
        res.status(500).send({ message : 'File excel is undefined'})
    }

   
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/total', async (req,res) => {
  try {
    const results = await prisma.product.count( {
      where : {
        status : 'use'
      }
    })
    res.send({ results : results })
  } catch (error) {
    res.status(500).send({ error : error.message })
  }
})
module.exports = app;
