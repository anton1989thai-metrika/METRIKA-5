'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Video, Search, User as UserIcon, Mail, UserCircle, PhoneCall } from 'lucide-react';
import { defaultUsers, User } from '@/data/users';

export default function CallVideoContactsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    // Загружаем список пользователей
    setUsers(defaultUsers);
    
    // Получаем текущего пользователя из localStorage или используем первого
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      setCurrentUserId(savedUserId);
    } else if (defaultUsers.length > 0) {
      setCurrentUserId(defaultUsers[0].id);
      localStorage.setItem('currentUserId', defaultUsers[0].id);
    }
  }, []);

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phoneWork && user.phoneWork.includes(query)) ||
      (user.phonePersonal && user.phonePersonal.includes(query))
    );
  });

  // Инициация видеозвонка
  const startVideoCall = (targetUserId: string) => {
    if (!currentUserId) {
      alert('Пожалуйста, выберите себя как текущего пользователя');
      return;
    }

    if (currentUserId === targetUserId) {
      alert('Нельзя позвонить самому себе');
      return;
    }

    // Генерируем уникальный roomId для звонка
    const roomId = `call-${currentUserId}-${targetUserId}-${Date.now()}`;
    
    // Переходим на страницу звонка для caller (текущий пользователь)
    const callerUrl = `/call-video?user=${currentUserId}&room=${roomId}`;
    router.push(callerUrl);
    
    // Для тестирования: можно открыть вторую вкладку с другим пользователем
    // В реальном приложении это будет уведомление для другого пользователя
    // setTimeout(() => {
    //   const calleeUrl = `/call-video?user=${targetUserId}&room=${roomId}`;
    //   window.open(calleeUrl, '_blank');
    // }, 1000);
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      admin: 'Администратор',
      manager: 'Менеджер',
      employee: 'Сотрудник',
      client: 'Клиент',
      freelancer: 'Фрилансер',
      'foreign-employee': 'Внешний сотрудник',
      'site-user': 'Пользователь сайта',
    };
    return roleLabels[role] || role;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const currentUser = users.find((u) => u.id === currentUserId);
  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Видеозвонки</h1>
              <p className="text-gray-600 mt-1">Выберите пользователя и позвоните ему</p>
            </div>
          </div>
        </div>

        {/* Текущий пользователь */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <UserCircle className="w-6 h-6 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">
                Вы звоните как:
              </label>
              <select
                value={currentUserId}
                onChange={(e) => {
                  setCurrentUserId(e.target.value);
                  localStorage.setItem('currentUserId', e.target.value);
                  setSelectedUserId(null); // Сбрасываем выбор при смене пользователя
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            {currentUser && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(currentUser.status)}`} />
                <span className="text-sm text-gray-700">{getRoleLabel(currentUser.role)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Поиск и список */}
          <div className="lg:col-span-2">
            {/* Поиск */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск по имени, email или телефону..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Список пользователей */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers
                .filter((user) => user.id !== currentUserId) // Исключаем текущего пользователя
                .map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all border-2 ${
                      selectedUserId === user.id
                        ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                        : 'border-transparent hover:border-gray-200 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xl shadow-md">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                          <p className="text-sm text-gray-500">{getRoleLabel(user.role)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(user.status)}`} />
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phoneWork && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phoneWork}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startVideoCall(user.id);
                      }}
                      className={`w-full font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                        selectedUserId === user.id
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                          : 'bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      <Video className="w-5 h-5" />
                      Позвонить
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Правая колонка - Информация о выбранном пользователе */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-6">
              {selectedUser ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-3xl mx-auto mb-4 shadow-lg">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedUser.name}</h2>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedUser.status)}`} />
                      <span className="text-sm text-gray-500">{getRoleLabel(selectedUser.role)}</span>
                    </div>
                    {selectedUser.status === 'active' && (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        В сети
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </div>
                      <p className="text-gray-900 font-medium">{selectedUser.email}</p>
                    </div>
                    {selectedUser.phoneWork && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Phone className="w-4 h-4" />
                          <span>Рабочий телефон</span>
                        </div>
                        <p className="text-gray-900 font-medium">{selectedUser.phoneWork}</p>
                      </div>
                    )}
                    {selectedUser.phonePersonal && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Phone className="w-4 h-4" />
                          <span>Личный телефон</span>
                        </div>
                        <p className="text-gray-900 font-medium">{selectedUser.phonePersonal}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => startVideoCall(selectedUser.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-5 h-5" />
                    Начать видеозвонок
                  </button>
                </>
              ) : (
                <div className="text-center py-12">
                  <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Выберите пользователя из списка</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {filteredUsers.filter((user) => user.id !== currentUserId).length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchQuery ? 'Пользователи не найдены' : 'Нет доступных пользователей'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

