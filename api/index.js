require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

// мидлвары
const cors = require("cors");

const express = require("express");

const app = express();

const port = 3001;

const prisma = new PrismaClient();

const corsOptions = {
  // Разрешить запросы только с фронтенда
  //   origin: "http://localhost:3000",
  origin: process.env.REACT_APP_BASE_URL || "http://localhost:3000",
  // origin: "*",

  // Разрешенные методы
  methods: ["GET", "POST", "PUT", "DELETE"],

  // Если нужно передавать cookies
  credentials: true,

  // allowedHeaders: [
  //   'Content-Type',
  //   'Authorization', // Если используется аутентификация
  //   'X-Requested-With', // Если используется для AJAX-запросов
  // ],
};

app.use(cors(corsOptions));

app.use(express.json());

// routes

// faqs
const faqsRoutes = require("./routes/faqs/faqs.js");
const faqRoute = require("./routes/faqs/faq.js");
const rubrics = require("./routes/faqs/rubrics.js");

app.use("/api/faqs/", faqsRoutes);
app.use("/api/faq/", faqRoute);
app.use("/api/rubrics/", rubrics);

// auth
const register = require("./routes/auth/register.js");
app.use("/api/register/sign-up", register);

const login = require("./routes/auth/login.js");
app.use("/api/user/login", login);

// /user/me
const profileInfo = require("./routes/me/me.js");
app.use("/api/user/me", profileInfo);

// /projects-list
const projectlist = require("./routes/projects/projects.js");
app.use("/api/projects/projects-list", projectlist);

// /tasks
const tasksRouter = require("./routes/projects/tasks");

// projectColumnRouter
const projectColumnRouter = require("./routes/projects/project-column");

// project
const projectRouter = require("./routes/projects/project");

// projects
const projectsRouter = require("./routes/projects/projects");
const marksRouter = require("./routes/marks/marks");

app.use("/api/task", tasksRouter);
app.use("/api/project", projectRouter);
app.use("/api/project-column", projectColumnRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/mark", marksRouter);

// /comments
const comments = require("./routes/comments/comments.js");
app.use("/api/comment", comments);

// /timers
const timers = require("./routes/timers/timers.js");
app.use("/api/timer", timers);

// /profiles
const profiles = require("./routes/profiles/profiles.js");
app.use("/api/profile", profiles);

app.get("/", async (req, res) => {
  //   res.send("Hello, world!");
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
