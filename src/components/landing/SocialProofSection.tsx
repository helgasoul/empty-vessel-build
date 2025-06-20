
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Quote, 
  ChevronDown, 
  Shield, 
  Lock, 
  UserCheck,
  ArrowRight 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SocialProofSection = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Анна К.",
      age: "38 лет, маркетолог",
      avatar: "АК",
      rating: 5,
      text: "Благодаря PREVENT я обнаружила предрасположенность к диабету и изменила питание. Через 6 месяцев все показатели в норме!",
      highlight: "предрасположенность к диабету"
    },
    {
      name: "Мария С.",
      age: "42 года, дизайнер",
      avatar: "МС",
      rating: 5,
      text: "Платформа помогла мне подготовиться к менопаузе. Теперь я знаю, что делать и чувствую себя уверенно.",
      highlight: "подготовиться к менопаузе"
    },
    {
      name: "Елена Р.",
      age: "35 лет, врач",
      avatar: "ЕР",
      rating: 5,
      text: "Как врач, я ценю научный подход PREVENT. Рекомендации основаны на доказательной медицине.",
      highlight: "научный подход"
    }
  ];

  const faqs = [
    {
      question: "Насколько точен анализ?",
      answer: "Наши алгоритмы основаны на международных медицинских протоколах и данных исследований с участием более 100,000 женщин. Точность оценки рисков составляет 85-92% в зависимости от типа заболевания."
    },
    {
      question: "Безопасны ли мои данные?",
      answer: "Абсолютно. Мы используем банковское шифрование данных, соответствуем стандартам GDPR и не передаем персональную информацию третьим лицам без вашего согласия."
    },
    {
      question: "Заменяет ли это визит к врачу?",
      answer: "Нет, PREVENT дополняет, но не заменяет консультации врача. Мы помогаем выявить риски и подготовиться к встрече с доктором с конкретными вопросами."
    },
    {
      question: "Сколько времени занимает оценка?",
      answer: "Первичная оценка рисков занимает всего 5-7 минут. Дополнительные данные можно добавлять постепенно для более точного анализа."
    }
  ];

  return (
    <section className="py-20 px-4 md:px-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Social Proof */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 mb-6">
            ⭐ Отзывы пользователей
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Истории наших пользователей
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Узнайте, как PREVENT помог тысячам женщин взять здоровье под контроль
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.age}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Quote className="w-6 h-6 text-purple-300 mb-3" />
                <p className="text-gray-700 leading-relaxed">
                  {testimonial.text.split(testimonial.highlight)[0]}
                  <span className="font-semibold text-purple-700">{testimonial.highlight}</span>
                  {testimonial.text.split(testimonial.highlight)[1]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-800 mb-6">
              ❓ Часто задаваемые вопросы
            </Badge>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Ответы на ваши вопросы
            </h3>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border border-purple-100">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-purple-50 rounded-lg">
                  <span className="text-left font-semibold text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Security badges */}
        <div className="mt-16 text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Безопасность и доверие</h4>
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-700">Врачебная этика</span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
            <CardContent className="py-12 text-center">
              <h3 className="text-3xl font-bold mb-4">
                Начните заботиться о здоровье уже сегодня
              </h3>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Присоединяйтесь к женщинам, которые взяли свое здоровье под контроль. 
                Первая оценка рисков займет всего 5 минут.
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-purple-600 hover:text-purple-700 text-lg px-8 py-4"
                onClick={() => navigate('/auth')}
              >
                Пройти оценку рисков
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm mt-4 opacity-75">
                Бесплатно • Без обязательств • Конфиденциально
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
