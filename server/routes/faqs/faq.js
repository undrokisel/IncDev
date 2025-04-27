const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();

// faq/
router.get(`/:id`, async (req, res) => {
    const faq = await prisma.faq.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json(faq);
  });
  
module.exports = router;
