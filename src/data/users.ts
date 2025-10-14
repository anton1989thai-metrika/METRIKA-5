import fs from 'fs/promises';
import path from 'path';

// Путь к файлу с сохраненными пользователями
const PERSISTED_USERS_FILE = path.join(process.cwd(), 'src', 'data', 'persisted-users.json');

export interface User {
  id: string;
  name: string;
  email: string;
  login?: string;
  password?: string;
  role: 'admin' | 'manager' | 'agent' | 'employee';
  status: 'active' | 'inactive' | 'pending';
  permissions: {
    canManageObjects: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
    canManageTasks: boolean;
    canManageMedia: boolean;
    canManageContent: boolean;
    canManageSettings: boolean;
  };
  detailedPermissions?: {
    // Категории с подразделами
    personalCabinet: {
      enabled: boolean;
    };
    myObjects: {
      enabled: boolean;
    };
    email: {
      enabled: boolean;
      viewMail: boolean;
      sendEmails: boolean;
      manageMailboxes: boolean;
      mailSettings: boolean;
    };
    academy: {
      enabled: boolean;
      dashboard: boolean;
      courses: boolean;
      tests: boolean;
      achievements: boolean;
      materials: boolean;
    };
    knowledgeBase: {
      enabled: boolean;
    };
    taskManager: {
      enabled: boolean;
      viewTasks: boolean;
      createTasks: boolean;
      assignExecutors: boolean;
      closeTasks: boolean;
      editTasks: boolean;
      changeExecutors: boolean;
      changeCurators: boolean;
      editSubtasks: boolean;
      editChecklists: boolean;
      viewOtherUsersTasks: boolean;
    };
    adminPanel: {
      enabled: boolean;
      dashboard: boolean;
      email: boolean;
      content: boolean;
      objects: boolean;
      users: boolean;
      tasks: boolean;
      media: boolean;
      hr: boolean;
      analytics: boolean;
      settings: boolean;
    };
    otherPermissions: {
      enabled: boolean;
      placeholder1: boolean;
      placeholder2: boolean;
      placeholder3: boolean;
      placeholder4: boolean;
    };
  };
  lastLogin?: string;
  createdAt: string;
  phone?: string;
  department?: string;
  notes?: string;
}

