const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const authMiddleware = (req, res, next) => {
  // первый элемент - это после Bearer
  const token = req.headers.authorization?.split(" ")[1];

  try {
    // decoded содержит userId, email и другие данные
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Не авторизован" });
  }
};

// api/user/me
router.get(`/`, authMiddleware, async (req, res) => {
  const profileInfo = await prisma.user.findFirst({
    where: {
      // в реквесте данные о пользователе передаются в поле user
      //  полученные в свою очередь на уровне миддлвары из декодированного токена
      id: Number(req.user.id),
    },
    include: {
      userCard: true
    }
  });

  // const userCard = await prisma.userCard.findFirst({
  //   where: {
  //     id: Number(req.user.id),
  //   }
  // })

  res.json(profileInfo);
});

module.exports = router;
