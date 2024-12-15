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
        status: "payed",
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
        status: "delivered",
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

app.get("/updateStatusToCancel/:billSaleId", async (req, res) => {
  try {
    await prisma.billSale.update({
      data: {
        status: "canceled",
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

app.get("/dashboard", async (req, res) => {
  try {
    let arr = [];
    let myDate = new Date();
    let year = myDate.getFullYear();

    for (let i = 1; i <= 12; i++) { // loop 12 month
      const dayInMonth = new Date(year, i, 0).getDate(); //find days in month
      const billSaleInMonth = await prisma.billSale.findMany({
        where: {
          payDate: {
            gte: new Date(year + "-" + i + "-01"),  // start find bill at day 1
            lte: new Date(year + "-" + i + "-" + dayInMonth), // end find at last day in month
          },
        },
      });
      // billSaleInMonth = find bill in 1 year , results in bill each month (12 bills)
      let sumPrice = 0;
      let sumCost = 0;

      for (let j = 0; j < billSaleInMonth.length; j++) {
        const billSaleObject = billSaleInMonth[j];  // loop only month have bill
        const sum = await prisma.billSaleDetail.aggregate({   
          _sum: {                   // sum func
            price: true,
            cost: true,
          },
          where: {
            billSaleId: billSaleObject.id,
          },
        });

        sumPrice = sum._sum.price ?? 0;   // store value to sumPrice if null show 0
        sumCost = sum._sum.cost ?? 0;
      }
      arr.push({
        month: i,
        sumPrice: sumPrice,
        sumCost: sumCost,
      });
    }
    res.send({ results: arr });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/dashboard/profit", async (req, res) => {
  try {
    const billSales = await prisma.billSale.findMany({
      where: {
        status: {
          in: ["payed", "delivered"],
        },
      },
    });
    let totalProfit = 0;
    let totalPrice = 0;
    let totalCost = 0;

    for (const billSale of billSales) {
      const billSaleDetails = await prisma.billSaleDetail.aggregate({
        _sum: {
          price: true,
          cost: true,
        },
        where: {
          billSaleId: billSale.id,
        },
      });

      const price = billSaleDetails._sum.price ?? 0;
      const cost = billSaleDetails._sum.cost ?? 0;

      (totalPrice += price), (totalCost += cost);
      totalProfit += price - cost;
    }
    const results = {
      totalPrice: totalPrice,
      totalCost: totalCost,
      totalProfit: totalProfit,
    };

    res.send({ results: results });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


module.exports = app;
