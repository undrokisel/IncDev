const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();

// GET /api/timers/:taskId - получение таймеров задачи
router.get("/:taskId", async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId);

    if (!taskId || isNaN(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const timers = await prisma.timer.findMany({
      where: {
        taskId: taskId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            userCard: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    res.json(timers);
  } catch (error) {
    console.error("Ошибка при получении таймеров:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/timer/start - запуск таймера
router.post("/start", async (req, res) => {
  try {
    const { task_id } = req.body;
    const userId = req.user.id; // Предполагается, что у нас есть middleware для аутентификации

    if (!task_id) {
      return res.status(400).json({ error: "Missing task_id" });
    }

    // Проверяем, нет ли уже активного таймера
    const activeTimer = await prisma.timer.findFirst({
      where: {
        userId: userId,
        isActive: true,
      },
    });

    if (activeTimer) {
      return res.status(400).json({ error: "User already has active timer" });
    }

    const timer = await prisma.timer.create({
      data: {
        taskId: parseInt(task_id),
        userId: userId,
        startTime: new Date(),
        isActive: true,
        deltaSeconds: 0,
      },
    });

    res.status(201).json(timer);
  } catch (error) {
    console.error("Ошибка при запуске таймера:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/timers/stop/:timerId - остановка таймера
router.post("/stop/:timerId", async (req, res) => {
  try {
    const timerId = parseInt(req.params.timerId);

    if (!timerId || isNaN(timerId)) {
      return res.status(400).json({ error: "Invalid timer ID" });
    }

    const timer = await prisma.timer.findUnique({
      where: { id: timerId },
    });

    if (!timer) {
      return res.status(404).json({ error: "Timer not found" });
    }

    if (!timer.isActive) {
      return res.status(400).json({ error: "Timer is not active" });
    }

    const endTime = new Date();
    const deltaSeconds = Math.floor((endTime - timer.startTime) / 1000);

    const updatedTimer = await prisma.timer.update({
      where: { id: timerId },
      data: {
        endTime,
        deltaSeconds,
        isActive: false,
      },
    });

    res.json(updatedTimer);
  } catch (error) {
    console.error("Ошибка при остановке таймера:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
