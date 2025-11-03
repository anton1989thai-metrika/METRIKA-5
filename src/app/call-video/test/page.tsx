'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Users } from 'lucide-react';

export default function CallVideoTestPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('default-room');

  const startCall = (userId: string) => {
    const url = `/call-video?user=${userId}&room=${roomId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Тестирование видеозвонков
          </h1>
          <p className="text-gray-600">
            Откройте две вкладки для тестирования связи между пользователями
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID комнаты:
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Введите ID комнаты"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Пользователь 1 (Caller) */}
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Пользователь 1
                </h2>
                <p className="text-sm text-gray-500">Инициатор звонка</p>
              </div>
            </div>
            <button
              onClick={() => startCall('user1')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Открыть в новой вкладке
            </button>
          </div>

          {/* Пользователь 2 (Callee) */}
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Пользователь 2
                </h2>
                <p className="text-sm text-gray-500">Принимающий звонок</p>
              </div>
            </div>
            <button
              onClick={() => startCall('user2')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Открыть в новой вкладке
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Инструкция:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Откройте Пользователя 1 в новой вкладке</li>
            <li>Откройте Пользователя 2 в другой вкладке</li>
            <li>Разрешите доступ к камере и микрофону в обеих вкладках</li>
            <li>Пользователь 1 автоматически инициирует звонок</li>
            <li>После подключения вы увидите видео друг друга</li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/call-video?user=user1&room=' + roomId)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Или перейти напрямую к странице звонка →
          </button>
        </div>
      </div>
    </div>
  );
}

