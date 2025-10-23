"use client"

import { useLanguage } from "@/contexts/LanguageContext";
import { RealEstateObject } from "@/data/realEstateObjects";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home } from "lucide-react";
import Link from "next/link";

interface VisibleObjectsListProps {
  objects: RealEstateObject[];
}

export default function VisibleObjectsList({ objects }: VisibleObjectsListProps) {
  const { t } = useLanguage();

  if (objects.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-black mb-4">
          Объектов в выбранной области: 0
        </h3>
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-center">
              {t('map.noVisibleObjects')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-black mb-4">
        Объектов в выбранной области: {objects.length}
      </h3>
      
      <div className="h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="space-y-4">
        {objects.map((object) => (
          <Card key={object.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
            <CardHeader className="p-0">
              <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                <div className="text-center">
                  <Home className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-gray-500 text-xs">{t('objects.photo')}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-3">
              <CardTitle className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                {object.title || `Объект ${object.id}`}
              </CardTitle>
              
              <div className="mb-2">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">
                    {object.address || 'Адрес не указан'}
                    {object.area && ` • ${object.area}`}
                    {object.floor && ` • ${object.floor}`}
                  </span>
                </div>
              </div>
              
              <div className="text-sm font-bold text-gray-900 mb-2">
                {object.price}
              </div>
            </CardContent>
            
            <CardFooter className="p-3 pt-0">
              <Button 
                asChild
                size="sm" 
                className="w-full"
                variant="default"
              >
                <Link href={`/objects/${object.id}`}>
                  {t('objects.details')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
}
