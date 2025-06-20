import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Users, Heart, Star, Lock } from "lucide-react";

const TrustBlock = () => {
  return (
    <section id="scientific-basis" className="py-16 px-4 md:px-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardContent className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Doctor Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">ОП</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">👩‍⚕️ Доктор Ольга Пучкова</h3>
                    <p className="text-purple-700 font-semibold">Создатель и научный руководитель PREVENT</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 group">
                    <Award className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                    <span className="text-gray-800 font-medium">15+ лет в диагностике женского здоровья</span>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                    <span className="text-gray-800 font-medium">Эксперт по AI в медицине (SberMed.AI)</span>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <Star className="w-5 h-5 text-green-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                    <span className="text-gray-800 font-medium">Аккредитация EUSOBI (Европейская ассоциация маммографии)</span>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <Users className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                    <span className="text-gray-800 font-medium">1000+ довольных пользователей</span>
                  </div>
                </div>
              </div>

              {/* Certifications & Stats */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Аккредитации и партнерства</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Badge variant="outline" className="justify-center py-3 border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors duration-200 font-semibold">
                      <Shield className="w-4 h-4 mr-2" aria-hidden="true" />
                      EUSOBI
                    </Badge>
                    <Badge variant="outline" className="justify-center py-3 border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors duration-200 font-semibold">
                      <Award className="w-4 h-4 mr-2" aria-hidden="true" />
                      SberMed.AI
                    </Badge>
                    <Badge variant="outline" className="justify-center py-3 border-green-200 text-green-700 hover:bg-green-50 transition-colors duration-200 font-semibold">
                      <Star className="w-4 h-4 mr-2" aria-hidden="true" />
                      Stanford Medicine
                    </Badge>
                    <Badge variant="outline" className="justify-center py-3 border-red-200 text-red-700 hover:bg-red-50 transition-colors duration-200 font-semibold">
                      <Heart className="w-4 h-4 mr-2" aria-hidden="true" />
                      РАПРМ
                    </Badge>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200">
                  <div className="text-4xl font-bold text-purple-700 mb-2">1000+</div>
                  <p className="text-purple-700 font-semibold">женщин уже знают свои риски</p>
                  <p className="text-sm text-purple-600 mt-1 font-medium">и активно заботятся о своем здоровье</p>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 text-center hover:shadow-lg transition-shadow duration-200">
                  <p className="text-sm text-gray-800 font-semibold leading-relaxed">
                    "Раннее выявление спасает жизни. Большинство заболеваний можно предотвратить. 
                    Знание — ваша сила."
                  </p>
                  <p className="text-xs text-gray-600 mt-2 font-medium">— Доктор Ольга Пучкова</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-blue-600" aria-hidden="true" />
                      <span className="text-blue-800 font-semibold">GDPR</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" aria-hidden="true" />
                      <span className="text-green-800 font-semibold">SSL 256-bit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-600" aria-hidden="true" />
                      <span className="text-red-800 font-semibold">Медэтика</span>
                    </div>
                  </div>
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
