const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bcrypt = require("bcrypt"); // Для хеширования пароля

// для обработки бинарных данных: файлов multipart-form-data
const multer = require("multer");
// Настройка multer для  файлов
const upload = multer({ dest: "./uploads/" });

const jwt = require("jsonwebtoken"); // Для создания токенов

const router = express.Router();

const prisma = new PrismaClient();

// ----------------------------------------------------------------
// ---------------------------login--------------------------------
// ----------------------------------------------------------------

router.post(`/`, upload.none(), async (req, res) => {
  try {
    const { email, password } = req.body;
    const body = req.body;

    // проверка наличия почты и пароля
    if (!email || !password)
      return res.status(400).json({ message: "Email и пароль обязательны" });

    // проверка существования пользователя по почте.
    const userExisted = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!userExisted)
      return res
        .status(400)
        .json({ message: "Неправильная пара: почта, пароль" });

    // проверка пароля
    const isValidPassword = await bcrypt.compare(
      password,
      userExisted.password,
    );

    // если пользователь в базе есть, но не совпадает пароль
    if (!isValidPassword)
      return res
        .status(400)
        .json({ message: "Неправильная пара: почта, пароль" });

    // если пара логин - пароль совпадают, генерируем токен
    const payload = {
      id: userExisted.id,
      email: userExisted.email,
      role: userExisted.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      // время жизни токена
      expiresIn: "1h",
    });

    const response = {
      access_token: accessToken,
      id: userExisted.id,
      card_id: userExisted.card_id,
      status: userExisted.status,
      access_token_expired_at: Date.now() + 3600000, // Время истечения токена
    };
    return res.json(response);
  } catch (error) {
    // eslint-disable-next-line
    console.error("Ошибка при авторизации пользователя:", error);
    res.status(500).json({ error: `Не удалось авторизоваться: , ${error}` });
  }
});

module.exports = router;
