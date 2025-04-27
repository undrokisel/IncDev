const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();

router.get(`/`, async (req, res) => {
  try {
    // параметры из запроса

    // валидация параметров
    // if (!userId || isNaN(expandedColumns))
    //     return res.status(400).json({ error: "Invalid user_id" });

    const profiles = await prisma.project.findMany({
      // where: {
      //     executors: {
      //         some: { id: Number(userId) },
      //     },
      // },
      // select: {
      //     id: true,
      //     title: true,
      //     description: true,
      //     status: true,
      //     created_at: true,
      //     updated_at: true,
      //     dead_line: true,
      //     creatorId: true,
      //     executors: true,
      //     columns: {
      //         select: {
      //             id: true,
      //             title: true,
      //             priority: true,
      //             tasks: true,
      //         },
      //     },
      // },
    });

    res.json({ profiles });
  } catch (error) {
    console.error("Ошибка при получении профилей разработчиков: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
