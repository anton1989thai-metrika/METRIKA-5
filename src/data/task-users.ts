export type TaskUser = {
  id: number
  name: string
  role: string
  email: string
  detailedPermissions?: {
    otherPermissions?: {
      hideInTasks?: boolean
    }
  }
}

export const taskUsers: TaskUser[] = [
  {
    id: 1,
    name: 'Нехорошков Антон',
    role: 'admin',
    email: 'nekhoroshkov@metrika.direct',
  },
  {
    id: 2,
    name: 'Сникфайкер',
    role: 'manager',
    email: 'snikfayker@metrika.direct',
  },
  {
    id: 3,
    name: 'Маслова Ирина',
    role: 'employee',
    email: 'maslova@metrika.direct',
  },
  {
    id: 4,
    name: 'Ионин Владислав',
    role: 'employee',
    email: 'ionin@metrika.direct',
  },
  {
    id: 5,
    name: 'Андрей Широких',
    role: 'employee',
    email: 'shirokikh@metrika.direct',
  },
  {
    id: 6,
    name: 'Бердник Вадим',
    role: 'employee',
    email: 'berdnik@metrika.direct',
  },
  {
    id: 7,
    name: 'Дерик Олег',
    role: 'employee',
    email: 'derik@metrika.direct',
  },
  {
    id: 8,
    name: 'Кан Татьяна',
    role: 'employee',
    email: 'kan@metrika.direct',
  },
  {
    id: 9,
    name: 'Поврезнюк Мария',
    role: 'employee',
    email: 'povreznyuk@metrika.direct',
  },
  {
    id: 10,
    name: 'Стулина Елена',
    role: 'employee',
    email: 'stulina@metrika.direct',
  },
  {
    id: 11,
    name: 'Тамбовцева Екатерина',
    role: 'employee',
    email: 'tambovtseva@metrika.direct',
  },
  {
    id: 12,
    name: 'Пользователь сайта 1',
    role: 'site-user',
    email: 'user1@example.com',
    detailedPermissions: { otherPermissions: { hideInTasks: true } },
  },
  {
    id: 13,
    name: 'Клиент Метрики 1',
    role: 'client',
    email: 'client1@example.com',
  },
  {
    id: 14,
    name: 'Иностранный сотрудник 1',
    role: 'foreign-employee',
    email: 'foreign1@example.com',
  },
  {
    id: 15,
    name: 'Внештатный сотрудник 1',
    role: 'freelancer',
    email: 'freelancer1@example.com',
  },
  {
    id: 16,
    name: 'Анна Петрова',
    role: 'admin',
    email: 'anna@metrika.ru',
  },
  {
    id: 17,
    name: 'Иван Сидоров',
    role: 'manager',
    email: 'ivan@metrika.ru',
  },
  {
    id: 18,
    name: 'Мария Козлова',
    role: 'employee',
    email: 'maria@metrika.ru',
  },
  {
    id: 19,
    name: 'Алексей Волков',
    role: 'employee',
    email: 'alexey@metrika.ru',
  },
  {
    id: 20,
    name: 'Елена Соколова',
    role: 'employee',
    email: 'elena@metrika.ru',
  },
  {
    id: 21,
    name: 'Дмитрий Морозов',
    role: 'freelancer',
    email: 'dmitry@metrika.ru',
  },
  {
    id: 22,
    name: 'Ольга Новикова',
    role: 'client',
    email: 'olga@metrika.ru',
  },
  {
    id: 23,
    name: 'Сергей Лебедев',
    role: 'employee',
    email: 'sergey@metrika.ru',
  },
]
