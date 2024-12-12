const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.post("/save", async (req, res) => {
  try {
    const rowBillSale = await prisma.billSale.create({
      data: {
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        customerAddress: req.body.customerAddress,
        payDate: new Date(req.body.payDate),
        payTime: req.body.payTime,
      },
    });

    console.log(req.body);

    for (let i = 0; i < req.body.cartItems.length; i++) {
      const rowProduct = await prisma.product.findFirst({
        where: {
          id: req.body.cartItems[i].id,
        },
      });

      await prisma.billSaleDetail.create({
        data: {
          billSaleId: rowBillSale.id,
          productId: rowProduct.id,
          cost: rowProduct.cost,
          price: rowProduct.price,
        },
      });
    }

    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/list", async (req, res) => {
  try {
    const results = await prisma.billSale.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.send({ results: results });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/billInfo/:billSaleId", async (req, res) => {
  try {
    const results = await prisma.billSaleDetail.findMany({
      include: {
        Product: true,
      },
      where: {
        billSaleId: parseInt(req.params.billSaleId),
      },
      orderBy: {
        id: "desc",
      },
    });

    res.send({ results: results });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/updateStatusToPay/:billSaleId", async (req, res) => {
  try {
    await prisma.billSale.update({
      data: {
        status: "pay",
      },
      where: {
        id: parseInt(req.params.billSaleId),
      },
    });

    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/updateStatusToSend/:billSaleId", async (req, res) => {
  try {
    await prisma.billSale.update({
      data: {
        status: "send",
      },
      where: {
        id: parseInt(req.params.billSaleId),
      },
    });
    res.send({ message: "success" });
  } catch (error) {
    res.sendStatus(500).send({ message: error.message });
  }
});

module.exports = app;
