const express = require("express");
const router = express.Router();

const { authenticate } = require("./auth");
const prisma = require("../prisma");

router.get("/", authenticate, async (req, res, next)=> {
  try{
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
    });
    res.json(orders);
  } catch(e){
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  const {date, note, productIds } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        date,
        note,
        customerId: req.user.id,
        items: {
          connect: productIds.map(id => ({id: parseInt(id)})),
        },
      },
      include: { items: true },
    });
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({error: "Failed to make order"});
    next(e);
  }
})

router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    if (order.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Not your order' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
