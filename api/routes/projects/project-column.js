const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();

// POST /api/project-column/create-column - создание новой колонки
router.post("/create-column", async (req, res) => {
  try {
    const { project_id, priority, title } = req.body;
    
    if (!project_id || priority === undefined || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Проверяем, существует ли проект
    const project = await prisma.project.findUnique({
      where: { id: parseInt(project_id) }
    });
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    // Создаем новую колонку
    const newColumn = await prisma.column.create({
      data: {
        title,
        priority: parseInt(priority),
        project: {
          connect: { id: parseInt(project_id) }
        }
      },
      include: {
        tasks: true
      }
    });
    
    res.status(201).json(newColumn);
  } catch (error) {
    console.error("Ошибка при создании колонки:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/project-column/update-column - обновление колонки
router.put("/update-column", async (req, res) => {
  try {
    const { column_id, title, priority, status } = req.body;
    
    if (!column_id) {
      return res.status(400).json({ error: "Missing column_id" });
    }
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (priority !== undefined) updateData.priority = parseInt(priority);
    
    const updatedColumn = await prisma.column.update({
      where: { id: parseInt(column_id) },
      data: updateData,
      include: {
        tasks: true
      }
    });
    
    res.json(updatedColumn);
  } catch (error) {
    console.error("Ошибка при обновлении колонки:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/project-column/set-priority - обновление приоритетов колонок
router.post("/set-priority", async (req, res) => {
  try {
    const { columns } = req.body;
    
    if (!columns || !Array.isArray(columns)) {
      return res.status(400).json({ error: "Invalid columns data" });
    }
    
    // Обновляем приоритеты для всех колонок в транзакции
    const result = await prisma.$transaction(
      columns.map(column => 
        prisma.column.update({
          where: { id: parseInt(column.column_id) },
          data: { priority: parseInt(column.priority) }
        })
      )
    );
    
    res.json({ success: true, columns: result });
  } catch (error) {
    console.error("Ошибка при обновлении приоритетов колонок:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router; 