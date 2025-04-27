const { PrismaClient } = require("@prisma/client");
const express = require("express");
const { hashSync } = require("bcrypt");

const router = express.Router();

const prisma = new PrismaClient();

// ----------------------------------------------------------------
// ---------------------------api/register/sign-up-----------------
// ----------------------------------------------------------------

  router.post(`/`, async (req, res) => {
  try {
    const { email, username, password } = req.body;
    // проверка существования пользователя.
    if (!email) throw new Error("Email не предоставлен!");

    const isUserExisted = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (isUserExisted)
      throw new Error("Пользователь с таким email уже существует");

    const resp = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashSync(password, 10),
      },
    });

    if (resp?.email) res.status(201).json("Пользователь успешно создан");
    else throw new Error("Непредвиденная ошибка при создании пользователя");
  } catch (error) {
    // eslint-disable-next-line
    console.error("Ошибка при создании пользователя:", error);
    res
      .status(500)
      .json({ error: `Не удалось создать пользователя: , ${error}` });
  }
});

module.exports = router;
