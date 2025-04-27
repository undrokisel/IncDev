import { PrismaClient } from "@prisma/client";
import {
  faqs,
  rubrics,
  users,
  skills,
  marks,
  projects,
  columns,
  tasks,
  comments,
  boards,
  boardMarks,
  skillLevels,
  userCards,
  skillValues,
  timers,
} from "./seed_data";

const prisma = new PrismaClient();

async function up1() {
  // rubrics
  await prisma.rubric.createMany({
    data: rubrics,
  });
  // faqs
  await prisma.faq.createMany({
    data: faqs,
  });

  // skills
  await prisma.skill.createMany({
    data: skills,
  });
  // marks
  await prisma.mark.createMany({
    data: marks,
  });

  // users
  await prisma.user.createMany({
    data: users,
  });

  // projects
  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }

  // columns
  await prisma.column.createMany({
    data: columns,
  });

  // tasks
  // await prisma.task.createMany({
  //   data: tasks,
  // });
  for (const task of tasks) {
    // Преобразуем формат данных для совместимости с новой схемой
    const taskData = {
      title: task.title,
      description: task.description,
      execution_priority: task.execution_priority,
      status: task.status,
      dead_line: task.dead_line,
      column: {
        connect: { id: task.columnId }
      },
      creator: {
        connect: { id: task.creator }
      }
    };
    
    // Добавляем необязательные связи, если они есть
    if (task.executorId) {
      taskData.executor = {
        connect: { id: task.executorId }
      };
    }
    
    if (task.projectId) {
      taskData.project = {
        connect: { id: task.projectId }
      };
    }
    
    await prisma.task.create({
      data: taskData
    });
  }
}

async function up2() {

  // бейджики для тасок связная таблица
  await prisma.taskMark.createMany({
    data: [
      { taskId: 1, markId: 3 },
      { taskId: 2, markId: 2 },
      { taskId: 3, markId: 3 },
      { taskId: 4, markId: 4 },
      { taskId: 5, markId: 1 },
      { taskId: 6, markId: 2 },
      { taskId: 7, markId: 3 },
      { taskId: 8, markId: 4 },
      { taskId: 9, markId: 1 },
      { taskId: 10, markId: 2 },
      { taskId: 11, markId: 3 },
      { taskId: 12, markId: 1 },
      { taskId: 13, markId: 2 },
      { taskId: 14, markId: 3 },
      { taskId: 15, markId: 4 },
      { taskId: 16, markId: 1 },
      { taskId: 17, markId: 2 },
      { taskId: 18, markId: 3 },
      { taskId: 19, markId: 1 },
      { taskId: 20, markId: 2 },
      { taskId: 21, markId: 3 },
      { taskId: 22, markId: 4 },
      { taskId: 23, markId: 1 },
      { taskId: 24, markId: 1 },
      { taskId: 25, markId: 2 },
      { taskId: 26, markId: 3 },
      { taskId: 27, markId: 4 },
      { taskId: 28, markId: 1 },
      { taskId: 29, markId: 2 },
      { taskId: 30, markId: 3 },
      { taskId: 31, markId: 1 },
      { taskId: 32, markId: 2 },
      { taskId: 33, markId: 3 },
      { taskId: 34, markId: 4 },
      { taskId: 35, markId: 1 },
      { taskId: 36, markId: 1 },
      { taskId: 37, markId: 2 },
      { taskId: 38, markId: 3 },
      { taskId: 39, markId: 4 },
      { taskId: 40, markId: 1 },
      { taskId: 41, markId: 2 },
      { taskId: 42, markId: 3 },
    ],
  });

  // comments
  await prisma.comment.createMany({
    data: comments,
  });
  // boards
  await prisma.board.createMany({
    data: boards,
  });
  // boardMarks
  await prisma.boardMark.createMany({
    data: boardMarks,
  });

  // skillLevels
  await prisma.skillLevel.createMany({
    data: skillLevels,
  });
  // userCards
  await prisma.userCard.createMany({
    data: userCards,
  });
  // skillValues
  await prisma.skillValue.createMany({
    data: skillValues,
  });

  // timers
  await prisma.timer.createMany({
    data: timers,
  });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "Faq" RESTART IDENTITY CASCADE`;
}

async function main() {
  try {
    await down();
    await up1();
    await up2();
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    // eslint-disable-next-line
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
