
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMedicalPartners, useGynecologyAppointments, useLabTests, useScreeningPlans } from '@/hooks/useMedicalPartners';
import { Building, TestTube, Calendar, Star, Phone, MapPin, Globe, Clock, Users } from 'lucide-react';
import AppointmentBookingModal from './AppointmentBookingModal';
import LabTestBookingModal from './LabTestBookingModal';

const GynecologyPartnersSection = () => {
  const [selectedTab, setSelectedTab] = useState('partners');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showLabTestModal, setShowLabTestModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const { data: partners, isLoading: partnersLoading } = useMedicalPartners();
  const { data: appointments } = useGynecologyAppointments();
  const { data: labTests } = useLabTests();
  const { data: screeningPlans } = useScreeningPlans();

  const clinics = partners?.filter(p => p.partner_type === 'gynecology_clinic') || [];
  const laboratories = partners?.filter(p => p.partner_type === 'laboratory') || [];

  const getPartnerTypeIcon = (type: string) => {
    switch (type) {
      case 'gynecology_clinic': return <Building className="w-5 h-5 text-blue-600" />;
      case 'laboratory': return <TestTube className="w-5 h-5 text-purple-600" />;
      case 'diagnostic_center': return <Calendar className="w-5 h-5 text-green-600" />;
      case 'hospital': return <Building className="w-5 h-5 text-red-600" />;
      default: return <Building className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPartnerTypeName = (type: string) => {
    switch (type) {
      case 'gynecology_clinic': return 'Гинекологическая клиника';
      case 'laboratory': return 'Лаборатория';
      case 'diagnostic_center': return 'Диагностический центр';
      case 'hospital': return 'Больница';
      default: return type;
    }
  };

  const handleBookAppointment = (partner: any) => {
    setSelectedPartner(partner);
    setShowAppointmentModal(true);
  };

  const handleBookLabTest = (partner: any) => {
    setSelectedPartner(partner);
    setShowLabTestModal(true);
  };

  if (partnersLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">Загрузка партнеров...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-montserrat text-text-primary">
            Медицинские партнеры
          </h1>
          <p className="text-text-secondary mt-2">
            Запись к врачам и лабораторные исследования
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{clinics.length}</p>
                <p className="text-sm text-gray-600">Клиник</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TestTube className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{laboratories.length}</p>
                <p className="text-sm text-gray-600">Лабораторий</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{appointments?.length || 0}</p>
                <p className="text-sm text-gray-600">Записей</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TestTube className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{labTests?.length || 0}</p>
                <p className="text-sm text-gray-600">Анализов</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="partners">Партнеры</TabsTrigger>
          <TabsTrigger value="appointments">Записи</TabsTrigger>
          <TabsTrigger value="tests">Анализы</TabsTrigger>
          <TabsTrigger value="plans">Планы</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
          <div className="grid gap-4">
            {partners?.map((partner) => (
              <Card key={partner.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getPartnerTypeIcon(partner.partner_type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{partner.partner_name}</CardTitle>
                        <CardDescription>
                          {getPartnerTypeName(partner.partner_type)}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">
                            {partner.integration_status === 'active' ? 'Активен' : 'Неактивен'}
                          </Badge>
                          {partner.women_health_focus && (
                            <Badge variant="secondary">Женское здоровье</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {partner.quality_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{partner.quality_rating}</span>
                        </div>
                      )}
                      {partner.women_health_expertise && (
                        <div className="flex items-center gap-1 text-pink-600">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">{partner.women_health_expertise}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {partner.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{partner.address.city}, {partner.address.address}</span>
                        </div>
                      )}
                      {partner.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{partner.phone}</span>
                        </div>
                      )}
                      {partner.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <a href={partner.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            Сайт клиники
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{partner.patient_reviews_count} отзывов</span>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Специализации:</h4>
                      <div className="flex flex-wrap gap-2">
                        {partner.specializations.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Available Services */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Доступные услуги:</h4>
                      <div className="flex flex-wrap gap-2">
                        {partner.available_services.map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {partner.appointment_booking_available && (
                        <Button 
                          onClick={() => handleBookAppointment(partner)}
                          className="gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Записаться
                        </Button>
                      )}
                      {partner.partner_type === 'laboratory' && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleBookLabTest(partner)}
                          className="gap-2"
                        >
                          <TestTube className="w-4 h-4" />
                          Анализы
                        </Button>
                      )}
                      {partner.telemedicine_available && (
                        <Button variant="outline" className="gap-2">
                          <Globe className="w-4 h-4" />
                          Телемедицина
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <div className="space-y-4">
            {appointments && appointments.length > 0 ? (
              appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{appointment.service_name || appointment.appointment_type}</h3>
                        <p className="text-gray-600">{appointment.doctor_name}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {appointment.appointment_date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.appointment_time}
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        appointment.booking_status === 'confirmed' ? 'default' :
                        appointment.booking_status === 'completed' ? 'secondary' :
                        appointment.booking_status === 'cancelled' ? 'destructive' : 'outline'
                      }>
                        {appointment.booking_status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">У вас пока нет записей к врачам</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tests">
          <div className="space-y-4">
            {labTests && labTests.length > 0 ? (
              labTests.map((test) => (
                <Card key={test.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{test.test_name}</h3>
                        <p className="text-gray-600">Код: {test.test_code}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {test.collection_date || 'Не назначено'}
                          </div>
                          <Badge variant="outline">
                            {test.test_category}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant={
                        test.status === 'completed' ? 'default' :
                        test.status === 'processing' ? 'secondary' :
                        test.status === 'cancelled' ? 'destructive' : 'outline'
                      }>
                        {test.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">У вас пока нет запланированных анализов</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="plans">
          <div className="space-y-4">
            {screeningPlans && screeningPlans.length > 0 ? (
              screeningPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{plan.plan_name}</h3>
                        <p className="text-gray-600">{plan.plan_type}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {plan.next_appointment_date || 'Не назначено'}
                          </div>
                          <span>{plan.completion_percentage}% выполнено</span>
                        </div>
                      </div>
                      <Badge variant={
                        plan.priority_level === 'urgent' ? 'destructive' :
                        plan.priority_level === 'high' ? 'default' :
                        plan.priority_level === 'medium' ? 'secondary' : 'outline'
                      }>
                        {plan.priority_level}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">У вас пока нет планов скрининга</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AppointmentBookingModal 
        open={showAppointmentModal}
        onOpenChange={setShowAppointmentModal}
        partner={selectedPartner}
      />

      <LabTestBookingModal 
        open={showLabTestModal}
        onOpenChange={setShowLabTestModal}
        partner={selectedPartner}
      />
    </div>
  );
};

export default GynecologyPartnersSection;
