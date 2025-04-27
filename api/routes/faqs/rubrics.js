const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();

// rubrics/
router.get("/", async (req, res) => {
  const rubrics = await prisma.rubric.findMany();
  res.json(rubrics);
});

module.exports = router;
