const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();

router.get(`/`, async (req, res) => {
  try {
    // параметры из запроса
    const userId = parseInt(req.query.user_id);
    const expandTimers = req.query.expand === "timers";

    // валидация параметров
    if (!userId || isNaN(expandTimers))
      return res.status(400).json({ error: "Invalid user_id" });

    const userTasks = await prisma.task.findMany({
      where: {
        executorId: userId,
      },
      // include: {
      //   timers: expandTimers
      // }
    });

    // console.log(userTasks);
    res.json(userTasks);
  } catch (error) {
    console.error("Ошибка при получении всех задач: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/task/get-task - получение задачи по id
router.get("/get-task", async (req, res) => {
  try {
    const taskId = parseInt(req.query.task_id);
    const expand = req.query.expand;

    if (!taskId || isNaN(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        executor: {
          select: {
            id: true,
            username: true,
            userCard: true,
          },
        },
        project: true,
        timers: true,
        // Если запрошено расширение mark
        ...(expand === "mark" && {
          marks: {
            include: {
              mark: true,
            },
          },
        }),
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Преобразуем marks в формат, ожидаемый фронтендом
    if (expand === "mark") {
      task.mark = task.marks.map((tm) => tm.mark);
      delete task.marks;
    }

    res.json(task);
  } catch (error) {
    console.error("Ошибка при получении задачи:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/task/get-user-tasks - получение задач пользователя
router.get("/get-user-tasks", async (req, res) => {
  try {
    // параметры из запроса
    const userId = parseInt(req.query.user_id);
    const expandTimers = req.query.expand === "timers";

    // валидация параметров
    if (!userId || isNaN(expandTimers))
      return res.status(400).json({ error: "Invalid user_id" });

    const userTasks = await prisma.task.findMany({
      where: {
        executorId: userId,
      },
      // include: {
      //   timers: expandTimers
      // }
    });

    // console.log(userTasks);
    res.json(userTasks);
  } catch (error) {
    console.error("Ошибка при получении задач пользователя: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/task/update-task - обновление задачи
router.put("/update-task", async (req, res) => {
  try {
    const {
      task_id,
      title,
      description,
      execution_priority,
      dead_line,
      executorId,
    } = req.body;

    if (!task_id || isNaN(task_id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(task_id) },
      data: {
        title,
        description,
        execution_priority:
          execution_priority !== undefined
            ? parseInt(execution_priority)
            : undefined,
        dead_line: dead_line ? new Date(dead_line) : undefined,
        executorId: executorId ? parseInt(executorId) : undefined,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/task/archive-task - архивация задачи
router.post("/archive-task", async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: "Missing taskId" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: {
        status: "ARCHIVED", // Предполагаем, что в схеме есть поле status
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Ошибка при архивации задачи:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/task/delete-task - удаление задачи
router.delete("/delete-task", async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: "Missing taskId" });
    }

    // Сначала удаляем связанные таймеры
    await prisma.timer.deleteMany({
      where: { taskId: parseInt(taskId) },
    });

    // Затем удаляем связанные комментарии
    await prisma.comment.deleteMany({
      where: { taskId: parseInt(taskId) },
    });

    // Наконец удаляем саму задачу
    await prisma.task.delete({
      where: { id: parseInt(taskId) },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/task/update-priority - обновление приоритета задачи
router.put("/update-priority", async (req, res) => {
  try {
    const { taskId, execution_priority } = req.body;

    if (!taskId || execution_priority === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: {
        execution_priority: parseInt(execution_priority),
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Ошибка при обновлении приоритета:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/task/add-tag - добавление тега к задаче
router.post("/add-tag", async (req, res) => {
  try {
    const { taskId, tagId } = req.body;

    if (!taskId || !tagId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Создаем связь между задачей и тегом через промежуточную таблицу TaskMark
    const taskMark = await prisma.taskMark.create({
      data: {
        taskId: parseInt(taskId),
        markId: parseInt(tagId),
      },
      include: {
        mark: true, // Включаем информацию о теге в ответ
      },
    });

    res.json(taskMark.mark); // Возвращаем только информацию о теге
  } catch (error) {
    // Если тег уже добавлен, возвращаем ошибку
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Tag already added to task" });
    }
    console.error("Ошибка при добавлении тега:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/task/remove-tag - удаление тега с задачи
router.delete("/remove-tag", async (req, res) => {
  try {
    const { taskId, tagId } = req.body;

    if (!taskId || !tagId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Удаляем связь между задачей и тегом
    await prisma.taskMark.delete({
      where: {
        taskId_markId: {
          taskId: parseInt(taskId),
          markId: parseInt(tagId),
        },
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении тега:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/task/create-task - создание новой задачи
router.post("/create-task", async (req, res) => {
  try {
    const {
      project_id,
      title,
      description,
      status,
      user_id,
      column_id,
      execution_priority,
      dead_line,
    } = req.body;

    if (!project_id || !title || !description || !user_id || !column_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Создаем новую задачу
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: parseInt(status) || 1,
        execution_priority: execution_priority
          ? parseInt(execution_priority)
          : 0,
        dead_line: dead_line ? new Date(dead_line) : null,
        project: {
          connect: { id: parseInt(project_id) },
        },
        column: {
          connect: { id: parseInt(column_id) },
        },
        creator: {
          connect: { id: parseInt(user_id) },
        },
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Ошибка при создании задачи:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
