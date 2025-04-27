const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// GET /api/comment/get-by-entity - получение комментариев по сущности
// Этот маршрут должен быть первым!
router.get("/get-by-entity", async (req, res) => {
  try {
    const entityId = parseInt(req.query.entity_id);
    const entityType = parseInt(req.query.entity_type);

    if (!entityId || !entityType) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const comments = await prisma.comment.findMany({
      where: {
        taskId: entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            userCard: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json(comments);
  } catch (error) {
    console.error("Ошибка при получении комментариев:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/comment/:taskId - получение комментариев к задаче
router.get("/:taskId", async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId);

    if (req.params.taskId === 'get-by-entity') {
      return next(); // Пропустить запрос дальше
    }

    if (!taskId || isNaN(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const comments = await prisma.comment.findMany({
      where: {
        taskId: taskId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            userCard: true
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    });

    res.json(comments);
  } catch (error) {
    console.error("Ошибка при получении комментариев:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/comment - создание нового комментария
router.post("/", async (req, res) => {
  try {
    const { userId, taskId, text, parent_id } = req.body;

    if (!userId || !taskId || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        userId: parseInt(userId),
        taskId: parseInt(taskId),
        parent_id: parent_id ? parseInt(parent_id) : null,
        subComments: []
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Ошибка при создании комментария:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/comment/update - обновление комментария (текст или статус)
router.put("/update", async (req, res) => {
  try {
    const { comment_id, text, status } = req.body;
    
    if (!comment_id) {
      return res.status(400).json({ error: "Missing comment_id" });
    }

    // Если это удаление подкомментария (status = 0)
    if (status === 0) {
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(comment_id) }
      });

      // Если это подкомментарий
      if (comment.parent_id) {
        const parentComment = await prisma.comment.findUnique({
          where: { id: comment.parent_id }
        });

        // Удаляем ID подкомментария из массива subComments родителя
        await prisma.comment.update({
          where: { id: comment.parent_id },
          data: {
            subComments: parentComment.subComments.filter(id => id !== comment.id)
          }
        });
      }
    }

    // Обновляем либо текст, либо статус
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (status !== undefined) updateData.status = status;
    
    const updatedComment = await prisma.comment.update({
      where: {
        id: parseInt(comment_id)
      },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            userCard: true
          }
        }
      }
    });
    
    res.json(updatedComment);
  } catch (error) {
    console.error("Ошибка при обновлении комментария:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/comment/delete-comment - удаление комментария
router.delete("/delete-comment", async (req, res) => {
  try {
    const { commentId } = req.body;
    
    if (!commentId) {
      return res.status(400).json({ error: "Missing commentId" });
    }
    
    // Сначала удаляем все дочерние комментарии
    await prisma.comment.deleteMany({
      where: {
        parent_id: parseInt(commentId)
      }
    });
    
    // Затем удаляем сам комментарий
    await prisma.comment.delete({
      where: {
        id: parseInt(commentId)
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении комментария:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/comment/reply-comment - ответ на комментарий
router.post("/reply-comment", async (req, res) => {
  try {
    const { taskId, userId, text, parent_id } = req.body;
    
    if (!taskId || !userId || !text || !parent_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Создаем новый комментарий-ответ
    const comment = await prisma.comment.create({
      data: {
        text,
        userId: parseInt(userId),
        taskId: parseInt(taskId),
        parent_id: parseInt(parent_id)
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            userCard: true
          }
        }
      }
    });

    // Обновляем массив subComments родительского комментария
    const parentComment = await prisma.comment.findUnique({
      where: { id: parseInt(parent_id) }
    });

    await prisma.comment.update({
      where: { id: parseInt(parent_id) },
      data: {
        subComments: [...parentComment.subComments, comment.id]
      }
    });
    
    res.status(201).json(comment);
  } catch (error) {
    console.error("Ошибка при создании ответа на комментарий:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/comment/get-sub-comments - получение дочерних комментариев
router.get("/get-sub-comments", async (req, res) => {
  try {
    const commentId = parseInt(req.query.comment_id);
    
    if (!commentId) {
      return res.status(400).json({ error: "Missing comment_id" });
    }
    
    const parentComment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!parentComment) {
      return res.status(404).json({ error: "Parent comment not found" });
    }

    const subComments = await prisma.comment.findMany({
      where: {
        id: {
          in: parentComment.subComments
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            userCard: true
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    });
    
    res.json(subComments);
  } catch (error) {
    console.error("Ошибка при получении дочерних комментариев:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/comment/create - создание нового комментария или подкомментария
router.post("/create", async (req, res) => {
  try {
    const { text, entity_type, entity_id, parent_id } = req.body;
    
    // Получаем токен из заголовка
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Декодируем JWT токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    
    if (!text || !entity_type || !entity_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        parent_id: parent_id ? parseInt(parent_id) : null,
        subComments: [],
        status: 1,
        created_at: new Date(),
        updated_at: new Date(),
        user: {
          connect: {
            id: parseInt(userId)
          }
        },
        task: {
          connect: {
            id: parseInt(entity_id)
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            userCard: true
          }
        }
      }
    });

    // Если это подкомментарий, обновляем массив subComments родительского комментария
    if (parent_id) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parseInt(parent_id) }
      });

      await prisma.comment.update({
        where: { id: parseInt(parent_id) },
        data: {
          subComments: [...parentComment.subComments, comment.id]
        }
      });
    }
    
    res.status(201).json(comment);
  } catch (error) {
    console.error("Ошибка при создании комментария:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router; 