import { ModalTitle } from "react-bootstrap";

export const profileInfo = {
  fio: "Иванов Иван Иванович",
  username: "Иван",
  specification: "frontend, React",
  skillValues: [
    { id: 1, skill: { name: "Java Script" } },
    { id: 2, skill: { name: "React JS" } },
    { id: 3, skill: { name: "Redux JS" } },
  ],
  vc_text: "практика в колледже Оникс",
};

export const gitInfo = [
  {
    link: "ссылка на гит проект",
    id: "1",
    title: "Заголовок проекта 1",
    description: "сайт-одностраничник",
    main_stack: "React JS, Next JS",
  },
  {
    link: "ссылка на гит проект",
    id: "2",
    title: "Заголовок проект 2",
    description: "Описание проекта 2",
    main_stack: "React JS, Next JS, Redux JS",
  },
];

export const reportsMock = [
  {
    task: [{ hours_spent: 3 }, { hours_spent: 4 }],
  },
];

export const projects = [
  {
    status: 0,
    title: "Практика ОНИКС 2023",
    description: "разработка приложения для пицерии",
    id: 1,
    name: "Практика ОНИКС 2023",
    updated_at: 1735363277000,
    dead_line: 1735363277000,
    created_at: 1733116877000,
    timers: [
      {
        deltaSeconds: 1000000,
      },
    ],
    columns: [
      {
        tasks: [
          {
            title: "Верстка сайта",
            description:
              "Разработать дизайн, согласовать с заказчиком, сверстать сайт",
          },
          {
            title: "Интерактив сайта",
            description:
              "Разработка js кода для обеспечения интерактивности сайта",
          },
        ],
      },
    ],
  },
  {
    status: 1,
    title: "IncDev",
    description: "Разработка приложения для аутстаффинга",
    id: 2,
    name: "IncDev",
    updated_at: 1735363277000,
    created_at: 1733116877000,
    dead_line: 1735363277000,
    timers: [
      {
        deltaSeconds: 1000000,
      },
    ],
    columns: [
      {
        tasks: [
          {
            title: "Задача: разработать модули ИС",
            description: "Разработать архитектуру приложения",
          },
          {
            title: "Разработать дизайн и верстку отдельных страниц",
            description: "Дизайн и верстка отдельных страниц",
          },
        ],
      },
    ],
  },
  {
    status: 10,
    title: "Проект из архива",
    description: "Описание проекта из архива",
    id: 3,
    name: "Архивный проект",
    updated_at: 1735363277000,
    created_at: 1733116877000,
    dead_line: 1735363277000,
    timers: [
      {
        deltaSeconds: 1000000,
      },
    ],
    columns: [
      {
        tasks: [
          {
            title: "заголовок задачи 1",
            description: "Описание задачи 1",
          },
          {
            title: "заголовок задачи 2",
            description: "Описание задачи 2",
          },
        ],
      },
    ],
  },
];

export const projectBoards = [
  {
    columns: [
      {
        priority: 1,
        id: 1,
        title: "разработка концепции",

        tasks: [
          // колонка 1 задача 1
          {
            id: 1,
            taskUsers: [],
            title: "Разработка технического задания",
            priority: 1,
            description: "Необходимо разработать основной функционал сайта",
            executor: { fio: "Иванов Иван Иванович" },
            execution_priority: 1,
            dead_line: 1735363277000,
            comment_count: 5,
            files: 1,
            mark: [
              {
                title: "архитектура",
                slug: "architecture",
                color: "blue",
                id: 1,
              },
            ],
          },

          // колонка 2 задача 2
          {
            id: 2,
            title: "Детализация страниц каждого сайта",
            priority: 1,
            description:
              "Необходимо ASP детализировать функционал каждой страницы, дополнить техническое задание",
            executor: { fio: "Иванов Иван Иванович" },
            execution_priority: 2,
            dead_line: 1735363277000,
            comment_count: 5,
            files: 3,
            mark: [
              {
                title: "Дизайн",
                slug: "design",
                color: "brown",
                id: 2,
              },
            ],
          },
        ],
      },
      // вторая колонка
      {
        priority: 2,
        id: 4,
        title: "Верстка отдельных страниц",

        tasks: [
          {
            id: 5,
            title: "Верстка главной страницы",
            priority: 1,
            description:
              "Необходимо сверстать гланую страницу, в первую очередь для неавторизованных пользователей",
            executor: { fio: "Иванов Иван Иванович" },
            execution_priority: 0,
            dead_line: 1735363277000,
            comment_count: 5,
            files: 10,
            mark: [
              {
                title: "верстка",
                slug: "verstka",
                color: "pink",
                id: 1,
              },
            ],
          },
        ],
      },
    ],
    id: 6,
    owner_id: 7,
    mark: [
      {
        title: "верстка",
        slug: "verstka",
        color: "pink",
        id: 8,
      },
      {
        title: "фронт",
        slug: "front",
        color: "blue",
        id: 9,
      },
      {
        title: "тестирование",
        slug: "testing",
        color: "yellow",
        id: 10,
      },
    ],
    name: "Разработка сайта для аутстаффинга",
    projectUsers: [
      {
        user_id: 1,
        user: {
          fio: "Иванов Иван Иванович",
        },
      },
      {
        user_id: 2,
        user: {
          fio: "Кисель Андрей Владимирович",
        },
      },
    ],
  },
];

export const commentsMock = [
  {
    id: 1,
    text: "Надо было сделать еще вчера!",
    user: { fio: "Сергеев Сергей Сергеевич" },
    created_at: 1733116877000,
  },
];
