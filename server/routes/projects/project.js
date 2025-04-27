const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();

router.get(`/get-project`, async (req, res) => {
  try {
    // параметры из запроса
    const projectId = parseInt(req.query.project_id);
    const expand = req.query.expand;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
      },

      include: {
        columns: {
          include: {
            tasks: {
              include: {
                executor: {
                  include: {
                    userCard: true,
                  },
                },
                marks: {
                  include: {
                    mark: true,
                  },
                },
                comments: true,
              },
            },
          },
        },
        executors: {
          include: {
            userCard: true,
          },
        },
      },

      // select: {
      //   id: true,
      //   title: true,
      //   description: true,
      //   status: true,
      //   created_at: true,
      //   updated_at: true,
      //   dead_line: true,
      //   creatorId: true,
      //   executors: true,
      //   columns: {
      //     select: {
      //       id: true,
      //       title: true,
      //       priority: true,
      //       tasks: true,
      //     },
      //   },
      // },
    });


    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ project });
  } catch (error) {
    console.error("Ошибка при получении проектов: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/project/create - создание нового проекта
router.post("/create", async (req, res) => {
  try {
    const { name, description, user_id, status } = req.body;
    
    if (!name || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Создаем новый проект
    const newProject = await prisma.project.create({
      data: {
        title: name,
        description: description || "",
        status: status || 1,
        created_at: new Date(),
        updated_at: new Date(),
        creatorId: parseInt(user_id),
        executors: {
          connect: [{ id: parseInt(user_id) }]
        }
      },
      include: {
        executors: true
      }
    });
    
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Ошибка при создании проекта:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/project/update - обновление проекта
router.put("/update", async (req, res) => {
  try {
    const { project_id, title, description, status, dead_line } = req.body;
    
    if (!project_id) {
      return res.status(400).json({ error: "Missing project_id" });
    }
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = parseInt(status);
    if (dead_line !== undefined) updateData.dead_line = dead_line ? new Date(dead_line) : null;
    
    updateData.updated_at = new Date();
    
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(project_id) },
      data: updateData
    });
    
    res.json(updatedProject);
  } catch (error) {
    console.error("Ошибка при обновлении проекта:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/project/add-user - добавление пользователя в проект
router.post("/add-user", async (req, res) => {
  try {
    const { project_id, user_id } = req.body;
    
    if (!project_id || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Проверяем, существует ли проект
    const project = await prisma.project.findUnique({
      where: { id: parseInt(project_id) }
    });
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: parseInt(user_id) }
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Добавляем пользователя в проект
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(project_id) },
      data: {
        executors: {
          connect: { id: parseInt(user_id) }
        }
      },
      include: {
        executors: {
          select: {
            id: true,
            username: true,
            userCard: true
          }
        }
      }
    });
    
    res.json(updatedProject);
  } catch (error) {
    // Если пользователь уже в проекте
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "User is already in the project" });
    }
    console.error("Ошибка при добавлении пользователя в проект:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/project/my-employee - получение сотрудников пользователя
router.get("/my-employee", async (req, res) => {
  try {
    const userId = parseInt(req.query.user_id);
    
    if (!userId) {
      return res.status(400).json({ error: "Missing user_id" });
    }
    
    const userWithEmployees = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        employees: {
          select: {
            id: true,
            username: true,
            userCard: true
          }
        }
      }
    });
    
    if (!userWithEmployees) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(userWithEmployees.employees);
  } catch (error) {
    console.error("Ошибка при получении сотрудников:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
