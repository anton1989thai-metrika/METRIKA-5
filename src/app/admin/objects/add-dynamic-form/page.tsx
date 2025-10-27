'use client';

import React, { useState, useEffect } from 'react';
import { FieldRow, FormData, FilterState } from '@/types/realEstateForm';
import { FIELD_ROWS } from '@/data/fieldRows';
import { filterFields } from '@/lib/fieldFilter';
import { DynamicForm } from '@/components/DynamicRealEstateForm';
import { MediaUploader, MediaFile } from '@/components/MediaUploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-fixed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const COUNTRIES = ['Россия', 'Таиланд', 'Китай', 'Южная Корея'];
const OPERATIONS = ['Продажа', 'Аренда', 'Обмен'];
const OBJECT_TYPES = [
  'Квартира',
  'Частный дом',
  'Коммерческое помещение',
  'Здание',
  'Имущественный комплекс',
  'Некапитальный объект',
  'Доля в праве',
  'Земельный участок'
];

export default function DynamicRealEstateFormPage() {
  const [filters, setFilters] = useState<FilterState>({});
  const [formData, setFormData] = useState<FormData>({});
  const [availableFields, setAvailableFields] = useState<FieldRow[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [activeTab, setActiveTab] = useState<'characteristics' | 'media'>('characteristics');
  
  // Обновляем доступные поля при изменении фильтров
  useEffect(() => {
    const filtered = filterFields(FIELD_ROWS, filters);
    setAvailableFields(filtered);
    
    // Очищаем данные формы при изменении фильтров
    setFormData({});
  }, [filters]);
  
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '__empty__' ? undefined : value
    }));
  };
  
  const handleFormDataChange = (data: FormData) => {
    setFormData(data);
  };
  
  const handleMediaChange = (media: MediaFile[]) => {
    setMediaFiles(media);
    
    // Автоматически устанавливаем первое изображение как обложку, если обложки еще нет
    const hasCover = media.some(item => item.isCover);
    if (!hasCover && media.length > 0) {
      const firstImage = media.find(m => m.type === 'image');
      if (firstImage) {
        firstImage.isCover = true;
      }
    }
  };
  
  const handleSetCover = (id: string) => {
    setMediaFiles((items) => {
      const updatedItems = items.map((item) => ({
        ...item,
        isCover: item.id === id
      }));
      return updatedItems;
    });
  };
  
  const handleRemoveMedia = (id: string) => {
    setMediaFiles((items) => {
      const updatedItems = items.filter(file => file.id !== id);
      
      // Если удаляем обложку, выбираем новую
      const removedItem = items.find(item => item.id === id);
      if (removedItem?.isCover) {
        const firstImage = updatedItems.find(item => item.type === 'image');
        if (firstImage) {
          firstImage.isCover = true;
        }
      }
      
      return updatedItems;
    });
  };
  
  const handleSubmit = (data: FormData) => {
    // Подготавливаем медиа-данные для сохранения
    const mediaData = mediaFiles.map(file => ({
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.size,
      isCover: file.isCover || false,
      order: file.order || 0
    }));

    const coverFile = mediaFiles.find(file => file.isCover);

    const newObject = {
      id: Date.now(),
      title: data.address || 'Новый объект',
      address: data.address || '',
      area: `${data.totalArea || ''} ${data.areaUnit || ''}`,
      floor: data.floor || '',
      price: data.price || '',
      material: data.material || '',
      coordinates: { lat: 0, lng: 0 },
      type: filters.objectType,
      operation: filters.operation,
      country: filters.country,
      fields: data, // 👈 сохраняем все заполненные поля формы
      media: mediaData, // 👈 сохраняем информацию о медиа-файлах с порядком и обложкой
      coverId: coverFile?.id // 👈 сохраняем ID обложки
    };

    console.log('Сохранён объект с медиа:', newObject);
    console.log('Медиа-файлы:', mediaFiles);
    console.log('Обложка:', coverFile);
    alert(`Объект недвижимости успешно сохранён!\n\nХарактеристики: ${Object.keys(data).length} полей\nМедиа-файлы: ${mediaFiles.length} файлов\nОбложка: ${coverFile ? coverFile.name : 'не выбрана'}`);
    
    // Позже можно добавить сохранение в localStorage или API
  };
  
  const handleReset = () => {
    setFilters({});
    setFormData({});
    setMediaFiles([]);
    setActiveTab('characteristics');
  };
  
  return (
    <ProtectedRoute requiredPermission="adminPanel">
      <div className="container mx-auto py-8 space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Админ панель</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/objects">Объекты недвижимости</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Добавить объект</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Добавить объект недвижимости</CardTitle>
            <CardDescription>
              Заполните характеристики объекта и добавьте фотографии
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'characteristics' | 'media')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="characteristics" className="flex items-center gap-2">
                  <span>Характеристики</span>
                  {Object.keys(formData).length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {Object.keys(formData).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <span>Фото и видео</span>
                  {mediaFiles.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {mediaFiles.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="characteristics" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Основная информация</h3>
                  <p className="text-gray-600">Выберите страну, операцию и тип объекта для отображения релевантных полей</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Страна</label>
                      <Select value={filters.country || ''} onValueChange={(value) => handleFilterChange('country', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите страну" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="empty" value="__empty__">
                            —
                          </SelectItem>
                          {COUNTRIES.map(country => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Операция</label>
                      <Select value={filters.operation || ''} onValueChange={(value) => handleFilterChange('operation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите операцию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="empty" value="__empty__">
                            —
                          </SelectItem>
                          {OPERATIONS.map(operation => (
                            <SelectItem key={operation} value={operation}>
                              {operation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Тип объекта</label>
                      <Select value={filters.objectType || ''} onValueChange={(value) => handleFilterChange('objectType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип объекта" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="empty" value="__empty__">
                            —
                          </SelectItem>
                          {OBJECT_TYPES.map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Адрес</label>
                      <Input
                        type="text"
                        placeholder="Введите адрес объекта"
                        value={formData.address || ''}
                        onChange={(e) => handleFormDataChange({ ...formData, address: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Общая площадь</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            type="number"
                            placeholder="Введите площадь"
                            value={formData.totalArea || ''}
                            onChange={(e) => handleFormDataChange({ ...formData, totalArea: e.target.value })}
                          />
                        </div>
                        <div className="relative">
                          <Select 
                            value={formData.areaUnit || 'm2'} 
                            onValueChange={(value) => handleFormDataChange({ ...formData, areaUnit: value === '__empty__' ? undefined : value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__empty__">—</SelectItem>
                              <SelectItem value="m2">м²</SelectItem>
                              <SelectItem value="hectare">Гектар</SelectItem>
                              <SelectItem value="sotka">Сотки</SelectItem>
                              <SelectItem value="wah2">Wah²</SelectItem>
                              <SelectItem value="ngan">Ngan</SelectItem>
                              <SelectItem value="rai">Rai</SelectItem>
                              <SelectItem value="pyeong">평</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DynamicForm
                  fields={availableFields}
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                  onSubmit={handleSubmit}
                  onReset={handleReset}
                />
              </TabsContent>
              
              <TabsContent value="media" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Фото и видео</h3>
                  
                  <MediaUploader
                    onMediaChange={handleMediaChange}
                    maxFiles={20}
                    maxSize={50}
                  />
                  
                  <div className="flex gap-4 pt-6 justify-end">
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      Сбросить
                    </Button>
                    <Button 
                      onClick={() => handleSubmit(formData)}
                      className="flex items-center gap-2"
                      disabled={Object.keys(formData).length === 0}
                    >
                      <Save className="w-4 h-4" />
                      Сохранить объект
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
      </div>
    </ProtectedRoute>
  );
}