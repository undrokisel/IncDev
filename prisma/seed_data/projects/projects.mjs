export const projects = [
  {
    title: "Разработка приложения для аутстаффинга",
    description: "Создание приложения для управления сотрудниками",
    status: 0,
    dead_line: new Date("2025-12-31"),
    creatorId: 1,
    executors: {
      connect: [{ id: 1 }, { id: 2 }],
    },
  },
  {
    title: "Практика ОНИКС 2023",
    description: "Разработка приложения для пицерии",
    status: 1,
    dead_line: new Date("2025-06-30"),
    creatorId: 2,
    executors: {
      connect: [{ id: 1 }, { id: 2 }],
    },
  },
  {
    title: "Проект из архива",
    description: "Описание проекта из архива",
    status: 10,
    dead_line: new Date("2023-12-31"),
    creatorId: 1,
    executors: {
      connect: [{ id: 1 }, { id: 2 }],
    },
  },
  {
    title: "Создание сайта для стартапа",
    description: "Разработка одностраничного сайта для стартапа",
    status: 0,
    dead_line: new Date("2025-03-31"),
    creatorId: 2,
    executors: {
      connect: [{ id: 1 }, { id: 2 }],
    },
  },
  {
    title: "Разработка CRM-системы",
    description: "Создание CRM-системы для управления клиентами",
    status: 1,
    dead_line: new Date("2025-09-30"),
    creatorId: 1,
    executors: {
      connect: [{ id: 1 }, { id: 2 }],
    },
  },
];
