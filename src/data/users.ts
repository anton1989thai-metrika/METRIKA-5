// Статические данные пользователей

export interface RoleSettings {
  'profile': boolean;
  'my-objects': boolean;
  'email': boolean;
  'academy': boolean;
  'knowledge-base': boolean;
  'tasks': boolean;
  'admin': boolean;
  'hide-in-tasks': boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  login?: string;
  password?: string;
  role: 'site-user' | 'client' | 'foreign-employee' | 'freelancer' | 'employee' | 'manager' | 'admin';
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
      canChangeExecutorInOwnTasks: boolean;
      canChangeCuratorInOwnTasks: boolean;
      cannotEditTasksFrom: string[];
      canCreateHiddenTasks: boolean;
      canViewHiddenTasks: boolean;
      hiddenTasksFrom: string[];
    };
  };
  lastLogin?: string;
  createdAt: string;
  // Новые поля
  dateOfBirth?: string; // Дата рождения (формат: ДД.ММ.ГГГГ)
  phoneWork?: string; // Рабочий телефон
  phonePersonal?: string; // Личный телефон
  address?: string; // Адрес
  userObjects?: string[]; // ID объектов пользователя
  comments?: string; // Комментарии
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
        canChangeExecutorInOwnTasks: true,
        canChangeCuratorInOwnTasks: true,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: true,
        canViewHiddenTasks: true,
        hiddenTasksFrom: []
      }
    },
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-01T00:00:00Z',
    dateOfBirth: '15.03.1985',
    phoneWork: '+7 (999) 123-45-67',
    phonePersonal: '+7 (999) 123-45-68',
    address: 'г. Москва, ул. Тверская, д. 1',
    userObjects: ['obj1', 'obj2'],
    comments: 'Основатель компании'
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
        canChangeExecutorInOwnTasks: true,
        canChangeCuratorInOwnTasks: true,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: true,
        canViewHiddenTasks: true,
        hiddenTasksFrom: []
      }
    },
    lastLogin: '2024-01-15T09:15:00Z',
    createdAt: '2023-08-15T00:00:00Z',
    dateOfBirth: '22.07.1990',
    phoneWork: '+7 (999) 234-56-78',
    phonePersonal: '+7 (999) 234-56-79',
    address: 'г. Москва, ул. Арбат, д. 10',
    userObjects: ['obj3'],
    comments: 'Ведущий менеджер'
  },
  {
    id: '3',
    name: 'Маслова Ирина',
    email: 'maslova@metrika.direct',
    login: 'maslova',
    password: 'agent123',
    role: 'employee',
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
        canChangeExecutorInOwnTasks: true,
        canChangeCuratorInOwnTasks: true,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: true,
        canViewHiddenTasks: true,
        hiddenTasksFrom: []
      }
    },
    lastLogin: '2024-01-15T08:45:00Z',
    createdAt: '2023-10-01T00:00:00Z',
    dateOfBirth: '10.05.1988',
    phoneWork: '+7 (999) 345-67-89',
    phonePersonal: '+7 (999) 345-67-90',
    address: 'г. Москва, ул. Ленина, д. 5',
    userObjects: ['obj4', 'obj5'],
    comments: 'Агент по недвижимости'
  },
  {
    id: '4',
    name: 'Ионин Владислав',
    email: 'ionin@metrika.direct',
    login: 'ionin',
    password: 'agent123',
    role: 'employee',
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
        canChangeExecutorInOwnTasks: true,
        canChangeCuratorInOwnTasks: true,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: true,
        canViewHiddenTasks: true,
        hiddenTasksFrom: []
      }
    },
    lastLogin: '2024-01-15T08:30:00Z',
    createdAt: '2023-10-15T00:00:00Z',
    dateOfBirth: '18.12.1992',
    phoneWork: '+7 (999) 456-78-90',
    phonePersonal: '+7 (999) 456-78-91',
    address: 'г. Москва, ул. Красная, д. 15',
    userObjects: ['obj6'],
    comments: 'Агент по недвижимости'
  },
  {
    id: '5',
    name: 'Андрей Широких',
    email: 'shirokikh@metrika.direct',
    login: 'shirokikh',
    password: 'agent123',
    role: 'employee',
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
        canChangeExecutorInOwnTasks: true,
        canChangeCuratorInOwnTasks: true,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: true,
        canViewHiddenTasks: true,
        hiddenTasksFrom: []
      }
    },
    lastLogin: '2024-01-15T08:15:00Z',
    createdAt: '2023-11-01T00:00:00Z',
    dateOfBirth: '25.09.1987',
    phoneWork: '+7 (999) 567-89-01',
    phonePersonal: '+7 (999) 567-89-02',
    address: 'г. Москва, ул. Пушкина, д. 20',
    userObjects: ['obj7', 'obj8'],
    comments: 'Агент по недвижимости'
  },
  {
    id: '6',
    name: 'Бердник Вадим',
    email: 'berdnik@metrika.direct',
    login: 'berdnik',
    password: 'agent123',
    role: 'employee',
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
        canChangeExecutorInOwnTasks: true,
        canChangeCuratorInOwnTasks: true,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: true,
        canViewHiddenTasks: true,
        hiddenTasksFrom: []
      }
    },
    lastLogin: '2024-01-15T08:00:00Z',
    createdAt: '2023-11-15T00:00:00Z',
    dateOfBirth: '03.11.1991',
    phoneWork: '+7 (999) 678-90-12',
    phonePersonal: '+7 (999) 678-90-13',
    address: 'г. Москва, ул. Гагарина, д. 25',
    userObjects: ['obj9'],
    comments: 'Агент по недвижимости'
  },
  {
    id: '7',
    name: 'Дерик Олег',
    email: 'derik@metrika.direct',
    login: 'derik',
    password: 'agent123',
    role: 'employee',
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
        canChangeExecutorInOwnTasks: true,
        canChangeCuratorInOwnTasks: true,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: true,
        canViewHiddenTasks: true,
        hiddenTasksFrom: []
      }
    },
    lastLogin: '2024-01-15T07:45:00Z',
    createdAt: '2023-12-01T00:00:00Z',
    dateOfBirth: '14.06.1989',
    phoneWork: '+7 (999) 789-01-23',
    phonePersonal: '+7 (999) 789-01-24',
    address: 'г. Москва, ул. Мира, д. 30',
    userObjects: ['obj10'],
    comments: 'Агент по недвижимости'
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
        canChangeExecutorInOwnTasks: true,
        canChangeCuratorInOwnTasks: true,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: true,
        canViewHiddenTasks: true,
        hiddenTasksFrom: []
      }
    },
    lastLogin: '2024-01-14T17:30:00Z',
    createdAt: '2023-12-15T00:00:00Z',
    dateOfBirth: '28.02.1995',
    phoneWork: '+7 (999) 890-12-34',
    phonePersonal: '+7 (999) 890-12-35',
    address: 'г. Москва, ул. Советская, д. 35',
    userObjects: [],
    comments: 'Секретарь'
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
        canChangeExecutorInOwnTasks: true,
        canChangeCuratorInOwnTasks: true,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: true,
        canViewHiddenTasks: true,
        hiddenTasksFrom: []
      }
    },
    lastLogin: '2024-01-14T17:15:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    dateOfBirth: '07.08.1993',
    phoneWork: '+7 (999) 901-23-45',
    phonePersonal: '+7 (999) 901-23-46',
    address: 'г. Москва, ул. Комсомольская, д. 40',
    userObjects: [],
    comments: 'Секретарь'
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
        canChangeExecutorInOwnTasks: true,
        canChangeCuratorInOwnTasks: true,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: true,
        canViewHiddenTasks: true,
        hiddenTasksFrom: []
      }
    },
    lastLogin: '2024-01-14T17:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    dateOfBirth: '19.04.1994',
    phoneWork: '+7 (999) 012-34-56',
    phonePersonal: '+7 (999) 012-34-57',
    address: 'г. Москва, ул. Парковая, д. 45',
    userObjects: [],
    comments: 'Секретарь'
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
        canChangeExecutorInOwnTasks: true,
        canChangeCuratorInOwnTasks: true,
        cannotEditTasksFrom: [],
        canCreateHiddenTasks: true,
        canViewHiddenTasks: true,
        hiddenTasksFrom: []
      }
    },
    lastLogin: '2024-01-14T16:45:00Z',
    createdAt: '2024-01-20T00:00:00Z',
    dateOfBirth: '12.10.1996',
    phoneWork: '+7 (999) 123-45-78',
    phonePersonal: '+7 (999) 123-45-79',
    address: 'г. Москва, ул. Садовая, д. 50',
    userObjects: [],
    comments: 'Секретарь'
  }
];

// Экспорт дефолтных пользователей
export { defaultUsers as users };
