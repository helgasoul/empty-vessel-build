
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Smartphone, Activity, Heart, Weight, TrendingUp } from "lucide-react";
import { useDevices } from '@/hooks/useDevices';
import { useHealthData } from '@/hooks/useHealthData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const HealthMetricsCards = () => {
  const { user } = useAuth();
  const { devices } = useDevices();
  const { getHealthMetrics } = useHealthData();
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching profile for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('height, weight')
          .eq('id', user.id)
          .maybeSingle();

        console.log('Profile data received:', data);
        console.log('Profile error:', error);

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data);
          console.log('Profile weight:', data.weight);
        } else {
          console.log('No profile data found');
        }
      } catch (err) {
        console.error('Exception fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const metrics = getHealthMetrics();
  const connectedDevices = devices.filter(d => d.is_connected).length;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 animate-slide-up">
      <Card className="prevent-card hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-roboto text-gray-600">Общий риск</p>
              <p className="text-lg md:text-2xl font-montserrat font-bold text-green-600">Низкий</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500">Улучшается</span>
              </div>
            </div>
            <div className="prevent-icon-container bg-green-100 w-8 h-8 md:w-12 md:h-12">
              <Shield className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="prevent-card hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-roboto text-gray-600">Устройства</p>
              <p className="text-lg md:text-2xl font-montserrat font-bold text-blue-600">{connectedDevices}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Активно</span>
              </div>
            </div>
            <div className="prevent-icon-container bg-blue-100 w-8 h-8 md:w-12 md:h-12">
              <Smartphone className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="prevent-card hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-roboto text-gray-600">Вес</p>
              {loading ? (
                <p className="text-lg md:text-2xl font-montserrat font-bold text-purple-600">...</p>
              ) : (
                <p className="text-lg md:text-2xl font-montserrat font-bold text-purple-600">
                  {profile?.weight ? (
                    <>
                      {profile.weight}
                      <span className="text-xs md:text-sm text-gray-500 ml-1">кг</span>
                    </>
                  ) : (
                    <span className="text-base text-gray-400">Не указан</span>
                  )}
                </p>
              )}
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-500">
                  {profile?.weight ? 'Данные профиля' : 'Заполните профиль'}
                </span>
              </div>
            </div>
            <div className="prevent-icon-container bg-purple-100 w-8 h-8 md:w-12 md:h-12">
              <Weight className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="prevent-card hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-roboto text-gray-600">Пульс</p>
              <p className="text-lg md:text-2xl font-montserrat font-bold text-pink-600">
                {metrics.avgHeartRate || '--'}
                {metrics.avgHeartRate && <span className="text-xs md:text-sm text-gray-500 ml-1">bpm</span>}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">В норме</span>
              </div>
            </div>
            <div className="prevent-icon-container bg-pink-100 w-8 h-8 md:w-12 md:h-12">
              <Heart className="w-4 h-4 md:w-6 md:h-6 text-pink-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthMetricsCards;