// Дефолтные пользователи
export const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Нехорошков Антон',
    email: 'nekhoroshkov@metrika.direct',
    login: 'admin',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    permissions: {
      canManageObjects: true,
      canManageUsers: true,
      canViewAnalytics: true,
      canManageTasks: true,
      canManageMedia: true,
      canManageContent: true,
      canManageSettings: true
    },
    detailedPermissions: {
      personalCabinet: {
        enabled: true
      },
      myObjects: {
        enabled: true
      },
      email: {
        enabled: true,
        viewMail: true,
        sendEmails: true,
        manageMailboxes: true,
        mailSettings: true
      },
      academy: {
        enabled: true,
        dashboard: true,
        courses: true,
        tests: true,
        achievements: true,
        materials: true
      },
      knowledgeBase: {
        enabled: true
      },
      taskManager: {
        enabled: true,
        viewTasks: true,
        createTasks: true,
        assignExecutors: true,
        closeTasks: true,
        editTasks: true,
        changeExecutors: true,
        changeCurators: true,
        editSubtasks: true,
        editChecklists: true,
        viewOtherUsersTasks: true
      },
      adminPanel: {
        enabled: true,
        dashboard: true,
        email: true,
        content: true,
        objects: true,
        users: true,
        tasks: true,
        media: true,
        hr: true,
        analytics: true,
        settings: true
      },
      otherPermissions: {
        enabled: true,
        placeholder1: true,
        placeholder2: true,
        placeholder3: true,
        placeholder4: true
      }
    },
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-01T00:00:00Z',
    phone: '+7 (999) 123-45-67',
    department: 'Руководство',
    notes: 'Основатель компании'
  },
  {
    id: '2',
    name: 'Сникфайкер',
    email: 'snikfayker@metrika.direct',
    login: 'snikfayker',
    password: 'manager123',
    role: 'manager',
    status: 'active',
    permissions: {
      canManageObjects: true,
      canManageUsers: false,
      canViewAnalytics: true,
      canManageTasks: true,
      canManageMedia: true,
      canManageContent: true,
      canManageSettings: false
    },
    detailedPermissions: {
      personalCabinet: {
        enabled: true
      },
      myObjects: {
        enabled: true
      },
      email: {
        enabled: true,
        viewMail: true,
        sendEmails: true,
        manageMailboxes: false,
        mailSettings: false
      },
      academy: {
        enabled: true,
        dashboard: true,
        courses: true,
        tests: true,
        achievements: true,
        materials: true
      },
      knowledgeBase: {
        enabled: true
      },
      taskManager: {
        enabled: true,
        viewTasks: true,
        createTasks: true,
        assignExecutors: true,
        closeTasks: true,
        editTasks: true,
        changeExecutors: true,
        changeCurators: true,
        editSubtasks: true,
        editChecklists: true,
        viewOtherUsersTasks: true
      },
      adminPanel: {
        enabled: false,
        dashboard: false,
        email: false,
        content: false,
        objects: false,
        users: false,
        tasks: false,
        media: false,
        hr: false,
        analytics: false,
        settings: false
      },
      otherPermissions: {
        enabled: true,
        placeholder1: true,
        placeholder2: true,
        placeholder3: true,
        placeholder4: true
      }
    },
    lastLogin: '2024-01-15T09:15:00Z',
    createdAt: '2023-08-15T00:00:00Z',
    phone: '+7 (999) 234-56-78',
    department: 'Продажи',
    notes: 'Ведущий менеджер'
  },
  {
    id: '3',
    name: 'Маслова Ирина',
    email: 'maslova@metrika.direct',
    login: 'maslova',
    password: 'agent123',
    role: 'agent',
    status: 'active',
    permissions: {
      canManageObjects: true,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageTasks: true,
      canManageMedia: false,
      canManageContent: false,
      canManageSettings: false
    },
    detailedPermissions: {
      personalCabinet: {
        enabled: true
      },
      myObjects: {
        enabled: true
      },
      email: {
        enabled: true,
        viewMail: true,
        sendEmails: true,
        manageMailboxes: false,
        mailSettings: false
      },
      academy: {
        enabled: true,
        dashboard: true,
        courses: true,
        tests: true,
        achievements: true,
        materials: true
      },
      knowledgeBase: {
        enabled: true
      },
      taskManager: {
        enabled: true,
        viewTasks: true,
        createTasks: true,
        assignExecutors: false,
        closeTasks: true,
        editTasks: true,
        changeExecutors: false,
        changeCurators: false,
        editSubtasks: true,
        editChecklists: true,
        viewOtherUsersTasks: false
      },
      adminPanel: {
        enabled: false,
        dashboard: false,
        email: false,
        content: false,
        objects: false,
        users: false,
        tasks: false,
        media: false,
        hr: false,
        analytics: false,
        settings: false
      },
      otherPermissions: {
        enabled: true,
        placeholder1: true,
        placeholder2: true,
        placeholder3: true,
        placeholder4: true
      }
    },
    lastLogin: '2024-01-15T08:45:00Z',
    createdAt: '2023-10-01T00:00:00Z',
    phone: '+7 (999) 345-67-89',
    department: 'Продажи',
    notes: 'Агент по недвижимости'
  },
  {
    id: '4',
    name: 'Ионин Владислав',
    email: 'ionin@metrika.direct',
    login: 'ionin',
    password: 'agent123',
    role: 'agent',
    status: 'active',
    permissions: {
      canManageObjects: true,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageTasks: true,
      canManageMedia: false,
      canManageContent: false,
      canManageSettings: false
    },
    detailedPermissions: {
      personalCabinet: {
        enabled: true
      },
      myObjects: {
        enabled: true
      },
      email: {
        enabled: true,
        viewMail: true,
        sendEmails: true,
        manageMailboxes: false,
        mailSettings: false
      },
      academy: {
        enabled: true,
        dashboard: true,
        courses: true,
        tests: true,
        achievements: true,
        materials: true
      },
      knowledgeBase: {
        enabled: true
      },
      taskManager: {
        enabled: true,
        viewTasks: true,
        createTasks: true,
        assignExecutors: false,
        closeTasks: true,
        editTasks: true,
        changeExecutors: false,
        changeCurators: false,
        editSubtasks: true,
        editChecklists: true,
        viewOtherUsersTasks: false
      },
      adminPanel: {
        enabled: false,
        dashboard: false,
        email: false,
        content: false,
        objects: false,
        users: false,
        tasks: false,
        media: false,
        hr: false,
        analytics: false,
        settings: false
      },
      otherPermissions: {
        enabled: true,
        placeholder1: true,
        placeholder2: true,
        placeholder3: true,
        placeholder4: true
      }
    },
    lastLogin: '2024-01-15T08:30:00Z',
    createdAt: '2023-10-15T00:00:00Z',
    phone: '+7 (999) 456-78-90',
    department: 'Продажи',
    notes: 'Агент по недвижимости'
  },
  {
    id: '5',
    name: 'Андрей Широких',
    email: 'shirokikh@metrika.direct',
    login: 'shirokikh',
    password: 'agent123',
    role: 'agent',
    status: 'active',
    permissions: {
      canManageObjects: true,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageTasks: true,
      canManageMedia: false,
      canManageContent: false,
      canManageSettings: false
    },
    detailedPermissions: {
      personalCabinet: {
        enabled: true
      },
      myObjects: {
        enabled: true
      },
      email: {
        enabled: true,
        viewMail: true,
        sendEmails: true,
        manageMailboxes: false,
        mailSettings: false
      },
      academy: {
        enabled: true,
        dashboard: true,
        courses: true,
        tests: true,
        achievements: true,
        materials: true
      },
      knowledgeBase: {
        enabled: true
      },
      taskManager: {
        enabled: true,
        viewTasks: true,
        createTasks: true,
        assignExecutors: false,
        closeTasks: true,
        editTasks: true,
        changeExecutors: false,
        changeCurators: false,
        editSubtasks: true,
        editChecklists: true,
        viewOtherUsersTasks: false
      },
      adminPanel: {
        enabled: false,
        dashboard: false,
        email: false,
        content: false,
        objects: false,
        users: false,
        tasks: false,
        media: false,
        hr: false,
        analytics: false,
        settings: false
      },
      otherPermissions: {
        enabled: true,
        placeholder1: true,
        placeholder2: true,
        placeholder3: true,
        placeholder4: true
      }
    },
    lastLogin: '2024-01-15T08:15:00Z',
    createdAt: '2023-11-01T00:00:00Z',
    phone: '+7 (999) 567-89-01',
    department: 'Продажи',
    notes: 'Агент по недвижимости'
  },
  {
    id: '6',
    name: 'Бердник Вадим',
    email: 'berdnik@metrika.direct',
    login: 'berdnik',
    password: 'agent123',
    role: 'agent',
    status: 'active',
    permissions: {
      canManageObjects: true,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageTasks: true,
      canManageMedia: false,
      canManageContent: false,
      canManageSettings: false
    },
    detailedPermissions: {
      personalCabinet: {
        enabled: true
      },
      myObjects: {
        enabled: true
      },
      email: {
        enabled: true,
        viewMail: true,
        sendEmails: true,
        manageMailboxes: false,
        mailSettings: false
      },
      academy: {
        enabled: true,
        dashboard: true,
        courses: true,
        tests: true,
        achievements: true,
        materials: true
      },
      knowledgeBase: {
        enabled: true
      },
      taskManager: {
        enabled: true,
        viewTasks: true,
        createTasks: true,
        assignExecutors: false,
        closeTasks: true,
        editTasks: true,
        changeExecutors: false,
        changeCurators: false,
        editSubtasks: true,
        editChecklists: true,
        viewOtherUsersTasks: false
      },
      adminPanel: {
        enabled: false,
        dashboard: false,
        email: false,
        content: false,
        objects: false,
        users: false,
        tasks: false,
        media: false,
        hr: false,
        analytics: false,
        settings: false
      },
      otherPermissions: {
        enabled: true,
        placeholder1: true,
        placeholder2: true,
        placeholder3: true,
        placeholder4: true
      }
    },
    lastLogin: '2024-01-15T08:00:00Z',
    createdAt: '2023-11-15T00:00:00Z',
    phone: '+7 (999) 678-90-12',
    department: 'Продажи',
    notes: 'Агент по недвижимости'
  },
  {
    id: '7',
    name: 'Дерик Олег',
    email: 'derik@metrika.direct',
    login: 'derik',
    password: 'agent123',
    role: 'agent',
    status: 'active',
    permissions: {
      canManageObjects: true,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageTasks: true,
      canManageMedia: false,
      canManageContent: false,
      canManageSettings: false
    },
    detailedPermissions: {
      personalCabinet: {
        enabled: true
      },
      myObjects: {
        enabled: true
      },
      email: {
        enabled: true,
        viewMail: true,
        sendEmails: true,
        manageMailboxes: false,
        mailSettings: false
      },
      academy: {
        enabled: true,
        dashboard: true,
        courses: true,
        tests: true,
        achievements: true,
        materials: true
      },
      knowledgeBase: {
        enabled: true
      },
      taskManager: {
        enabled: true,
        viewTasks: true,
        createTasks: true,
        assignExecutors: false,
        closeTasks: true,
        editTasks: true,
        changeExecutors: false,
        changeCurators: false,
        editSubtasks: true,
        editChecklists: true,
        viewOtherUsersTasks: false
      },
      adminPanel: {
        enabled: false,
        dashboard: false,
        email: false,
        content: false,
        objects: false,
        users: false,
        tasks: false,
        media: false,
        hr: false,
        analytics: false,
        settings: false
      },
      otherPermissions: {
        enabled: true,
        placeholder1: true,
        placeholder2: true,
        placeholder3: true,
        placeholder4: true
      }
    },
    lastLogin: '2024-01-15T07:45:00Z',
    createdAt: '2023-12-01T00:00:00Z',
    phone: '+7 (999) 789-01-23',
    department: 'Продажи',
    notes: 'Агент по недвижимости'
  },
  {
    id: '8',
    name: 'Кан Татьяна',
    email: 'kan@metrika.direct',
    login: 'kan',
    password: 'employee123',
    role: 'employee',
    status: 'active',
    permissions: {
      canManageObjects: false,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageTasks: false,
      canManageMedia: false,
      canManageContent: false,
      canManageSettings: false
    },
    detailedPermissions: {
      personalCabinet: {
        enabled: true
      },
      myObjects: {
        enabled: false
      },
      email: {
        enabled: true,
        viewMail: true,
        sendEmails: false,
        manageMailboxes: false,
        mailSettings: false
      },
      academy: {
        enabled: true,
        dashboard: true,
        courses: true,
        tests: true,
        achievements: true,
        materials: true
      },
      knowledgeBase: {
        enabled: true
      },
      taskManager: {
        enabled: true,
        viewTasks: true,
        createTasks: false,
        assignExecutors: false,
        closeTasks: false,
        editTasks: false,
        changeExecutors: false,
        changeCurators: false,
        editSubtasks: false,
        editChecklists: false,
        viewOtherUsersTasks: false
      },
      adminPanel: {
        enabled: false,
        dashboard: false,
        email: false,
        content: false,
        objects: false,
        users: false,
        tasks: false,
        media: false,
        hr: false,
        analytics: false,
        settings: false
      },
      otherPermissions: {
        enabled: true,
        placeholder1: true,
        placeholder2: true,
        placeholder3: true,
        placeholder4: true
      }
    },
    lastLogin: '2024-01-14T17:30:00Z',
    createdAt: '2023-12-15T00:00:00Z',
    phone: '+7 (999) 890-12-34',
    department: 'Администрация',
    notes: 'Секретарь'
  },
  {
    id: '9',
    name: 'Поврезнюк Мария',
    email: 'povreznyuk@metrika.direct',
    login: 'povreznyuk',
    password: 'employee123',
    role: 'employee',
    status: 'active',
    permissions: {
      canManageObjects: false,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageTasks: false,
      canManageMedia: false,
      canManageContent: false,
      canManageSettings: false
    },
    detailedPermissions: {
      personalCabinet: {
        enabled: true
      },
      myObjects: {
        enabled: false
      },
      email: {
        enabled: true,
        viewMail: true,
        sendEmails: false,
        manageMailboxes: false,
        mailSettings: false
      },
      academy: {
        enabled: true,
        dashboard: true,
        courses: true,
        tests: true,
        achievements: true,
        materials: true
      },
      knowledgeBase: {
        enabled: true
      },
      taskManager: {
        enabled: true,
        viewTasks: true,
        createTasks: false,
        assignExecutors: false,
        closeTasks: false,
        editTasks: false,
        changeExecutors: false,
        changeCurators: false,
        editSubtasks: false,
        editChecklists: false,
        viewOtherUsersTasks: false
      },
      adminPanel: {
        enabled: false,
        dashboard: false,
        email: false,
        content: false,
        objects: false,
        users: false,
        tasks: false,
        media: false,
        hr: false,
        analytics: false,
        settings: false
      },
      otherPermissions: {
        enabled: true,
        placeholder1: true,
        placeholder2: true,
        placeholder3: true,
        placeholder4: true
      }
    },
    lastLogin: '2024-01-14T17:15:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    phone: '+7 (999) 901-23-45',
    department: 'Администрация',
    notes: 'Секретарь'
  },
  {
    id: '10',
    name: 'Стулина Елена',
    email: 'stulina@metrika.direct',
    login: 'stulina',
    password: 'employee123',
    role: 'employee',
    status: 'active',
    permissions: {
      canManageObjects: false,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageTasks: false,
      canManageMedia: false,
      canManageContent: false,
      canManageSettings: false
    },
    detailedPermissions: {
      personalCabinet: {
        enabled: true
      },
      myObjects: {
        enabled: false
      },
      email: {
        enabled: true,
        viewMail: true,
        sendEmails: false,
        manageMailboxes: false,
        mailSettings: false
      },
      academy: {
        enabled: true,
        dashboard: true,
        courses: true,
        tests: true,
        achievements: true,
        materials: true
      },
      knowledgeBase: {
        enabled: true
      },
      taskManager: {
        enabled: true,
        viewTasks: true,
        createTasks: false,
        assignExecutors: false,
        closeTasks: false,
        editTasks: false,
        changeExecutors: false,
        changeCurators: false,
        editSubtasks: false,
        editChecklists: false,
        viewOtherUsersTasks: false
      },
      adminPanel: {
        enabled: false,
        dashboard: false,
        email: false,
        content: false,
        objects: false,
        users: false,
        tasks: false,
        media: false,
        hr: false,
        analytics: false,
        settings: false
      },
      otherPermissions: {
        enabled: true,
        placeholder1: true,
        placeholder2: true,
        placeholder3: true,
        placeholder4: true
      }
    },
    lastLogin: '2024-01-14T17:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    phone: '+7 (999) 012-34-56',
    department: 'Администрация',
    notes: 'Секретарь'
  },
  {
    id: '11',
    name: 'Тамбовцева Екатерина',
    email: 'tambovtseva@metrika.direct',
    login: 'tambovtseva',
    password: 'employee123',
    role: 'employee',
    status: 'active',
    permissions: {
      canManageObjects: false,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageTasks: false,
      canManageMedia: false,
      canManageContent: false,
      canManageSettings: false
    },
    detailedPermissions: {
      personalCabinet: {
        enabled: true
      },
      myObjects: {
        enabled: false
      },
      email: {
        enabled: true,
        viewMail: true,
        sendEmails: false,
        manageMailboxes: false,
        mailSettings: false
      },
      academy: {
        enabled: true,
        dashboard: true,
        courses: true,
        tests: true,
        achievements: true,
        materials: true
      },
      knowledgeBase: {
        enabled: true
      },
      taskManager: {
        enabled: true,
        viewTasks: true,
        createTasks: false,
        assignExecutors: false,
        closeTasks: false,
        editTasks: false,
        changeExecutors: false,
        changeCurators: false,
        editSubtasks: false,
        editChecklists: false,
        viewOtherUsersTasks: false
      },
      adminPanel: {
        enabled: false,
        dashboard: false,
        email: false,
        content: false,
        objects: false,
        users: false,
        tasks: false,
        media: false,
        hr: false,
        analytics: false,
        settings: false
      },
      otherPermissions: {
        enabled: true,
        placeholder1: true,
        placeholder2: true,
        placeholder3: true,
        placeholder4: true
      }
    },
    lastLogin: '2024-01-14T16:45:00Z',
    createdAt: '2024-01-20T00:00:00Z',
    phone: '+7 (999) 123-45-78',
    department: 'Администрация',
    notes: 'Секретарь'
  }
];

// Функция для получения пользователей (приоритет - файл с сохраненными данными)
export const getUsers = async (): Promise<User[]> => {
  try {
    const data = await fs.readFile(PERSISTED_USERS_FILE, 'utf-8');
    const persistedUsers: User[] = JSON.parse(data);
    if (Array.isArray(persistedUsers) && persistedUsers.length > 0) {
      return persistedUsers;
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log('persisted-users.json не найден, возвращаем дефолтных пользователей.');
    } else {
      console.error('Ошибка чтения persisted-users.json:', error);
    }
  }
  return defaultUsers;
};

// Функция для обновления пользователей в файле
export const updateUsers = async (newUsers: User[]): Promise<void> => {
  try {
    await fs.writeFile(PERSISTED_USERS_FILE, JSON.stringify(newUsers, null, 2), 'utf-8');
    console.log('Пользователи успешно сохранены в файл.');
  } catch (error) {
    console.error('Ошибка записи в persisted-users.json:', error);
    throw new Error('Не удалось сохранить пользователей.');
  }
};
