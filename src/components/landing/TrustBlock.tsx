
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Users, Heart, Star } from "lucide-react";

const TrustBlock = () => {
  return (
    <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl">
          <CardContent className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Doctor Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">ОП</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">👩‍⚕️ Доктор Ольга Пучкова</h3>
                    <p className="text-purple-700 font-medium">Создатель и научный руководитель PREVENT</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">15+ лет в диагностике женского здоровья</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Эксперт по AI в медицине (SberMed.AI)</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Аккредитация EUSOBI (Европейская ассоциация маммографии)</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">1000+ довольных пользователей</span>
                  </div>
                </div>
              </div>

              {/* Certifications & Stats */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Аккредитации и партнерства</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Badge variant="outline" className="justify-center py-3 border-purple-200 text-purple-700">
                      <Shield className="w-4 h-4 mr-2" />
                      EUSOBI
                    </Badge>
                    <Badge variant="outline" className="justify-center py-3 border-blue-200 text-blue-700">
                      <Award className="w-4 h-4 mr-2" />
                      SberMed.AI
                    </Badge>
                    <Badge variant="outline" className="justify-center py-3 border-green-200 text-green-700">
                      <Star className="w-4 h-4 mr-2" />
                      Stanford Medicine
                    </Badge>
                    <Badge variant="outline" className="justify-center py-3 border-red-200 text-red-700">
                      <Heart className="w-4 h-4 mr-2" />
                      РАПРМ
                    </Badge>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-700 mb-2">1000+</div>
                  <p className="text-purple-600 font-medium">женщин уже знают свои риски</p>
                  <p className="text-sm text-purple-500 mt-1">и активно заботятся о своем здоровье</p>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-700 font-medium">
                    "Раннее выявление спасает жизни. Большинство заболеваний можно предотвратить. 
                    Знание — ваша сила."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">— Доктор Ольга Пучкова</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TrustBlock;
