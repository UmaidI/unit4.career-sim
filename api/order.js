const express = require("express");
const router = express.Router();
module.exports = router;

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

// router.post("/", authenticate, async (req, res, next) => {
//   try {
    

//   } catch (e) {
//     next(e);
//   }
// })

