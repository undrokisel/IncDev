const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();

// faqs/
router.get("/", async (req, res) => {
  const faqs = await prisma.faq.findMany();
  res.json(faqs);
});

module.exports = router;
