const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();

// POST /api/mark/attach - прикрепление метки к сущности (задаче)
router.post("/attach", async (req, res) => {
  try {
    const { mark_id, entity_type, entity_id } = req.body;

    if (!mark_id || !entity_type || !entity_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Поддерживаем только задачи (entity_type = 2)
    if (entity_type != 2) {
      return res.status(400).json({ error: "Unsupported entity type" });
    }

    // Создаем связь между задачей и меткой
    const taskMark = await prisma.taskMark.create({
      data: {
        task: {
          connect: { id: parseInt(entity_id) },
        },
        mark: {
          connect: { id: parseInt(mark_id) },
        },
      },
      include: {
        mark: true,
      },
    });

    res.status(201).json(taskMark);
  } catch (error) {
    // Обработка ошибки уникального ключа (метка уже прикреплена)
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "Mark is already attached to this entity" });
    }
    console.error("Ошибка при прикреплении метки:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/mark/detach - открепление метки от сущности
router.delete("/detach", async (req, res) => {
  try {
    const { mark_id, entity_type, entity_id } = req.body;

    if (!mark_id || !entity_type || !entity_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Удаляем связь для задач (entity_type = 2)
    if (entity_type == 2) {
      await prisma.taskMark.delete({
        where: {
          taskId_markId: {
            taskId: parseInt(entity_id),
            markId: parseInt(mark_id),
          },
        },
      });
    } else {
      return res.status(400).json({ error: "Unsupported entity type" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при откреплении метки:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
