"use client"

import { useLanguage } from "@/contexts/LanguageContext";
import { RealEstateObject } from "@/data/realEstateObjects";
import { useCallback, useEffect, useRef, useState } from "react";

interface YandexMapProps {
  objects: RealEstateObject[];
  onVisibleObjectsChange: (objects: RealEstateObject[]) => void;
}

type YMapBounds = [[number, number], [number, number]]

type YMapPlacemark = unknown

type YMapInstance = {
  container: {
    fitToViewport: () => void
  }
  events: {
    add: (event: string, handler: () => void) => void
  }
  getBounds: () => YMapBounds
  setBounds: (bounds: YMapBounds) => void
  geoObjects: {
    add: (placemark: YMapPlacemark) => void
    remove: (placemark: YMapPlacemark) => void
  }
}

type YMapsApi = {
  ready: (handler: () => void) => void
  Map: new (
    element: HTMLElement,
    options: { center: number[]; zoom: number; controls: string[] }
  ) => YMapInstance
  Placemark: new (
    coords: number[],
    properties: Record<string, unknown>,
    options: Record<string, unknown>
  ) => YMapPlacemark
}

declare global {
  interface Window {
    ymaps?: YMapsApi;
  }
}

export default function YandexMap({ objects, onVisibleObjectsChange }: YandexMapProps) {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<YMapInstance | null>(null);
  const markersRef = useRef<YMapPlacemark[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapLang = t('yandexMapLang') || 'ru_RU';

  const getMarkerColor = useCallback((type: string) => {
    switch (type) {
      case 'apartment': return '#3B82F6'; // Синий
      case 'house': return '#10B981'; // Зеленый
      case 'commercial': return '#F59E0B'; // Оранжевый
      case 'land': return '#8B5CF6'; // Фиолетовый
      case 'nonCapital': return '#EF4444'; // Красный
      case 'shares': return '#6B7280'; // Серый
      default: return '#3B82F6';
    }
  }, []);

  const updateVisibleObjects = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const bounds = mapInstanceRef.current.getBounds();
    const visibleObjects: RealEstateObject[] = [];

    objects.forEach(obj => {
      const lat = obj.coordinates.lat;
      const lng = obj.coordinates.lng;
      
      if (lat >= bounds[0][0] && lat <= bounds[1][0] && 
          lng >= bounds[0][1] && lng <= bounds[1][1]) {
        visibleObjects.push(obj);
      }
    });

    // Показываем все видимые объекты без ограничений
    onVisibleObjectsChange(visibleObjects);
  }, [objects, onVisibleObjectsChange]);

  const addMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;

    // Удаляем старые маркеры
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.geoObjects.remove(marker);
    });
    markersRef.current = [];

    // Добавляем новые маркеры
    objects.forEach(obj => {
      const marker = window.ymaps?.Placemark
        ? new window.ymaps.Placemark(
        [obj.coordinates.lat, obj.coordinates.lng],
        {
          balloonContentHeader: obj.title || `Объект ${obj.id}`,
          balloonContentBody: `
            <div>
              <p><strong>Адрес:</strong> ${obj.address || 'Не указан'}</p>
              <p><strong>Площадь:</strong> ${obj.area}</p>
              <p><strong>Этаж:</strong> ${obj.floor}</p>
              <p><strong>Цена:</strong> ${obj.price}</p>
              <p><strong>Материал:</strong> ${obj.material || 'Не указан'}</p>
            </div>
          `,
          balloonContentFooter: `<button onclick="window.open('/objects', '_blank')" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Подробнее</button>`
        },
        {
          preset: 'islands#blueDotIcon',
          iconColor: getMarkerColor(obj.type)
        }
      )
        : null
      if (!marker) return

      mapInstanceRef.current?.geoObjects.add(marker);
      markersRef.current.push(marker);
    });

    updateVisibleObjects();
  }, [getMarkerColor, objects, updateVisibleObjects]);

  // Загружаем Яндекс.Карты
  useEffect(() => {
    const existingScript = document.getElementById('yandex-maps-sdk') as HTMLScriptElement | null
    if (existingScript) {
      if (existingScript.dataset.lang === mapLang) {
        if (window.ymaps) {
          window.ymaps.ready(() => {
            setIsLoaded(true);
          });
        }
        return
      }
      existingScript.remove()
    }

    setIsLoaded(false)
    const script = document.createElement('script');
    script.id = 'yandex-maps-sdk'
    script.dataset.lang = mapLang
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=ba2d7617-fe30-4f3b-875a-bd485d49cf3c&lang=${mapLang}`;
    script.async = true;
    
    script.onload = () => {
      if (window.ymaps) {
        window.ymaps.ready(() => {
          setIsLoaded(true);
        });
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [mapLang]);

  // Обработчик изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      // Обновляем карту при изменении размера
      const map = mapInstanceRef.current
      if (map) {
        // Принудительно обновляем размеры карты
        setTimeout(() => {
          try {
            map.container.fitToViewport();
            // Дополнительно обновляем карту
            map.setBounds(map.getBounds());
          } catch {
            // Карта обновляется...
          }
        }, 50);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Инициализация карты
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    // Создаем карту
    window.ymaps?.ready(() => {
      if (!window.ymaps || !mapRef.current) return
      const map = new window.ymaps.Map(mapRef.current, {
        center: [55.7558, 37.6176], // Центр Москвы
        zoom: 10,
        controls: ['zoomControl', 'fullscreenControl']
      });

      mapInstanceRef.current = map;

      // Обработчик изменения видимой области карты
      map.events.add('boundschange', updateVisibleObjects);

      // Добавляем маркеры
      addMarkers();
    });
  }, [addMarkers, isLoaded, updateVisibleObjects]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;
    addMarkers();
  }, [addMarkers, isLoaded]);

  if (!isLoaded) {
    return (
      <div 
        className="h-[760px] bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ width: '100%', minWidth: '300px' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка карты...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-[760px] bg-gray-100 rounded-lg overflow-hidden transition-all duration-300"
      style={{ width: '100%', minWidth: '300px' }}
    >
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
}
