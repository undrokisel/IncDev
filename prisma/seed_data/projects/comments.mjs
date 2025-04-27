// comments


export const comments = [
  // Для задачи "Разработка технического задания" (id = 1)
  {
    text: "Начинаю работу над задачей",
    userId: 1,
    taskId: 1,
    parent_id: null,
    subComments: [],
    created_at: new Date("2024-03-15T10:00:00Z"),
    updated_at: new Date("2024-03-15T10:00:00Z"),
    status: 1
  },
  { userId: 2, taskId: 1, text: "Необходимо уточнить требования к UI." },
  { userId: 2, taskId: 1, text: "Согласен, давайте добавим больше деталей в ТЗ." },

  // Для задачи "Создание прототипа" (id = 2)
  { userId: 1, taskId: 2, text: "Прототип должен быть интуитивно понятным." },
  { userId: 2, taskId: 2, text: "Используем Figma для создания прототипа." },
  { userId: 1, taskId: 2, text: "Ок, учту." },

  // Для задачи "Дизайн интерфейса" (id = 3)
  { userId: 2, taskId: 3, text: "Используем Material Design для UI." },
  { userId: 1, taskId: 3, text: "Учтите корпоративные цвета компании." },

  // Для задачи "Верстка страниц" (id = 4)
  { userId: 2, taskId: 4, text: "Верстка должна быть адаптивной." },
  { userId: 1, taskId: 4, text: "Используйте Bootstrap или Tailwind CSS." },
  { userId: 2, taskId: 4, text: "Хорошо, выбор за Tailwind." },

  // Для задачи "Адаптивная верстка" (id = 5)
  { userId: 1, taskId: 5, text: "Проверьте верстку на разных устройствах." },
  { userId: 2, taskId: 5, text: "Тестирование будет проведено на iOS и Android." },
  { userId: 1, taskId: 5, text: "Ок, принято." },

  // Для задачи "Юнит-тестирование" (id = 6)
  { userId: 2, taskId: 6, text: "Юнит-тесты должны покрывать все основные функции." },
  { userId: 1, taskId: 6, text: "Пишем тесты на Jest." },

  // Для задачи "Интеграционное тестирование" (id = 7)
  { userId: 2, taskId: 7, text: "Проверьте интеграцию с API." },
  { userId: 1, taskId: 7, text: "Используем Postman для тестирования API." },
  { userId: 2, taskId: 7, text: "Не забудьте про CORS." },

  // Для задачи "Настройка сервера" (id = 8)
  { userId: 1, taskId: 8, text: "Используем Nginx для настройки сервера." },
  { userId: 2, taskId: 8, text: "Настройте SSL-сертификаты." },

  // Для задачи "Развертывание приложения" (id = 9)
  { userId: 1, taskId: 9, text: "Используем Docker для развертывания." },
  { userId: 2, taskId: 9, text: "Не забудьте про env-файлы." },
  { userId: 1, taskId: 9, text: "Ок, настроим переменные окружения." },

  // Для задачи "Настройка CI/CD" (id = 10)
  { userId: 2, taskId: 10, text: "Используем Jenkins для CI/CD." },
  { userId: 1, taskId: 10, text: "Настройте пайплайны для автоматического деплоя." },

  // Для задачи "Мониторинг производительности" (id = 11)
  { userId: 2, taskId: 11, text: "Используем Prometheus для мониторинга." },
  { userId: 1, taskId: 11, text: "Настройте Grafana для визуализации данных." },
  { userId: 2, taskId: 11, text: "Не забудьте настроить алерты." },
];

